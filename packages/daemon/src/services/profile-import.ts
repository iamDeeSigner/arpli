import AdmZip from 'adm-zip';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import type {
  ProfileAccomplishment,
  ProfileEducation,
  ProfileProject,
  ProfileWork,
} from '@arpli/shared';

import type { AiConnector } from '../ai/types.js';
import { ProfileService } from './profile.js';

/**
 * Profile import service.
 *
 * Turns an uploaded document — PDF resume, DOCX resume, or a LinkedIn data
 * export (either the full `.zip` LinkedIn ships or the loose JSON/CSV files
 * inside it) — into the sub-entity preview shape used by the Profile
 * Engine. The flow is always:
 *
 *   1. Extract raw text / rows from the source file.
 *   2. If a resume (free text), ask the active AI connector to extract
 *      structure. If a LinkedIn export, parse directly without an LLM.
 *   3. Return a `ImportPreview` the UI can show for user confirmation.
 *   4. On confirm, `applyPreview()` writes the chosen rows through the
 *      ProfileService.
 *
 * All parsers are pure (no I/O) and are exported so the test harness can
 * exercise them without touching an LLM or an HTTP endpoint.
 */

export type ImportSource = 'pdf' | 'docx' | 'linkedin-json' | 'linkedin-zip' | 'text';

export interface ImportEducationInput {
  institution: string;
  degree?: string | null;
  field?: string | null;
  startYear?: number | null;
  endYear?: number | null;
  gpa?: number | null;
  honors?: string | null;
}

export interface ImportWorkInput {
  company: string;
  title: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  current?: boolean;
}

export interface ImportProjectInput {
  name: string;
  description?: string | null;
  url?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface ImportAccomplishmentInput {
  title: string;
  description?: string | null;
  date?: string | null;
  category?: string | null;
}

/**
 * Preview the parser hands back before any DB writes. All lists are
 * optional — a low-quality parse may fill only a subset.
 */
export interface ImportPreview {
  source: ImportSource;
  bio?: string | null;
  education: ImportEducationInput[];
  work: ImportWorkInput[];
  projects: ImportProjectInput[];
  accomplishments: ImportAccomplishmentInput[];
  skills: string[];
  /** Non-fatal notes to surface in the UI (truncated text, missing fields, etc.). */
  warnings: string[];
  /**
   * 0–1 confidence score. 0 means "nothing recognisable found", 1 means
   * "we're confident every field is from the document". The UI uses this
   * to decide whether to default-select rows in the confirm step.
   */
  confidence: number;
  /** First N characters of the extracted raw text — handy for debugging. */
  rawTextPreview?: string;
}

/** What `applyPreview()` wrote. Returned so the UI can offer undo. */
export interface ImportApplyResult {
  profileId: string;
  educationAdded: ProfileEducation[];
  workAdded: ProfileWork[];
  projectsAdded: ProfileProject[];
  accomplishmentsAdded: ProfileAccomplishment[];
  bioUpdated: boolean;
  skipped: string[];
}

export class ProfileImportService {
  constructor(private readonly profiles: ProfileService) {}

  // ─────────────────────────── Public entry points ───────────────────────────

  /**
   * Turn a resume file (PDF or DOCX) into an ImportPreview. The parser
   * strips the file down to plain text, then — if an AI connector is
   * supplied — asks the LLM to extract structure. Without an AI connector
   * the parser falls back to a very conservative heuristic: it keeps the
   * raw text as the bio and leaves every structured list empty, with a
   * warning. That keeps the import useful even when the user has not yet
   * configured an AI provider.
   */
  async parseResume(
    file: { buffer: Buffer; filename: string; mimetype: string },
    connector: AiConnector | null,
  ): Promise<ImportPreview> {
    const kind = detectDocType(file.filename, file.mimetype);
    if (kind !== 'pdf' && kind !== 'docx') {
      throw new Error(
        `unsupported file type: ${file.mimetype || file.filename} (expected PDF or DOCX)`,
      );
    }
    const text = kind === 'pdf'
      ? await extractTextFromPdf(file.buffer)
      : await extractTextFromDocx(file.buffer);
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        source: kind,
        education: [],
        work: [],
        projects: [],
        accomplishments: [],
        skills: [],
        warnings: [
          `No text could be extracted from ${file.filename}. The file may be a scanned image or password-protected.`,
        ],
        confidence: 0,
        rawTextPreview: '',
      };
    }
    return this.parseResumeText(trimmed, kind, connector);
  }

  /**
   * Convenience wrapper around `parseResume()` for callers that already
   * have the extracted text in hand (unit tests, URL scrape fallback).
   */
  async parseResumeText(
    text: string,
    source: ImportSource,
    connector: AiConnector | null,
  ): Promise<ImportPreview> {
    if (!connector) {
      return {
        source,
        bio: text.length > 500 ? `${text.slice(0, 500).trim()}…` : text.trim(),
        education: [],
        work: [],
        projects: [],
        accomplishments: [],
        skills: [],
        warnings: [
          'No AI provider is configured, so the resume was imported as plain-text bio only. Configure a provider under Settings → AI and re-run the import to extract structured work history and education.',
        ],
        confidence: 0.1,
        rawTextPreview: text.slice(0, 1200),
      };
    }

    const prompt = buildExtractionPrompt(text);
    const response = await connector.complete({
      messages: [{ role: 'user', content: prompt.user }],
      systemPrompt: prompt.system,
      temperature: 0.1,
      maxTokens: 2048,
    });
    const parsed = extractJsonObject(response.content);
    const preview = toPreviewFromAiOutput(parsed, source, text);
    return preview;
  }

  /**
   * Parse a LinkedIn export. The export can arrive two ways:
   * - A full `.zip` the user downloaded from LinkedIn → `kind: 'zip'`.
   * - Loose JSON (either the `Profile.json` file by itself, or a payload
   *   the UI assembled from several JSON files) → `kind: 'json'`.
   *
   * No AI call is needed: LinkedIn's data export is already structured.
   */
  async parseLinkedin(input:
    | { kind: 'zip'; buffer: Buffer }
    | { kind: 'json'; data: unknown }
  ): Promise<ImportPreview> {
    if (input.kind === 'zip') {
      const extracted = extractLinkedinZip(input.buffer);
      return buildLinkedinPreview(extracted, 'linkedin-zip');
    }
    return buildLinkedinPreview(toLinkedinBundle(input.data), 'linkedin-json');
  }

  /**
   * Best-effort LinkedIn profile URL scrape. LinkedIn aggressively blocks
   * unauthenticated scraping, so this is unlikely to succeed from a
   * residential IP without a logged-in session cookie. The method always
   * returns a well-formed `ImportPreview` — on failure it is empty, with a
   * clear warning telling the user to use the Request a copy of your data
   * export instead.
   */
  async parseLinkedinUrl(url: string): Promise<ImportPreview> {
    try {
      const res = await fetch(url, {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
          accept: 'text/html,application/xhtml+xml',
        },
        redirect: 'follow',
      });
      if (!res.ok) {
        return emptyLinkedinUrlPreview(
          `LinkedIn returned HTTP ${res.status}. Public URL scraping is unreliable — use LinkedIn → Settings → Get a copy of your data to produce a JSON export, then import the ZIP instead.`,
        );
      }
      const html = await res.text();
      const bundle = parseLinkedinPublicHtml(html);
      if (!bundle) {
        return emptyLinkedinUrlPreview(
          'LinkedIn served a login wall for this URL. Download your data export (LinkedIn → Settings → Get a copy of your data) and import the ZIP file instead.',
        );
      }
      return buildLinkedinPreview(bundle, 'linkedin-json');
    } catch (err) {
      return emptyLinkedinUrlPreview(
        `Could not fetch ${url}: ${(err as Error).message}. Import the LinkedIn ZIP export instead.`,
      );
    }
  }

  // ─────────────────────────── Apply ───────────────────────────

  /**
   * Write the chosen preview rows through the ProfileService. The caller
   * (route handler or UI) is responsible for filtering the preview down
   * to the rows the user kept.
   */
  async applyPreview(
    profileId: string,
    preview: ImportPreview,
    opts: { updateBio?: boolean } = {},
  ): Promise<ImportApplyResult> {
    const result: ImportApplyResult = {
      profileId,
      educationAdded: [],
      workAdded: [],
      projectsAdded: [],
      accomplishmentsAdded: [],
      bioUpdated: false,
      skipped: [],
    };

    if (opts.updateBio && preview.bio) {
      await this.profiles.updateProfile(profileId, { bio: preview.bio });
      result.bioUpdated = true;
    }

    for (const row of preview.education) {
      if (!row.institution?.trim()) {
        result.skipped.push(`education: missing institution`);
        continue;
      }
      try {
        const added = await this.profiles.addEducation(profileId, {
          institution: row.institution,
          degree: row.degree ?? null,
          field: row.field ?? null,
          startYear: row.startYear ?? null,
          endYear: row.endYear ?? null,
          gpa: row.gpa ?? null,
          honors: row.honors ?? null,
        });
        result.educationAdded.push(added);
      } catch (err) {
        result.skipped.push(`education "${row.institution}": ${(err as Error).message}`);
      }
    }

    for (const row of preview.work) {
      if (!row.company?.trim() || !row.title?.trim()) {
        result.skipped.push(
          `work: missing ${!row.company?.trim() ? 'company' : 'title'}`,
        );
        continue;
      }
      try {
        const added = await this.profiles.addWork(profileId, {
          company: row.company,
          title: row.title,
          description: row.description ?? null,
          startDate: row.startDate ?? null,
          endDate: row.endDate ?? null,
          current: row.current ?? false,
        });
        result.workAdded.push(added);
      } catch (err) {
        result.skipped.push(
          `work "${row.company} / ${row.title}": ${(err as Error).message}`,
        );
      }
    }

    for (const row of preview.projects) {
      if (!row.name?.trim()) {
        result.skipped.push(`project: missing name`);
        continue;
      }
      try {
        const added = await this.profiles.addProject(profileId, {
          name: row.name,
          description: row.description ?? null,
          url: row.url ?? null,
          startDate: row.startDate ?? null,
          endDate: row.endDate ?? null,
        });
        result.projectsAdded.push(added);
      } catch (err) {
        result.skipped.push(`project "${row.name}": ${(err as Error).message}`);
      }
    }

    for (const row of preview.accomplishments) {
      if (!row.title?.trim()) {
        result.skipped.push(`accomplishment: missing title`);
        continue;
      }
      try {
        const added = await this.profiles.addAccomplishment(profileId, {
          title: row.title,
          description: row.description ?? null,
          date: row.date ?? null,
          category: row.category ?? null,
        });
        result.accomplishmentsAdded.push(added);
      } catch (err) {
        result.skipped.push(`accomplishment "${row.title}": ${(err as Error).message}`);
      }
    }

    return result;
  }
}

// ─────────────────────────── Text extraction ───────────────────────────

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  // pdf-parse v1: `pdfParse(dataBuffer)` returns `{ text, numpages, ... }`.
  const result = await pdfParse(buffer);
  return typeof result.text === 'string' ? result.text : '';
}

export async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value ?? '';
}

// ─────────────────────────── LinkedIn parsing ───────────────────────────

/**
 * The subset of LinkedIn's data export we actually read. The LinkedIn
 * export is a ZIP containing many CSV files (`Profile.csv`,
 * `Positions.csv`, …) and a few JSON blobs. For simplicity the service
 * accepts either shape as a normalised "bundle" of rows keyed by section.
 */
export interface LinkedinBundle {
  profile?: Record<string, string> | null;
  positions?: Array<Record<string, string>>;
  education?: Array<Record<string, string>>;
  projects?: Array<Record<string, string>>;
  skills?: Array<Record<string, string> | string>;
  honors?: Array<Record<string, string>>;
  certifications?: Array<Record<string, string>>;
}

export function extractLinkedinZip(zipBuffer: Buffer): LinkedinBundle {
  const zip = new AdmZip(zipBuffer);
  const bundle: LinkedinBundle = {};
  for (const entry of zip.getEntries()) {
    if (entry.isDirectory) continue;
    const name = entry.entryName.toLowerCase();
    const base = name.split('/').pop() ?? name;
    const text = entry.getData().toString('utf8');
    if (!text.trim()) continue;

    if (base === 'profile.csv') {
      const rows = parseCsv(text);
      bundle.profile = rows[0] ?? null;
    } else if (base === 'positions.csv') {
      bundle.positions = parseCsv(text);
    } else if (base === 'education.csv') {
      bundle.education = parseCsv(text);
    } else if (base === 'projects.csv') {
      bundle.projects = parseCsv(text);
    } else if (base === 'skills.csv') {
      bundle.skills = parseCsv(text);
    } else if (base === 'honors.csv' || base === 'awards.csv') {
      bundle.honors = parseCsv(text);
    } else if (base === 'certifications.csv') {
      bundle.certifications = parseCsv(text);
    } else if (base.endsWith('.json')) {
      try {
        const parsed = JSON.parse(text);
        Object.assign(bundle, toLinkedinBundle(parsed));
      } catch {
        // ignore malformed JSON in the export
      }
    }
  }
  return bundle;
}

/**
 * Normalise a free-form JSON blob the UI might pass (either the full
 * `linkedin-profile-export.json`, or an envelope the renderer composed
 * out of several files) into our bundle shape.
 */
export function toLinkedinBundle(data: unknown): LinkedinBundle {
  if (!data || typeof data !== 'object') return {};
  const d = data as Record<string, unknown>;
  const asArray = (v: unknown): Array<Record<string, string>> =>
    Array.isArray(v) ? (v.filter((x) => x && typeof x === 'object') as Array<Record<string, string>>) : [];
  const bundle: LinkedinBundle = {};
  const profileCandidate = pickFirst(d, ['profile', 'Profile']);
  if (profileCandidate && typeof profileCandidate === 'object' && !Array.isArray(profileCandidate)) {
    bundle.profile = profileCandidate as Record<string, string>;
  }
  bundle.positions = asArray(pickFirst(d, ['positions', 'Positions', 'experience', 'experiences']));
  bundle.education = asArray(pickFirst(d, ['education', 'Education']));
  bundle.projects = asArray(pickFirst(d, ['projects', 'Projects']));
  bundle.honors = asArray(pickFirst(d, ['honors', 'Honors', 'awards', 'Awards']));
  bundle.certifications = asArray(pickFirst(d, ['certifications', 'Certifications']));
  const skillsRaw = pickFirst(d, ['skills', 'Skills']);
  if (Array.isArray(skillsRaw)) {
    bundle.skills = skillsRaw as Array<Record<string, string> | string>;
  }
  return bundle;
}

function pickFirst(obj: Record<string, unknown>, keys: string[]): unknown {
  for (const k of keys) {
    if (k in obj) return obj[k];
  }
  return undefined;
}

export function buildLinkedinPreview(
  bundle: LinkedinBundle,
  source: ImportSource,
): ImportPreview {
  const warnings: string[] = [];

  const work: ImportWorkInput[] = (bundle.positions ?? []).map((row) => {
    const started = row['Started On'] || row['startDate'] || row['Start Date'] || row['started'] || '';
    const finished = row['Finished On'] || row['endDate'] || row['End Date'] || row['finished'] || '';
    return {
      company: pickString(row, ['Company Name', 'company', 'Company']) || 'Unknown',
      title: pickString(row, ['Title', 'title', 'Position']) || 'Unknown role',
      description: pickString(row, ['Description', 'description']) || null,
      startDate: normalizeLinkedinDate(started) || null,
      endDate: normalizeLinkedinDate(finished) || null,
      current: !finished && Boolean(started),
    };
  });

  const education: ImportEducationInput[] = (bundle.education ?? []).map((row) => {
    const start = pickString(row, ['Start Date', 'startDate', 'Started On']);
    const end = pickString(row, ['End Date', 'endDate', 'Finished On']);
    return {
      institution:
        pickString(row, ['School Name', 'school', 'institution', 'School']) || 'Unknown school',
      degree: pickString(row, ['Degree Name', 'degree', 'Degree']) || null,
      field: pickString(row, ['Field Of Study', 'field', 'Field of Study']) || null,
      startYear: toYear(start),
      endYear: toYear(end),
      gpa: toNumber(pickString(row, ['Grade', 'gpa', 'GPA'])),
      honors: pickString(row, ['Activities and Societies', 'honors']) || null,
    };
  });

  const projects: ImportProjectInput[] = (bundle.projects ?? []).map((row) => ({
    name: pickString(row, ['Title', 'name', 'Project', 'title']) || 'Untitled project',
    description: pickString(row, ['Description', 'description']) || null,
    url: pickString(row, ['Url', 'URL', 'url', 'link']) || null,
    startDate: normalizeLinkedinDate(pickString(row, ['Started On', 'startDate', 'Start Date'])),
    endDate: normalizeLinkedinDate(pickString(row, ['Finished On', 'endDate', 'End Date'])),
  }));

  const accomplishments: ImportAccomplishmentInput[] = [
    ...(bundle.honors ?? []).map((row) => ({
      title: pickString(row, ['Title', 'name']) || 'Untitled honor',
      description:
        pickString(row, ['Description', 'description']) ||
        pickString(row, ['Issuer', 'issuer']) ||
        null,
      date: normalizeLinkedinDate(
        pickString(row, ['Issued On', 'issuedOn', 'Date', 'date']),
      ),
      category: 'honor',
    })),
    ...(bundle.certifications ?? []).map((row) => ({
      title: pickString(row, ['Name', 'name', 'Title']) || 'Untitled certification',
      description: pickString(row, ['Authority', 'issuer', 'Issuer']) || null,
      date: normalizeLinkedinDate(
        pickString(row, ['Started On', 'issuedOn', 'Issued On']),
      ),
      category: 'certification',
    })),
  ];

  const skills: string[] = [];
  for (const s of bundle.skills ?? []) {
    if (typeof s === 'string') {
      if (s.trim()) skills.push(s.trim());
    } else if (s && typeof s === 'object') {
      const name = pickString(s as Record<string, string>, ['Name', 'name', 'Skill']);
      if (name) skills.push(name);
    }
  }

  const bio = buildLinkedinBio(bundle.profile ?? null) || null;

  if (work.length === 0 && education.length === 0) {
    warnings.push(
      'The LinkedIn export did not contain Positions.csv or Education.csv. Make sure you selected "The works!" (or at least Profile + Positions + Education) when requesting the data export.',
    );
  }

  const totalRows = work.length + education.length + projects.length + accomplishments.length;
  const confidence = clamp01(totalRows === 0 ? 0.1 : Math.min(1, 0.4 + totalRows * 0.08));

  return {
    source,
    bio,
    education,
    work,
    projects,
    accomplishments,
    skills: dedupeStrings(skills),
    warnings,
    confidence,
  };
}

function buildLinkedinBio(profile: Record<string, string> | null): string | null {
  if (!profile) return null;
  const headline = pickString(profile, ['Headline', 'headline']);
  const summary = pickString(profile, ['Summary', 'summary', 'About']);
  const parts = [headline, summary].filter((p): p is string => !!p && p.trim().length > 0);
  return parts.length > 0 ? parts.join('\n\n') : null;
}

function emptyLinkedinUrlPreview(warning: string): ImportPreview {
  return {
    source: 'linkedin-json',
    education: [],
    work: [],
    projects: [],
    accomplishments: [],
    skills: [],
    warnings: [warning],
    confidence: 0,
  };
}

/**
 * Minimal scraper for a public LinkedIn profile page. LinkedIn now
 * serves login walls for most unauthenticated requests, so this is
 * truly best-effort. If the HTML contains a JSON-LD `Person` block we
 * use it; otherwise we return null and the caller surfaces a warning.
 */
export function parseLinkedinPublicHtml(html: string): LinkedinBundle | null {
  const match = html.match(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i,
  );
  if (!match) return null;
  try {
    const data = JSON.parse(match[1]) as Record<string, unknown>;
    const person = Array.isArray(data['@graph'])
      ? (data['@graph'] as Array<Record<string, unknown>>).find(
          (n) => n['@type'] === 'Person' || (n['@type'] as unknown) === 'ProfilePage',
        )
      : data;
    if (!person) return null;
    const bundle: LinkedinBundle = {};
    const summary = typeof person.description === 'string' ? person.description : '';
    const name = typeof person.name === 'string' ? person.name : '';
    bundle.profile = {
      Name: name,
      Headline: typeof person.jobTitle === 'string' ? person.jobTitle : '',
      Summary: summary,
    };
    const works = Array.isArray(person.worksFor)
      ? (person.worksFor as Array<Record<string, unknown>>)
      : person.worksFor
      ? [person.worksFor as Record<string, unknown>]
      : [];
    bundle.positions = works
      .map((w) => ({
        'Company Name': typeof w.name === 'string' ? w.name : '',
        Title: typeof person.jobTitle === 'string' ? person.jobTitle : '',
      }))
      .filter((p) => p['Company Name']);
    const alumni = Array.isArray(person.alumniOf)
      ? (person.alumniOf as Array<Record<string, unknown>>)
      : person.alumniOf
      ? [person.alumniOf as Record<string, unknown>]
      : [];
    bundle.education = alumni
      .map((a) => ({ 'School Name': typeof a.name === 'string' ? a.name : '' }))
      .filter((e) => e['School Name']);
    return bundle;
  } catch {
    return null;
  }
}

// ─────────────────────────── AI prompt + output ───────────────────────────

export const EXTRACTION_SYSTEM_PROMPT = `You are a precise resume parser. The user will give you the raw text extracted from a resume (PDF or DOCX). Return a JSON object matching the schema below.

Rules:
- Return VALID JSON ONLY. No prose, no code fences, no markdown.
- Use null (not empty strings) for unknown fields. Omit items you cannot confidently identify.
- Dates: use ISO 8601 YYYY-MM-DD when a day is given, YYYY-MM when a month is given, YYYY when only a year is given.
- "current" is true for a role whose end date is "Present" / blank.
- Keep descriptions concise (one sentence or a short bullet summary).
- Do not invent facts. If a section is absent, return an empty array.

Schema:
{
  "bio": string | null,
  "education": [{ "institution": string, "degree"?: string|null, "field"?: string|null, "startYear"?: number|null, "endYear"?: number|null, "gpa"?: number|null, "honors"?: string|null }],
  "work": [{ "company": string, "title": string, "description"?: string|null, "startDate"?: string|null, "endDate"?: string|null, "current"?: boolean }],
  "projects": [{ "name": string, "description"?: string|null, "url"?: string|null, "startDate"?: string|null, "endDate"?: string|null }],
  "accomplishments": [{ "title": string, "description"?: string|null, "date"?: string|null, "category"?: "award"|"honor"|"publication"|"certification"|null }],
  "skills": string[]
}`;

export function buildExtractionPrompt(text: string): { system: string; user: string } {
  const clipped = text.length > 20_000 ? `${text.slice(0, 20_000)}\n\n[truncated]` : text;
  return {
    system: EXTRACTION_SYSTEM_PROMPT,
    user: `Resume text:\n---\n${clipped}\n---\n\nReturn JSON only.`,
  };
}

/**
 * Pull a JSON object out of a model response. Handles cases where the
 * model wrapped the JSON in markdown fences or added a short preamble.
 */
export function extractJsonObject(raw: string): Record<string, unknown> {
  if (!raw) return {};
  const trimmed = raw.trim();
  // Try fenced ```json first.
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  // Direct parse.
  try {
    const parsed = JSON.parse(candidate);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // fall through
  }
  // Fallback: locate the first balanced `{...}` block.
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start >= 0 && end > start) {
    const slice = candidate.slice(start, end + 1);
    try {
      const parsed = JSON.parse(slice);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      // ignore
    }
  }
  return {};
}

/**
 * Normalise an AI-extracted JSON blob into our ImportPreview shape. The
 * function is defensive: it does not require any particular key to be
 * present, coerces types where it can, and records a warning for every
 * section the model dropped.
 */
export function toPreviewFromAiOutput(
  data: Record<string, unknown>,
  source: ImportSource,
  rawText: string,
): ImportPreview {
  const warnings: string[] = [];
  if (Object.keys(data).length === 0) {
    warnings.push(
      'The AI model returned an unparseable response, so no structured data could be extracted. The raw resume text was still captured as the bio.',
    );
  }

  const education: ImportEducationInput[] = toArray(data.education).map((e) => ({
    institution: strOrFallback(e.institution, 'Unknown institution'),
    degree: strOrNull(e.degree),
    field: strOrNull(e.field),
    startYear: toYear(e.startYear) ?? toYear(e.startDate),
    endYear: toYear(e.endYear) ?? toYear(e.endDate),
    gpa: toNumber(e.gpa),
    honors: strOrNull(e.honors),
  }));

  const work: ImportWorkInput[] = toArray(data.work).map((w) => ({
    company: strOrFallback(w.company, 'Unknown company'),
    title: strOrFallback(w.title, 'Unknown role'),
    description: strOrNull(w.description),
    startDate: strOrNull(w.startDate),
    endDate: strOrNull(w.endDate),
    current: w.current === true,
  }));

  const projects: ImportProjectInput[] = toArray(data.projects).map((p) => ({
    name: strOrFallback(p.name, 'Untitled project'),
    description: strOrNull(p.description),
    url: strOrNull(p.url),
    startDate: strOrNull(p.startDate),
    endDate: strOrNull(p.endDate),
  }));

  const accomplishments: ImportAccomplishmentInput[] = toArray(data.accomplishments).map(
    (a) => ({
      title: strOrFallback(a.title, 'Untitled accomplishment'),
      description: strOrNull(a.description),
      date: strOrNull(a.date),
      category: strOrNull(a.category),
    }),
  );

  const skills: string[] = Array.isArray(data.skills)
    ? (data.skills.filter((s) => typeof s === 'string' && s.trim()) as string[]).map((s) =>
        s.trim(),
      )
    : [];

  const bioFromModel = strOrNull(data.bio);
  const bio = bioFromModel
    ? bioFromModel
    : rawText.length > 500
    ? `${rawText.slice(0, 500).trim()}…`
    : rawText.trim() || null;

  const totalRows = education.length + work.length + projects.length + accomplishments.length;
  const confidence = clamp01(totalRows === 0 ? 0.2 : Math.min(1, 0.5 + totalRows * 0.07));

  if (totalRows === 0 && skills.length === 0) {
    warnings.push(
      'Nothing structured could be extracted from this document. The raw text has been attached as the bio so you can hand-enter sections below.',
    );
  }

  return {
    source,
    bio,
    education,
    work,
    projects,
    accomplishments,
    skills: dedupeStrings(skills),
    warnings,
    confidence,
    rawTextPreview: rawText.slice(0, 1200),
  };
}

// ─────────────────────────── Document type detection ───────────────────────────

export function detectDocType(filename: string, mime: string): ImportSource | 'unknown' {
  const lowerName = (filename ?? '').toLowerCase();
  const lowerMime = (mime ?? '').toLowerCase();
  if (
    lowerMime === 'application/pdf' ||
    lowerMime.startsWith('application/x-pdf') ||
    lowerName.endsWith('.pdf')
  ) {
    return 'pdf';
  }
  if (
    lowerMime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    lowerName.endsWith('.docx')
  ) {
    return 'docx';
  }
  if (
    lowerMime === 'application/zip' ||
    lowerMime === 'application/x-zip-compressed' ||
    lowerName.endsWith('.zip')
  ) {
    return 'linkedin-zip';
  }
  if (lowerMime === 'application/json' || lowerName.endsWith('.json')) {
    return 'linkedin-json';
  }
  if (lowerMime.startsWith('text/') || lowerName.endsWith('.txt')) {
    return 'text';
  }
  return 'unknown';
}

// ─────────────────────────── CSV parsing ───────────────────────────

/**
 * Tiny CSV parser tailored to LinkedIn's exports: a single-row header,
 * one record per line, double-quote escaping, UTF-8. No streaming (the
 * CSVs are small). This is deliberately not a general-purpose parser.
 */
export function parseCsv(text: string): Array<Record<string, string>> {
  const normalized = text.replace(/\r\n?/g, '\n');
  const rows: string[][] = [];
  let field = '';
  let row: string[] = [];
  let inQuotes = false;
  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i];
    if (inQuotes) {
      if (ch === '"') {
        if (normalized[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  // Drop LinkedIn's `Notes` preamble (sometimes a one-line comment above the real header).
  const headerIndex = findHeaderRow(rows);
  if (headerIndex < 0) return [];
  const headers = rows[headerIndex].map((h) => h.trim());
  const out: Array<Record<string, string>> = [];
  for (let r = headerIndex + 1; r < rows.length; r++) {
    const cols = rows[r];
    if (cols.every((c) => c === '')) continue;
    const rec: Record<string, string> = {};
    for (let c = 0; c < headers.length; c++) {
      rec[headers[c]] = (cols[c] ?? '').trim();
    }
    out.push(rec);
  }
  return out;
}

function findHeaderRow(rows: string[][]): number {
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].length > 1) return i;
  }
  return rows.length > 0 ? 0 : -1;
}

// ─────────────────────────── Helpers ───────────────────────────

function pickString(row: Record<string, string>, keys: string[]): string {
  for (const k of keys) {
    const value = row[k];
    if (value && String(value).trim()) return String(value).trim();
  }
  return '';
}

function strOrNull(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'string') return v.trim() ? v.trim() : null;
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : null;
  return null;
}

function strOrFallback(v: unknown, fallback: string): string {
  const s = strOrNull(v);
  return s ?? fallback;
}

function toYear(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number' && Number.isFinite(v)) return Math.trunc(v);
  const s = String(v).trim();
  const match = s.match(/(\d{4})/);
  if (!match) return null;
  const year = Number(match[1]);
  return Number.isFinite(year) ? year : null;
}

function toNumber(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function toArray(v: unknown): Array<Record<string, unknown>> {
  return Array.isArray(v)
    ? (v.filter((item) => item && typeof item === 'object') as Array<Record<string, unknown>>)
    : [];
}

function normalizeLinkedinDate(input: unknown): string | null {
  if (!input) return null;
  const s = String(input).trim();
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (/^\d{4}-\d{2}$/.test(s)) return s;
  if (/^\d{4}$/.test(s)) return s;
  // "Jan 2021" style.
  const m = s.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (m) {
    const month = MONTHS[m[1].toLowerCase().slice(0, 3)];
    if (month) return `${m[2]}-${month}`;
    return m[2];
  }
  return s;
}

const MONTHS: Record<string, string> = {
  jan: '01',
  feb: '02',
  mar: '03',
  apr: '04',
  may: '05',
  jun: '06',
  jul: '07',
  aug: '08',
  sep: '09',
  oct: '10',
  nov: '11',
  dec: '12',
};

function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

function dedupeStrings(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}
