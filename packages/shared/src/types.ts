// Profile domain
export type ProfileMode = 'student' | 'founder' | 'researcher' | 'professional';

export interface Profile {
  id: string;
  userId: string;
  mode: ProfileMode;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileEducation {
  id: string;
  profileId: string;
  institution: string;
  degree: string | null;
  field: string | null;
  startYear: number | null;
  endYear: number | null;
  gpa: number | null;
  honors: string | null;
}

export interface ProfileWork {
  id: string;
  profileId: string;
  company: string;
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  current: boolean;
}

export interface ProfileProject {
  id: string;
  profileId: string;
  name: string;
  description: string | null;
  url: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface ProfileAccomplishment {
  id: string;
  profileId: string;
  title: string;
  description: string | null;
  date: string | null;
  category: string | null;
}

export interface ProfileEssay {
  id: string;
  profileId: string;
  title: string;
  content: string;
  wordCount: number;
  tags: string | null;
  createdAt: string;
}

// Opportunity domain
export type OpportunityType =
  | 'scholarship'
  | 'grant'
  | 'fellowship'
  | 'accelerator'
  | 'job'
  | 'other';

export type OpportunityStatus = 'active' | 'archived';

/**
 * One prompt an applicant has to answer. `wordLimit` is optional because
 * many opportunities state a count only on some of their questions.
 */
export interface OpportunityQuestion {
  id: string;
  text: string;
  wordLimit?: number;
}

export interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  organization: string | null;
  url: string | null;
  deadline: string | null;
  eligibility: string | null;
  /** JSON string: `OpportunityQuestion[]`. Null when none have been extracted yet. */
  questions: string | null;
  description: string | null;
  /** JSON string: `string[]` of free-form tags. */
  tags: string | null;
  status: OpportunityStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Shape returned by `/opportunities/intake` and consumed by the Save step.
 * Everything optional because the parser may fail to extract some fields.
 */
export interface OpportunityDraft {
  title: string;
  type: OpportunityType;
  organization: string | null;
  url: string | null;
  deadline: string | null;
  eligibility: string | null;
  questions: OpportunityQuestion[];
  description: string | null;
  tags: string[];
}

// Application domain
export type ApplicationStatus =
  | 'discovered'
  | 'qualifying'
  | 'drafting'
  | 'reviewing'
  | 'submitted'
  | 'awaiting'
  | 'won'
  | 'rejected'
  | 'waitlisted'
  | 'withdrew';

export interface Application {
  id: string;
  opportunityId: string;
  profileId: string;
  status: ApplicationStatus;
  notes: string | null;
  submittedAt: string | null;
  createdAt: string;
}

export interface ApplicationDraft {
  id: string;
  applicationId: string;
  /** Stable OpportunityQuestion.id, when the draft answers a stored question. */
  questionId: string | null;
  questionText: string;
  draftContent: string;
  wordCount: number;
  /**
   * Monotonically increasing per (applicationId, questionId|questionText).
   * Version 1 is the first AI draft; later versions include manual edits and
   * regenerations.
   */
  version: number;
  aiModel: string | null;
  /** Tone label the drafter was asked to adopt, if any. */
  tone: string | null;
  /** Free-form instructions attached to this revision, if any. */
  instructions: string | null;
  createdAt: string;
}

/**
 * Input for drafting a single answer. Either `questionId` + opportunity
 * context, or a free-form `questionText`.
 */
export interface DraftAnswerInput {
  applicationId: string;
  /** The question's stable id (from the opportunity). Null for free-form. */
  questionId?: string | null;
  /** The question text — required so the drafter has something to answer. */
  questionText: string;
  /** Word-cap the drafter is required to respect. */
  wordLimit?: number | null;
  /** Short tone label — "concise", "warm", "formal", … */
  tone?: string | null;
  /**
   * Optional revision instruction ("make it shorter", "lead with the
   * research project", "rephrase the opening"). Appended to the system
   * prompt so the model treats it as the user's steering.
   */
  instructions?: string | null;
  /**
   * Optional previous draft text. When present, the drafter treats this
   * call as a revision of that draft; without it, it treats the call as
   * the first draft.
   */
  previousDraft?: string | null;
}

/**
 * The envelope returned by `/applications/:id/draft`. The draft row itself
 * is already saved to the database; this gives the UI the content, word
 * count, and the model that produced it so a regenerate button can switch
 * models without a round-trip.
 */
export interface DraftAnswerResult {
  draft: ApplicationDraft;
  /** True when the generated draft respected `wordLimit`. */
  withinLimit: boolean;
}

// AI connector domain
export type AiProviderKind = 'ollama' | 'groq' | 'google' | 'anthropic' | 'openai' | 'gemini';

export type AiProviderTier = 'local' | 'free-cloud' | 'paid';

export interface AiProviderConfig {
  kind: AiProviderKind;
  tier: AiProviderTier;
  model: string;
  apiKey?: string;
  baseUrl?: string;
}

// Daemon ↔ Desktop IPC
export interface DaemonHealth {
  ok: boolean;
  version: string;
  dbReady: boolean;
}
