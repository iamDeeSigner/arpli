import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { schema, type ArpliDb } from '@arpli/db';
import type {
  Opportunity,
  OpportunityDraft,
  OpportunityQuestion,
  OpportunityStatus,
  OpportunityType,
} from '@arpli/shared';
import {
  type AiConnector,
  type AiRequest,
  AiProviderError,
} from '../ai/types.js';

/**
 * Opportunity service — CRUD + parser for opportunities.
 *
 * The service layer stores two JSON-shaped fields (`questions`, `tags`) as
 * text columns. All boundary methods accept and return the parsed object
 * shapes defined in `@arpli/shared`; the raw text columns never leak out.
 */

const OPPORTUNITY_TYPES: ReadonlyArray<OpportunityType> = [
  'scholarship',
  'grant',
  'fellowship',
  'accelerator',
  'job',
  'other',
];

const OPPORTUNITY_STATUSES: ReadonlyArray<OpportunityStatus> = ['active', 'archived'];

export function isOpportunityType(value: unknown): value is OpportunityType {
  return typeof value === 'string' && (OPPORTUNITY_TYPES as readonly string[]).includes(value);
}

export function isOpportunityStatus(value: unknown): value is OpportunityStatus {
  return typeof value === 'string' && (OPPORTUNITY_STATUSES as readonly string[]).includes(value);
}

function nowIso(): string {
  return new Date().toISOString();
}

function newId(): string {
  return randomUUID();
}

/** Fields the caller may set when creating a new opportunity. */
export interface CreateOpportunityInput {
  title: string;
  type: OpportunityType;
  organization?: string | null;
  url?: string | null;
  deadline?: string | null;
  eligibility?: string | null;
  questions?: OpportunityQuestion[];
  description?: string | null;
  tags?: string[];
  status?: OpportunityStatus;
}

/** Patch for `update()`. Every field is optional and may be nulled. */
export interface UpdateOpportunityInput {
  title?: string;
  type?: OpportunityType;
  organization?: string | null;
  url?: string | null;
  deadline?: string | null;
  eligibility?: string | null;
  questions?: OpportunityQuestion[] | null;
  description?: string | null;
  tags?: string[] | null;
  status?: OpportunityStatus;
}

export class OpportunityService {
  constructor(private readonly db: ArpliDb) {}

  async create(input: CreateOpportunityInput): Promise<Opportunity> {
    if (!input.title?.trim()) throw new Error('opportunity.title is required');
    if (!isOpportunityType(input.type)) {
      throw new Error(`invalid opportunity type: ${String(input.type)}`);
    }
    const now = nowIso();
    const row = {
      id: newId(),
      title: input.title.trim(),
      type: input.type,
      organization: input.organization ?? null,
      url: input.url ?? null,
      deadline: input.deadline ?? null,
      eligibility: input.eligibility ?? null,
      questions: encodeQuestions(input.questions),
      description: input.description ?? null,
      tags: encodeTags(input.tags),
      status: input.status ?? 'active',
      createdAt: now,
      updatedAt: now,
    };
    await this.db.insert(schema.opportunities).values(row);
    return this.toOpportunity(row);
  }

  async get(id: string): Promise<Opportunity | null> {
    const row = await this.db.query.opportunities.findFirst({
      where: eq(schema.opportunities.id, id),
    });
    return row ? this.toOpportunity(row) : null;
  }

  /** All opportunities, most recently updated first. */
  async list(): Promise<Opportunity[]> {
    const rows = await this.db.select().from(schema.opportunities).all();
    return rows
      .map((r) => this.toOpportunity(r))
      .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''));
  }

  async update(id: string, patch: UpdateOpportunityInput): Promise<Opportunity> {
    const existing = await this.get(id);
    if (!existing) throw new Error(`opportunity not found: ${id}`);

    if (patch.type !== undefined && !isOpportunityType(patch.type)) {
      throw new Error(`invalid opportunity type: ${String(patch.type)}`);
    }
    if (patch.status !== undefined && !isOpportunityStatus(patch.status)) {
      throw new Error(`invalid opportunity status: ${String(patch.status)}`);
    }
    if (patch.title !== undefined && !patch.title.trim()) {
      throw new Error('opportunity.title cannot be empty');
    }

    const next: Partial<typeof schema.opportunities.$inferInsert> = {
      updatedAt: nowIso(),
    };
    if (patch.title !== undefined) next.title = patch.title.trim();
    if (patch.type !== undefined) next.type = patch.type;
    if (patch.organization !== undefined) next.organization = patch.organization;
    if (patch.url !== undefined) next.url = patch.url;
    if (patch.deadline !== undefined) next.deadline = patch.deadline;
    if (patch.eligibility !== undefined) next.eligibility = patch.eligibility;
    if (patch.description !== undefined) next.description = patch.description;
    if (patch.status !== undefined) next.status = patch.status;
    if (patch.questions !== undefined) {
      next.questions = patch.questions === null ? null : encodeQuestions(patch.questions);
    }
    if (patch.tags !== undefined) {
      next.tags = patch.tags === null ? null : encodeTags(patch.tags);
    }

    await this.db
      .update(schema.opportunities)
      .set(next)
      .where(eq(schema.opportunities.id, id));
    return (await this.get(id))!;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(schema.opportunities).where(eq(schema.opportunities.id, id));
  }

  async archive(id: string): Promise<Opportunity> {
    return this.update(id, { status: 'archived' });
  }

  private toOpportunity(row: typeof schema.opportunities.$inferSelect): Opportunity {
    return {
      id: row.id,
      title: row.title,
      type: row.type as OpportunityType,
      organization: row.organization ?? null,
      url: row.url ?? null,
      deadline: row.deadline ?? null,
      eligibility: row.eligibility ?? null,
      questions: row.questions ?? null,
      description: row.description ?? null,
      tags: row.tags ?? null,
      status: row.status as OpportunityStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}

// ──────────────────────────── Parser ────────────────────────────

/**
 * Draft shape returned by every parser method. Fields may be empty when the
 * source does not carry them — the UI prompts the user to fill the gaps.
 */
export type ParsedOpportunity = OpportunityDraft;

/** Error raised when the parser cannot produce usable output. */
export class OpportunityParserError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'OpportunityParserError';
  }
}

/**
 * Loader for the AI connector. Injected so tests can stub it with a fake
 * connector that returns deterministic JSON.
 */
export type ConnectorLoader = () => AiConnector | null;

/** Thin wrapper so the parser can `await import("pdf-parse")` in tests. */
export type PdfTextExtractor = (buffer: Buffer) => Promise<string>;

async function defaultPdfExtract(buffer: Buffer): Promise<string> {
  // pdf-parse is CommonJS; use the default export.
  const { default: pdfParse } = await import('pdf-parse');
  const result = await pdfParse(buffer);
  return result.text ?? '';
}

export class OpportunityParserService {
  constructor(
    private readonly loadConnector: ConnectorLoader,
    private readonly pdfExtract: PdfTextExtractor = defaultPdfExtract,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  /** Parse free-form text into a draft opportunity using the active LLM. */
  async parseFromText(text: string): Promise<ParsedOpportunity> {
    const trimmed = text?.trim();
    if (!trimmed) {
      throw new OpportunityParserError('cannot parse empty text');
    }
    const connector = this.loadConnector();
    if (!connector) {
      throw new OpportunityParserError('no active AI provider configured');
    }

    const request: AiRequest = {
      systemPrompt: PARSER_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildExtractionPrompt(trimmed) }],
      temperature: 0,
      maxTokens: 2048,
    };

    let content: string;
    try {
      const response = await connector.complete(request);
      content = response.content;
    } catch (err) {
      if (err instanceof AiProviderError) {
        throw new OpportunityParserError(`AI provider failed: ${err.message}`, err);
      }
      throw new OpportunityParserError('AI provider call failed', err);
    }

    const parsed = extractJson(content);
    if (!parsed) {
      throw new OpportunityParserError('AI returned non-JSON output');
    }
    return normaliseDraft(parsed, trimmed);
  }

  /**
   * Fetch the URL (best-effort), strip HTML, and parse. Network errors raise
   * `OpportunityParserError` with a readable message — the caller surfaces it.
   */
  async parseFromUrl(url: string): Promise<ParsedOpportunity> {
    const target = url?.trim();
    if (!target) throw new OpportunityParserError('url is required');
    try {
      new URL(target);
    } catch {
      throw new OpportunityParserError(`invalid url: ${target}`);
    }

    let body: string;
    try {
      const res = await this.fetchImpl(target, {
        headers: { 'user-agent': 'ArpliOpportunityParser/0.1' },
        redirect: 'follow',
      });
      if (!res.ok) {
        throw new OpportunityParserError(
          `fetch ${target} failed: ${res.status} ${res.statusText}`,
        );
      }
      body = await res.text();
    } catch (err) {
      if (err instanceof OpportunityParserError) throw err;
      throw new OpportunityParserError(
        `fetch ${target} failed: ${err instanceof Error ? err.message : String(err)}`,
        err,
      );
    }

    const text = stripHtml(body);
    const draft = await this.parseFromText(text);
    // Prefer the submitted URL if the AI did not echo one.
    return { ...draft, url: draft.url ?? target };
  }

  /** Extract text from a PDF buffer and parse. */
  async parseFromPdf(buffer: Buffer): Promise<ParsedOpportunity> {
    if (!buffer || buffer.byteLength === 0) {
      throw new OpportunityParserError('pdf buffer is empty');
    }
    let text: string;
    try {
      text = await this.pdfExtract(buffer);
    } catch (err) {
      throw new OpportunityParserError(
        `pdf extraction failed: ${err instanceof Error ? err.message : String(err)}`,
        err,
      );
    }
    if (!text.trim()) {
      throw new OpportunityParserError('pdf contained no extractable text');
    }
    return this.parseFromText(text);
  }
}

// ──────────────────────────── helpers ────────────────────────────

const PARSER_SYSTEM_PROMPT = `You extract structured application opportunities from free-form text.

The user will paste the body of a scholarship, grant, fellowship, accelerator, job, or
similar description. Return a single JSON object matching this TypeScript type and
nothing else — no commentary, no markdown fences, no leading text:

type OpportunityDraft = {
  title: string;                        // The posted name of the opportunity.
  type: "scholarship" | "grant" | "fellowship" | "accelerator" | "job" | "other";
  organization: string | null;          // The organisation offering it, if named.
  url: string | null;                   // The canonical URL, if present in the text.
  deadline: string | null;              // ISO 8601 date (YYYY-MM-DD) if a deadline is given.
  eligibility: string | null;           // Free-form eligibility statement.
  questions: Array<{                    // The application prompts, in order.
    id: string;                         // short machine id, e.g. "q1", "q2".
    text: string;                       // The question verbatim.
    wordLimit?: number;                 // Word limit if stated.
  }>;
  description: string | null;           // One or two sentence summary.
  tags: string[];                       // Short free-form tags, lowercase.
};

Rules:
- Use null for strings you cannot determine; use [] for empty question/tag lists.
- Never invent fields that are not present in the source text.
- Return the JSON object only. Do not wrap it in markdown.`;

function buildExtractionPrompt(source: string): string {
  // Clip very long bodies — the AI only needs the structured parts, and
  // many providers charge per token. 24 kB is roughly 5-6k words.
  const clipped = source.length > 24_000 ? `${source.slice(0, 24_000)}…` : source;
  return `Extract the opportunity from the text below.

<<<SOURCE_TEXT>>>
${clipped}
<<<END_SOURCE_TEXT>>>`;
}

/** Pull a JSON object out of model output, tolerating code fences and prose. */
export function extractJson(output: string): unknown | null {
  if (!output) return null;
  // Strip common markdown fence wrappers.
  const fenced = output.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : output;

  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  const slice = candidate.slice(start, end + 1);
  try {
    return JSON.parse(slice);
  } catch {
    return null;
  }
}

/** Coerce whatever the model returned into a safe `OpportunityDraft`. */
export function normaliseDraft(value: unknown, sourceText: string): ParsedOpportunity {
  const obj = (value ?? {}) as Record<string, unknown>;
  const type = isOpportunityType(obj.type) ? obj.type : 'other';
  const title = asTrimmedString(obj.title) ?? 'Untitled opportunity';
  const organization = asTrimmedString(obj.organization);
  const url = asTrimmedString(obj.url);
  const deadline = asIsoDate(obj.deadline);
  const eligibility = asTrimmedString(obj.eligibility);
  const description = asTrimmedString(obj.description) ?? makeFallbackSummary(sourceText);

  const questions = normaliseQuestions(obj.questions);
  const tags = normaliseTags(obj.tags);

  return {
    title,
    type,
    organization,
    url,
    deadline,
    eligibility,
    questions,
    description,
    tags,
  };
}

export function normaliseQuestions(value: unknown): OpportunityQuestion[] {
  if (!Array.isArray(value)) return [];
  const out: OpportunityQuestion[] = [];
  for (const [index, raw] of value.entries()) {
    if (!raw || typeof raw !== 'object') continue;
    const q = raw as Record<string, unknown>;
    const text = asTrimmedString(q.text);
    if (!text) continue;
    const id = asTrimmedString(q.id) ?? `q${index + 1}`;
    const limit = asPositiveInt(q.wordLimit);
    out.push(limit ? { id, text, wordLimit: limit } : { id, text });
  }
  return out;
}

export function normaliseTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const raw of value) {
    const tag = asTrimmedString(raw);
    if (tag) out.push(tag.toLowerCase());
  }
  return [...new Set(out)];
}

function asTrimmedString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

function asPositiveInt(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return null;
  return Math.trunc(value);
}

function asIsoDate(value: unknown): string | null {
  const str = asTrimmedString(value);
  if (!str) return null;
  // Accept full ISO or just YYYY-MM-DD.
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function makeFallbackSummary(sourceText: string): string | null {
  const first = sourceText.split(/\r?\n{2,}/).map((p) => p.trim()).find(Boolean);
  if (!first) return null;
  return first.length > 400 ? `${first.slice(0, 397)}...` : first;
}

/** JSON-encode an array for storage. `null` round-trips to `null`. */
export function encodeQuestions(value: OpportunityQuestion[] | null | undefined): string | null {
  if (!value || value.length === 0) return null;
  return JSON.stringify(value);
}

export function encodeTags(value: string[] | null | undefined): string | null {
  if (!value || value.length === 0) return null;
  return JSON.stringify(value);
}

/**
 * Very conservative HTML → text — drops `<script>` / `<style>` blocks and
 * strips tags. Good enough for scholarship pages; feature-grade readability
 * extraction can come later.
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<\/?(?:p|div|br|section|article|li|tr|td|h[1-6])[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
