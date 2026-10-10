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

export type OpportunityStatus = 'open' | 'closed' | 'archived';

export interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  organization: string | null;
  description: string | null;
  requirements: string | null;
  eligibility: string | null;
  deadline: string | null;
  wordLimits: string | null;
  status: OpportunityStatus;
  rawText: string | null;
  url: string | null;
  createdAt: string;
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
  questionText: string;
  draftContent: string;
  wordCount: number;
  version: number;
  aiModel: string | null;
  createdAt: string;
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
