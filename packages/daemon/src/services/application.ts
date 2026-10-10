import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { schema, type ArpliDb } from '@arpli/db';
import type { Application, ApplicationStatus } from '@arpli/shared';

/**
 * Application service — one Application links a profile to an opportunity
 * and holds the drafts the user is working on. Hand off to AnswerDrafter
 * for the actual AI generation.
 *
 * All methods return plain `@arpli/shared` shapes; raw drizzle rows never
 * leak out past this file.
 */

const APPLICATION_STATUSES: ReadonlyArray<ApplicationStatus> = [
  'discovered',
  'qualifying',
  'drafting',
  'reviewing',
  'submitted',
  'awaiting',
  'won',
  'rejected',
  'waitlisted',
  'withdrew',
];

export function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return typeof value === 'string' && (APPLICATION_STATUSES as readonly string[]).includes(value);
}

function nowIso(): string {
  return new Date().toISOString();
}

function newId(): string {
  return randomUUID();
}

export interface CreateApplicationInput {
  opportunityId: string;
  profileId: string;
  status?: ApplicationStatus;
  notes?: string | null;
}

export interface UpdateApplicationInput {
  status?: ApplicationStatus;
  notes?: string | null;
  submittedAt?: string | null;
}

export interface ListApplicationsFilter {
  profileId?: string;
  opportunityId?: string;
  status?: ApplicationStatus;
}

export class ApplicationService {
  constructor(private readonly db: ArpliDb) {}

  async create(input: CreateApplicationInput): Promise<Application> {
    if (!input.opportunityId) throw new Error('application.opportunityId is required');
    if (!input.profileId) throw new Error('application.profileId is required');
    const status = input.status ?? 'drafting';
    if (!isApplicationStatus(status)) {
      throw new Error(`invalid application status: ${String(status)}`);
    }
    const row = {
      id: newId(),
      opportunityId: input.opportunityId,
      profileId: input.profileId,
      status,
      notes: input.notes ?? null,
      submittedAt: null,
      createdAt: nowIso(),
    };
    await this.db.insert(schema.applications).values(row);
    return this.toApplication(row);
  }

  /**
   * Idempotent helper: return the existing application for (profile,
   * opportunity) or create a fresh one. "Draft an answer" from the UI needs
   * an application id — this prevents duplicate rows when the user clicks
   * Draft on an opportunity they already started.
   */
  async ensureForOpportunity(opportunityId: string, profileId: string): Promise<Application> {
    const existing = await this.db.query.applications.findFirst({
      where: (apps, { and, eq }) =>
        and(eq(apps.opportunityId, opportunityId), eq(apps.profileId, profileId)),
    });
    if (existing) return this.toApplication(existing);
    return this.create({ opportunityId, profileId });
  }

  async get(id: string): Promise<Application | null> {
    const row = await this.db.query.applications.findFirst({
      where: eq(schema.applications.id, id),
    });
    return row ? this.toApplication(row) : null;
  }

  async list(filter: ListApplicationsFilter = {}): Promise<Application[]> {
    const rows = await this.db.select().from(schema.applications).all();
    let out = rows.map((r) => this.toApplication(r));
    if (filter.profileId) out = out.filter((a) => a.profileId === filter.profileId);
    if (filter.opportunityId) out = out.filter((a) => a.opportunityId === filter.opportunityId);
    if (filter.status) out = out.filter((a) => a.status === filter.status);
    return out.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
  }

  async update(id: string, patch: UpdateApplicationInput): Promise<Application> {
    const existing = await this.get(id);
    if (!existing) throw new Error(`application not found: ${id}`);

    if (patch.status !== undefined && !isApplicationStatus(patch.status)) {
      throw new Error(`invalid application status: ${String(patch.status)}`);
    }

    const next: Partial<typeof schema.applications.$inferInsert> = {};
    if (patch.status !== undefined) next.status = patch.status;
    if (patch.notes !== undefined) next.notes = patch.notes;
    if (patch.submittedAt !== undefined) next.submittedAt = patch.submittedAt;

    await this.db.update(schema.applications).set(next).where(eq(schema.applications.id, id));
    return (await this.get(id))!;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(schema.applications).where(eq(schema.applications.id, id));
  }

  private toApplication(row: typeof schema.applications.$inferSelect): Application {
    return {
      id: row.id,
      opportunityId: row.opportunityId,
      profileId: row.profileId,
      status: row.status as ApplicationStatus,
      notes: row.notes ?? null,
      submittedAt: row.submittedAt ?? null,
      createdAt: row.createdAt,
    };
  }
}
