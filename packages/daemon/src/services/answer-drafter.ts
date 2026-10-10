import { randomUUID } from 'node:crypto';
import { desc, eq } from 'drizzle-orm';
import { schema, type ArpliDb } from '@arpli/db';
import type { ApplicationDraft, DraftAnswerInput, DraftAnswerResult } from '@arpli/shared';
import {
  AiProviderError,
  type AiConnector,
  type AiMessage,
  type AiRequest,
} from '../ai/types.js';
import { buildSystemPrompt } from '../ai/context.js';

/**
 * AnswerDrafterService — turn one application question into a saved draft
 * via the active AI connector.
 *
 * This is the one place the "how do we prompt the model to answer an
 * application question" lives. The route handler is thin: it validates
 * input, calls `.draft()`, and returns what we persisted. Tests inject a
 * fake connector loader so no real model is called.
 *
 * Versioning:
 *   - For a given (applicationId, questionId OR questionText), each saved
 *     row gets `version = max(previous) + 1`. UIs show the latest version
 *     and let the user list older ones.
 */

/** Narrow strings so we never persist leaked whitespace. */
function cleanText(s: string | null | undefined): string | null {
  if (s === null || s === undefined) return null;
  const trimmed = s.trim();
  return trimmed.length === 0 ? null : trimmed;
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/u).length;
}

/** Loader for the AI connector. Injected so tests can stub it. */
export type ConnectorLoader = () => AiConnector | null;

export class AnswerDrafterError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'AnswerDrafterError';
  }
}

export class AnswerDrafterService {
  constructor(
    private readonly db: ArpliDb,
    private readonly loadConnector: ConnectorLoader,
  ) {}

  /**
   * Draft a single answer: call the active AI connector with a
   * profile-grounded system prompt, enforce the word limit in the prompt,
   * persist the result, and return it.
   */
  async draft(input: DraftAnswerInput): Promise<DraftAnswerResult> {
    const questionText = (input.questionText ?? '').trim();
    if (!questionText) {
      throw new AnswerDrafterError('questionText is required');
    }

    const application = await this.db.query.applications.findFirst({
      where: eq(schema.applications.id, input.applicationId),
    });
    if (!application) {
      throw new AnswerDrafterError(`application not found: ${input.applicationId}`);
    }

    const connector = this.loadConnector();
    if (!connector) {
      throw new AnswerDrafterError(
        'No active AI provider configured. Add one under Settings → AI.',
      );
    }

    const wordLimit =
      typeof input.wordLimit === 'number' && input.wordLimit > 0
        ? Math.round(input.wordLimit)
        : null;
    const tone = cleanText(input.tone);
    const instructions = cleanText(input.instructions);
    const previousDraft = cleanText(input.previousDraft);

    const systemPrompt = buildSystemPrompt(
      this.db,
      application.profileId,
      application.opportunityId,
    );

    const messages: AiMessage[] = [];
    const userBlocks: string[] = [];
    userBlocks.push(`## Question\n${questionText}`);
    if (wordLimit) {
      userBlocks.push(
        `## Word limit\n${wordLimit} words. Do not exceed this limit. Prefer slightly under over slightly over.`,
      );
    }
    if (tone) {
      userBlocks.push(`## Tone\n${tone}`);
    }
    if (previousDraft) {
      userBlocks.push(`## Previous draft\n${previousDraft}`);
    }
    if (instructions) {
      userBlocks.push(`## Instruction\n${instructions}`);
    }
    userBlocks.push(
      '## Task',
      previousDraft
        ? 'Revise the previous draft using the instruction above. Return only the revised answer — no preamble, no quotation of the instruction, no meta-commentary.'
        : 'Draft an answer to the question using only the applicant history in the system prompt. Return only the answer — no preamble, no bullet points unless the question asks for them, no meta-commentary.',
    );
    messages.push({ role: 'user', content: userBlocks.join('\n\n') });

    const request: AiRequest = {
      messages,
      systemPrompt: systemPrompt || undefined,
      // Give the model a reasonable ceiling: at least ~4× the word budget
      // so it can self-correct, with a 2000-token hard cap.
      maxTokens: wordLimit ? Math.min(2000, Math.max(300, wordLimit * 4)) : 1200,
      temperature: 0.6,
    };

    let content: string;
    let model: string;
    try {
      const response = await connector.complete(request);
      content = (response.content ?? '').trim();
      model = response.model;
    } catch (err) {
      if (err instanceof AiProviderError) throw err;
      throw new AnswerDrafterError(
        err instanceof Error ? err.message : String(err),
        err,
      );
    }

    if (!content) {
      throw new AnswerDrafterError('AI returned an empty draft');
    }

    const wordCount = countWords(content);
    const withinLimit = wordLimit === null || wordCount <= wordLimit;

    const draft = await this.saveDraft({
      applicationId: application.id,
      questionId: input.questionId ?? null,
      questionText,
      draftContent: content,
      wordCount,
      aiModel: model,
      tone,
      instructions,
    });

    return { draft, withinLimit };
  }

  /**
   * Persist a draft (AI-generated or user-edited). Each save bumps the
   * version within the (application, question) group.
   */
  async saveDraft(input: {
    applicationId: string;
    questionId: string | null;
    questionText: string;
    draftContent: string;
    wordCount?: number;
    aiModel?: string | null;
    tone?: string | null;
    instructions?: string | null;
  }): Promise<ApplicationDraft> {
    const trimmed = input.draftContent.trim();
    if (!trimmed) throw new AnswerDrafterError('draftContent is required');

    const previous = await this.latestForQuestion(
      input.applicationId,
      input.questionId,
      input.questionText,
    );
    const nextVersion = previous ? previous.version + 1 : 1;

    const row = {
      id: randomUUID(),
      applicationId: input.applicationId,
      questionId: input.questionId ?? null,
      questionText: input.questionText,
      draftContent: trimmed,
      wordCount: input.wordCount ?? countWords(trimmed),
      version: nextVersion,
      aiModel: input.aiModel ?? null,
      tone: input.tone ?? null,
      instructions: input.instructions ?? null,
      createdAt: new Date().toISOString(),
    };

    await this.db.insert(schema.applicationDrafts).values(row);
    return this.toDraft(row);
  }

  /** All draft versions for an application, newest first. */
  async listDrafts(applicationId: string): Promise<ApplicationDraft[]> {
    const rows = await this.db
      .select()
      .from(schema.applicationDrafts)
      .where(eq(schema.applicationDrafts.applicationId, applicationId))
      .orderBy(desc(schema.applicationDrafts.createdAt))
      .all();
    return rows.map((r) => this.toDraft(r));
  }

  /** The latest draft row for one question, or null when none exist. */
  async latestForQuestion(
    applicationId: string,
    questionId: string | null | undefined,
    questionText: string,
  ): Promise<ApplicationDraft | null> {
    const rows = await this.db
      .select()
      .from(schema.applicationDrafts)
      .where(eq(schema.applicationDrafts.applicationId, applicationId))
      .orderBy(desc(schema.applicationDrafts.version))
      .all();

    const match = rows.find((r) => {
      if (questionId) return r.questionId === questionId;
      return r.questionText === questionText && !r.questionId;
    });
    return match ? this.toDraft(match) : null;
  }

  /** All versions for one question, newest first. */
  async versionsForQuestion(
    applicationId: string,
    questionId: string | null | undefined,
    questionText: string,
  ): Promise<ApplicationDraft[]> {
    const all = await this.listDrafts(applicationId);
    return all.filter((d) => {
      if (questionId) return d.questionId === questionId;
      return d.questionText === questionText && !d.questionId;
    });
  }

  async getDraft(id: string): Promise<ApplicationDraft | null> {
    const row = await this.db.query.applicationDrafts.findFirst({
      where: eq(schema.applicationDrafts.id, id),
    });
    return row ? this.toDraft(row) : null;
  }

  async deleteDraft(id: string): Promise<void> {
    await this.db
      .delete(schema.applicationDrafts)
      .where(eq(schema.applicationDrafts.id, id));
  }

  private toDraft(row: typeof schema.applicationDrafts.$inferSelect): ApplicationDraft {
    return {
      id: row.id,
      applicationId: row.applicationId,
      questionId: row.questionId ?? null,
      questionText: row.questionText,
      draftContent: row.draftContent,
      wordCount: row.wordCount,
      version: row.version,
      aiModel: row.aiModel ?? null,
      tone: row.tone ?? null,
      instructions: row.instructions ?? null,
      createdAt: row.createdAt,
    };
  }
}

