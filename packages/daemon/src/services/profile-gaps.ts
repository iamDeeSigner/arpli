import type { ProfileMode } from '@arpli/shared';
import { ProfileService } from './profile.js';
import { ProfileExportService } from './profile-export.js';

/**
 * Gap detection — surface fields that are empty or missing on a profile,
 * weighted by how critical each is for the common application-writing
 * loop. The result feeds the desktop UI's "finish your profile" nudges
 * and the drafting engine's "ask the user before drafting" step.
 *
 * Priority rules of thumb:
 *   - high   = the drafting engine almost always needs this; without it
 *              the draft will be generic or wrong.
 *   - medium = frequently useful; a strong profile has it.
 *   - low    = nice to have; most applications don't ask for it.
 */

export type GapPriority = 'high' | 'medium' | 'low';

export interface ProfileGap {
  field: string;
  reason: string;
  priority: GapPriority;
  mode?: ProfileMode;
}

export class ProfileGapsService {
  constructor(
    private readonly profiles: ProfileService,
    private readonly exports: ProfileExportService,
  ) {}

  async getProfileGaps(profileId: string): Promise<ProfileGap[]> {
    const data = await this.exports.exportToJSON(profileId);
    return detectGaps(data);
  }
}

export function detectGaps(data: {
  profile: {
    mode: ProfileMode;
    bio: string | null;
  };
  education: ReadonlyArray<unknown>;
  work: ReadonlyArray<unknown>;
  projects: ReadonlyArray<unknown>;
  accomplishments: ReadonlyArray<unknown>;
  essays: ReadonlyArray<unknown>;
}): ProfileGap[] {
  const { profile, education, work, projects, accomplishments, essays } = data;
  const gaps: ProfileGap[] = [];

  if (!profile.bio || profile.bio.trim().length < 60) {
    gaps.push({
      field: 'bio',
      reason:
        'A short personal bio (60+ characters) anchors every draft. Add a 2–3 sentence summary.',
      priority: 'high',
    });
  }

  // Mode-specific priorities. The baseline is tuned to each audience segment
  // in the spec (students, founders, researchers, professionals).
  const modeRules = modePriorities(profile.mode);

  if (education.length === 0) {
    gaps.push({
      field: 'education',
      reason: 'No education entries. Most applications ask about schooling.',
      priority: modeRules.education,
      mode: profile.mode,
    });
  }

  if (work.length === 0) {
    gaps.push({
      field: 'work',
      reason: 'No work entries. Add at least one role to show professional context.',
      priority: modeRules.work,
      mode: profile.mode,
    });
  }

  if (projects.length === 0) {
    gaps.push({
      field: 'projects',
      reason:
        'No projects. Projects give concrete examples the drafting engine can cite.',
      priority: modeRules.projects,
      mode: profile.mode,
    });
  }

  if (accomplishments.length === 0) {
    gaps.push({
      field: 'accomplishments',
      reason:
        'No accomplishments (awards, publications, speaking). These strengthen most applications.',
      priority: modeRules.accomplishments,
      mode: profile.mode,
    });
  }

  if (essays.length === 0) {
    gaps.push({
      field: 'essays',
      reason:
        'No essay bank. Pasting a few past essays lets Arpli reuse your real voice when drafting.',
      priority: modeRules.essays,
      mode: profile.mode,
    });
  }

  // Order: high → medium → low, stable within each tier.
  const rank: Record<GapPriority, number> = { high: 0, medium: 1, low: 2 };
  gaps.sort((a, b) => rank[a.priority] - rank[b.priority]);
  return gaps;
}

interface ModeRules {
  education: GapPriority;
  work: GapPriority;
  projects: GapPriority;
  accomplishments: GapPriority;
  essays: GapPriority;
}

function modePriorities(mode: ProfileMode): ModeRules {
  switch (mode) {
    case 'student':
      return {
        education: 'high',
        work: 'medium',
        projects: 'high',
        accomplishments: 'high',
        essays: 'high',
      };
    case 'founder':
      return {
        education: 'low',
        work: 'medium',
        projects: 'high',
        accomplishments: 'medium',
        essays: 'medium',
      };
    case 'researcher':
      return {
        education: 'high',
        work: 'medium',
        projects: 'medium',
        accomplishments: 'high',
        essays: 'medium',
      };
    case 'professional':
      return {
        education: 'medium',
        work: 'high',
        projects: 'medium',
        accomplishments: 'medium',
        essays: 'low',
      };
    default:
      return {
        education: 'medium',
        work: 'medium',
        projects: 'medium',
        accomplishments: 'medium',
        essays: 'medium',
      };
  }
}
