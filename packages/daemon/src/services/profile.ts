import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { schema, type ArpliDb } from '@arpli/db';
import type {
  Profile,
  ProfileAccomplishment,
  ProfileEducation,
  ProfileEssay,
  ProfileMode,
  ProfileProject,
  ProfileWork,
} from '@arpli/shared';

/**
 * Profile service — CRUD for the profile aggregate.
 *
 * One profile per user. Phase 1 is single-user local, so `userId` defaults
 * to a stable `"local"` string. The service writes through drizzle to the
 * SQLite tables created by the Phase 1 migration.
 */

const DEFAULT_USER_ID = 'local';

const PROFILE_MODES: ReadonlyArray<ProfileMode> = [
  'student',
  'founder',
  'researcher',
  'professional',
];

export function isProfileMode(value: unknown): value is ProfileMode {
  return typeof value === 'string' && (PROFILE_MODES as readonly string[]).includes(value);
}

function nowIso(): string {
  return new Date().toISOString();
}

function newId(): string {
  return randomUUID();
}

export interface CreateProfileInput {
  mode: ProfileMode;
  bio?: string | null;
  userId?: string;
}

export interface UpdateProfileInput {
  mode?: ProfileMode;
  bio?: string | null;
}

export class ProfileService {
  constructor(private readonly db: ArpliDb) {}

  // ------------- Profile core -------------

  async createProfile(input: CreateProfileInput): Promise<Profile> {
    if (!isProfileMode(input.mode)) {
      throw new Error(`invalid profile mode: ${String(input.mode)}`);
    }
    const row = {
      id: newId(),
      userId: input.userId ?? DEFAULT_USER_ID,
      mode: input.mode,
      bio: input.bio ?? null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    await this.db.insert(schema.profiles).values(row);
    return this.toProfile(row);
  }

  async getProfile(id: string): Promise<Profile | null> {
    const row = await this.db.query.profiles.findFirst({
      where: eq(schema.profiles.id, id),
    });
    return row ? this.toProfile(row) : null;
  }

  async getActiveProfile(userId: string = DEFAULT_USER_ID): Promise<Profile | null> {
    const rows = await this.db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.userId, userId))
      .all();
    if (rows.length === 0) return null;
    // Most recently updated wins.
    const sorted = [...rows].sort((a, b) =>
      (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''),
    );
    return this.toProfile(sorted[0]);
  }

  async listProfiles(userId: string = DEFAULT_USER_ID): Promise<Profile[]> {
    const rows = await this.db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.userId, userId))
      .all();
    return rows.map((r) => this.toProfile(r));
  }

  async updateProfile(id: string, patch: UpdateProfileInput): Promise<Profile> {
    const existing = await this.getProfile(id);
    if (!existing) throw new Error(`profile not found: ${id}`);
    if (patch.mode !== undefined && !isProfileMode(patch.mode)) {
      throw new Error(`invalid profile mode: ${String(patch.mode)}`);
    }
    const next = {
      mode: patch.mode ?? existing.mode,
      bio: patch.bio === undefined ? existing.bio : patch.bio,
      updatedAt: nowIso(),
    };
    await this.db.update(schema.profiles).set(next).where(eq(schema.profiles.id, id));
    return (await this.getProfile(id))!;
  }

  async deleteProfile(id: string): Promise<void> {
    await this.db.delete(schema.profiles).where(eq(schema.profiles.id, id));
  }

  // ------------- Education -------------

  async listEducation(profileId: string): Promise<ProfileEducation[]> {
    const rows = await this.db
      .select()
      .from(schema.profileEducation)
      .where(eq(schema.profileEducation.profileId, profileId))
      .all();
    return rows.map((r) => this.toEducation(r));
  }

  async addEducation(
    profileId: string,
    input: Omit<ProfileEducation, 'id' | 'profileId'>,
  ): Promise<ProfileEducation> {
    await this.requireProfile(profileId);
    if (!input.institution || !input.institution.trim()) {
      throw new Error('education.institution is required');
    }
    const row = {
      id: newId(),
      profileId,
      institution: input.institution,
      degree: input.degree ?? null,
      field: input.field ?? null,
      startYear: input.startYear ?? null,
      endYear: input.endYear ?? null,
      gpa: input.gpa ?? null,
      honors: input.honors ?? null,
    };
    await this.db.insert(schema.profileEducation).values(row);
    return this.toEducation(row);
  }

  async updateEducation(
    id: string,
    patch: Partial<Omit<ProfileEducation, 'id' | 'profileId'>>,
  ): Promise<ProfileEducation> {
    const existing = await this.db.query.profileEducation.findFirst({
      where: eq(schema.profileEducation.id, id),
    });
    if (!existing) throw new Error(`education not found: ${id}`);
    const merged = { ...existing, ...patch };
    await this.db
      .update(schema.profileEducation)
      .set(merged)
      .where(eq(schema.profileEducation.id, id));
    return this.toEducation(merged);
  }

  async removeEducation(id: string): Promise<void> {
    await this.db.delete(schema.profileEducation).where(eq(schema.profileEducation.id, id));
  }

  // ------------- Work -------------

  async listWork(profileId: string): Promise<ProfileWork[]> {
    const rows = await this.db
      .select()
      .from(schema.profileWork)
      .where(eq(schema.profileWork.profileId, profileId))
      .all();
    return rows.map((r) => this.toWork(r));
  }

  async addWork(
    profileId: string,
    input: Omit<ProfileWork, 'id' | 'profileId'>,
  ): Promise<ProfileWork> {
    await this.requireProfile(profileId);
    if (!input.company?.trim()) throw new Error('work.company is required');
    if (!input.title?.trim()) throw new Error('work.title is required');
    const row = {
      id: newId(),
      profileId,
      company: input.company,
      title: input.title,
      description: input.description ?? null,
      startDate: input.startDate ?? null,
      endDate: input.endDate ?? null,
      current: input.current ?? false,
    };
    await this.db.insert(schema.profileWork).values(row);
    return this.toWork(row);
  }

  async updateWork(
    id: string,
    patch: Partial<Omit<ProfileWork, 'id' | 'profileId'>>,
  ): Promise<ProfileWork> {
    const existing = await this.db.query.profileWork.findFirst({
      where: eq(schema.profileWork.id, id),
    });
    if (!existing) throw new Error(`work not found: ${id}`);
    const merged = { ...existing, ...patch };
    await this.db.update(schema.profileWork).set(merged).where(eq(schema.profileWork.id, id));
    return this.toWork(merged);
  }

  async removeWork(id: string): Promise<void> {
    await this.db.delete(schema.profileWork).where(eq(schema.profileWork.id, id));
  }

  // ------------- Projects -------------

  async listProjects(profileId: string): Promise<ProfileProject[]> {
    const rows = await this.db
      .select()
      .from(schema.profileProjects)
      .where(eq(schema.profileProjects.profileId, profileId))
      .all();
    return rows.map((r) => this.toProject(r));
  }

  async addProject(
    profileId: string,
    input: Omit<ProfileProject, 'id' | 'profileId'>,
  ): Promise<ProfileProject> {
    await this.requireProfile(profileId);
    if (!input.name?.trim()) throw new Error('project.name is required');
    const row = {
      id: newId(),
      profileId,
      name: input.name,
      description: input.description ?? null,
      url: input.url ?? null,
      startDate: input.startDate ?? null,
      endDate: input.endDate ?? null,
    };
    await this.db.insert(schema.profileProjects).values(row);
    return this.toProject(row);
  }

  async updateProject(
    id: string,
    patch: Partial<Omit<ProfileProject, 'id' | 'profileId'>>,
  ): Promise<ProfileProject> {
    const existing = await this.db.query.profileProjects.findFirst({
      where: eq(schema.profileProjects.id, id),
    });
    if (!existing) throw new Error(`project not found: ${id}`);
    const merged = { ...existing, ...patch };
    await this.db
      .update(schema.profileProjects)
      .set(merged)
      .where(eq(schema.profileProjects.id, id));
    return this.toProject(merged);
  }

  async removeProject(id: string): Promise<void> {
    await this.db.delete(schema.profileProjects).where(eq(schema.profileProjects.id, id));
  }

  // ------------- Accomplishments -------------

  async listAccomplishments(profileId: string): Promise<ProfileAccomplishment[]> {
    const rows = await this.db
      .select()
      .from(schema.profileAccomplishments)
      .where(eq(schema.profileAccomplishments.profileId, profileId))
      .all();
    return rows.map((r) => this.toAccomplishment(r));
  }

  async addAccomplishment(
    profileId: string,
    input: Omit<ProfileAccomplishment, 'id' | 'profileId'>,
  ): Promise<ProfileAccomplishment> {
    await this.requireProfile(profileId);
    if (!input.title?.trim()) throw new Error('accomplishment.title is required');
    const row = {
      id: newId(),
      profileId,
      title: input.title,
      description: input.description ?? null,
      date: input.date ?? null,
      category: input.category ?? null,
    };
    await this.db.insert(schema.profileAccomplishments).values(row);
    return this.toAccomplishment(row);
  }

  async updateAccomplishment(
    id: string,
    patch: Partial<Omit<ProfileAccomplishment, 'id' | 'profileId'>>,
  ): Promise<ProfileAccomplishment> {
    const existing = await this.db.query.profileAccomplishments.findFirst({
      where: eq(schema.profileAccomplishments.id, id),
    });
    if (!existing) throw new Error(`accomplishment not found: ${id}`);
    const merged = { ...existing, ...patch };
    await this.db
      .update(schema.profileAccomplishments)
      .set(merged)
      .where(eq(schema.profileAccomplishments.id, id));
    return this.toAccomplishment(merged);
  }

  async removeAccomplishment(id: string): Promise<void> {
    await this.db
      .delete(schema.profileAccomplishments)
      .where(eq(schema.profileAccomplishments.id, id));
  }

  // ------------- Essays -------------

  async listEssays(profileId: string): Promise<ProfileEssay[]> {
    const rows = await this.db
      .select()
      .from(schema.profileEssays)
      .where(eq(schema.profileEssays.profileId, profileId))
      .all();
    return rows.map((r) => this.toEssay(r));
  }

  async addEssay(
    profileId: string,
    input: Omit<ProfileEssay, 'id' | 'profileId' | 'wordCount' | 'createdAt'> & {
      wordCount?: number;
    },
  ): Promise<ProfileEssay> {
    await this.requireProfile(profileId);
    if (!input.title?.trim()) throw new Error('essay.title is required');
    if (typeof input.content !== 'string') throw new Error('essay.content is required');
    const row = {
      id: newId(),
      profileId,
      title: input.title,
      content: input.content,
      wordCount: input.wordCount ?? countWords(input.content),
      tags: input.tags ?? null,
      createdAt: nowIso(),
    };
    await this.db.insert(schema.profileEssays).values(row);
    return this.toEssay(row);
  }

  async updateEssay(
    id: string,
    patch: Partial<Omit<ProfileEssay, 'id' | 'profileId' | 'createdAt'>>,
  ): Promise<ProfileEssay> {
    const existing = await this.db.query.profileEssays.findFirst({
      where: eq(schema.profileEssays.id, id),
    });
    if (!existing) throw new Error(`essay not found: ${id}`);
    const nextContent = patch.content ?? existing.content;
    const merged = {
      ...existing,
      ...patch,
      wordCount:
        patch.wordCount !== undefined
          ? patch.wordCount
          : patch.content !== undefined
            ? countWords(nextContent)
            : existing.wordCount,
    };
    await this.db
      .update(schema.profileEssays)
      .set(merged)
      .where(eq(schema.profileEssays.id, id));
    return this.toEssay(merged);
  }

  async removeEssay(id: string): Promise<void> {
    await this.db.delete(schema.profileEssays).where(eq(schema.profileEssays.id, id));
  }

  // ------------- Helpers -------------

  private async requireProfile(id: string): Promise<Profile> {
    const p = await this.getProfile(id);
    if (!p) throw new Error(`profile not found: ${id}`);
    return p;
  }

  private toProfile(row: typeof schema.profiles.$inferSelect): Profile {
    return {
      id: row.id,
      userId: row.userId,
      mode: row.mode as ProfileMode,
      bio: row.bio ?? null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private toEducation(row: typeof schema.profileEducation.$inferSelect): ProfileEducation {
    return {
      id: row.id,
      profileId: row.profileId,
      institution: row.institution,
      degree: row.degree ?? null,
      field: row.field ?? null,
      startYear: row.startYear ?? null,
      endYear: row.endYear ?? null,
      gpa: row.gpa ?? null,
      honors: row.honors ?? null,
    };
  }

  private toWork(row: typeof schema.profileWork.$inferSelect): ProfileWork {
    return {
      id: row.id,
      profileId: row.profileId,
      company: row.company,
      title: row.title,
      description: row.description ?? null,
      startDate: row.startDate ?? null,
      endDate: row.endDate ?? null,
      current: Boolean(row.current),
    };
  }

  private toProject(row: typeof schema.profileProjects.$inferSelect): ProfileProject {
    return {
      id: row.id,
      profileId: row.profileId,
      name: row.name,
      description: row.description ?? null,
      url: row.url ?? null,
      startDate: row.startDate ?? null,
      endDate: row.endDate ?? null,
    };
  }

  private toAccomplishment(
    row: typeof schema.profileAccomplishments.$inferSelect,
  ): ProfileAccomplishment {
    return {
      id: row.id,
      profileId: row.profileId,
      title: row.title,
      description: row.description ?? null,
      date: row.date ?? null,
      category: row.category ?? null,
    };
  }

  private toEssay(row: typeof schema.profileEssays.$inferSelect): ProfileEssay {
    return {
      id: row.id,
      profileId: row.profileId,
      title: row.title,
      content: row.content,
      wordCount: row.wordCount,
      tags: row.tags ?? null,
      createdAt: row.createdAt,
    };
  }
}

export function countWords(text: string): number {
  if (!text) return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}
