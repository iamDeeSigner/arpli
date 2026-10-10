import { eq, desc } from 'drizzle-orm';
import type { ArpliDb } from '@arpli/db';
import { schema } from '@arpli/db';

/**
 * Build a system-prompt prefix from the user's profile + (optionally)
 * the active opportunity. The connector manager injects this into every
 * AI call so model answers are grounded in the user's actual history.
 *
 * Keep this focused and compact: profile data goes straight into the
 * system prompt budget on every call, so it must fit comfortably in a
 * few hundred tokens.
 */
export function buildSystemPrompt(
  db: ArpliDb,
  profileId: string,
  opportunityId?: string | null,
): string {
  const profile = db
    .select()
    .from(schema.profiles)
    .where(eq(schema.profiles.id, profileId))
    .get();
  if (!profile) return '';

  const [education, work, accomplishments] = [
    db
      .select()
      .from(schema.profileEducation)
      .where(eq(schema.profileEducation.profileId, profileId))
      .orderBy(desc(schema.profileEducation.endYear))
      .all(),
    db
      .select()
      .from(schema.profileWork)
      .where(eq(schema.profileWork.profileId, profileId))
      .orderBy(desc(schema.profileWork.startDate))
      .all(),
    db
      .select()
      .from(schema.profileAccomplishments)
      .where(eq(schema.profileAccomplishments.profileId, profileId))
      .orderBy(desc(schema.profileAccomplishments.date))
      .all(),
  ];

  const sections: string[] = [];

  sections.push(
    `You are helping ${describeMode(profile.mode)} draft and refine materials for an application they are preparing. Ground every answer in the actual history below — do not invent experience, awards, or credentials.`,
  );

  if (profile.bio) {
    sections.push(`## About the user\n${profile.bio.trim()}`);
  } else {
    sections.push(`## About the user\nMode: ${profile.mode}.`);
  }

  if (accomplishments.length > 0) {
    const lines = accomplishments
      .slice(0, 8)
      .map((a) => {
        const date = a.date ? ` (${a.date})` : '';
        const detail = a.description ? ` — ${a.description}` : '';
        return `- ${a.title}${date}${detail}`;
      });
    sections.push(`## Key accomplishments\n${lines.join('\n')}`);
  }

  if (education.length > 0) {
    const lines = education.slice(0, 5).map((e) => {
      const degree = [e.degree, e.field].filter(Boolean).join(' in ');
      const years =
        e.startYear && e.endYear
          ? ` (${e.startYear}–${e.endYear})`
          : e.endYear
            ? ` (${e.endYear})`
            : '';
      const honors = e.honors ? ` — ${e.honors}` : '';
      return `- ${e.institution}${degree ? `, ${degree}` : ''}${years}${honors}`;
    });
    sections.push(`## Education\n${lines.join('\n')}`);
  }

  if (work.length > 0) {
    const lines = work.slice(0, 6).map((w) => {
      const period =
        w.startDate && w.endDate
          ? ` (${w.startDate} – ${w.endDate})`
          : w.current && w.startDate
            ? ` (${w.startDate} – present)`
            : '';
      const detail = w.description ? ` — ${w.description}` : '';
      return `- ${w.title}, ${w.company}${period}${detail}`;
    });
    sections.push(`## Work history\n${lines.join('\n')}`);
  }

  if (opportunityId) {
    const opp = db
      .select()
      .from(schema.opportunities)
      .where(eq(schema.opportunities.id, opportunityId))
      .get();
    if (opp) {
      const bits: string[] = [];
      bits.push(`${opp.title}${opp.organization ? ` — ${opp.organization}` : ''} (${opp.type}).`);
      if (opp.description) bits.push(opp.description.trim());
      if (opp.requirements) bits.push(`Requirements: ${opp.requirements.trim()}`);
      if (opp.eligibility) bits.push(`Eligibility: ${opp.eligibility.trim()}`);
      if (opp.wordLimits) bits.push(`Word limits: ${opp.wordLimits.trim()}`);
      if (opp.deadline) bits.push(`Deadline: ${opp.deadline}`);
      sections.push(`## Opportunity\n${bits.join('\n')}`);
    }
  }

  return sections.join('\n\n');
}

function describeMode(mode: string): string {
  switch (mode) {
    case 'student':
      return 'a student';
    case 'founder':
      return 'a founder';
    case 'researcher':
      return 'a researcher';
    case 'professional':
      return 'a working professional';
    default:
      return 'the user';
  }
}
