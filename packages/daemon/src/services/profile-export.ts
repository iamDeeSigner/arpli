import type {
  Profile,
  ProfileAccomplishment,
  ProfileEducation,
  ProfileEssay,
  ProfileProject,
  ProfileWork,
} from '@arpli/shared';
import { ProfileService } from './profile.js';

/**
 * Full profile aggregate — the shape returned by exportToJSON and consumed
 * by callers that want the whole profile in one object (desktop app,
 * drafting engine, gap detector).
 */
export interface ProfileExport {
  profile: Profile;
  education: ProfileEducation[];
  work: ProfileWork[];
  projects: ProfileProject[];
  accomplishments: ProfileAccomplishment[];
  essays: ProfileEssay[];
}

export class ProfileExportService {
  constructor(private readonly profiles: ProfileService) {}

  async exportToJSON(profileId: string): Promise<ProfileExport> {
    const profile = await this.profiles.getProfile(profileId);
    if (!profile) throw new Error(`profile not found: ${profileId}`);
    const [education, work, projects, accomplishments, essays] = await Promise.all([
      this.profiles.listEducation(profileId),
      this.profiles.listWork(profileId),
      this.profiles.listProjects(profileId),
      this.profiles.listAccomplishments(profileId),
      this.profiles.listEssays(profileId),
    ]);
    return { profile, education, work, projects, accomplishments, essays };
  }

  async exportToMarkdown(profileId: string): Promise<string> {
    const data = await this.exportToJSON(profileId);
    return renderMarkdown(data);
  }
}

export function renderMarkdown(data: ProfileExport): string {
  const { profile, education, work, projects, accomplishments, essays } = data;
  const lines: string[] = [];

  lines.push(`# Profile`);
  lines.push('');
  lines.push(`- **Mode**: ${profile.mode}`);
  lines.push(`- **Created**: ${profile.createdAt}`);
  lines.push(`- **Updated**: ${profile.updatedAt}`);
  lines.push('');

  if (profile.bio && profile.bio.trim()) {
    lines.push(`## Bio`);
    lines.push('');
    lines.push(profile.bio.trim());
    lines.push('');
  }

  lines.push(section('Education', education, (e) => {
    const header = [e.degree, e.field].filter(Boolean).join(', ');
    const years = formatYearRange(e.startYear, e.endYear);
    const headline = [e.institution, header].filter(Boolean).join(' — ');
    const sub: string[] = [];
    if (years) sub.push(years);
    if (e.gpa !== null && e.gpa !== undefined) sub.push(`GPA ${e.gpa}`);
    if (e.honors) sub.push(e.honors);
    const bullet = `- **${headline}**`;
    return sub.length > 0 ? `${bullet}  \n  ${sub.join(' · ')}` : bullet;
  }));

  lines.push(section('Work Experience', work, (w) => {
    const dates = formatDateRange(w.startDate, w.endDate, w.current);
    const bullet = `- **${w.title}** — ${w.company}`;
    const parts: string[] = [];
    if (dates) parts.push(dates);
    if (w.description) parts.push(w.description.trim());
    return parts.length > 0 ? `${bullet}  \n  ${parts.join('  \n  ')}` : bullet;
  }));

  lines.push(section('Projects', projects, (p) => {
    const dates = formatDateRange(p.startDate, p.endDate, false);
    const title = p.url ? `[${p.name}](${p.url})` : p.name;
    const parts: string[] = [];
    if (dates) parts.push(dates);
    if (p.description) parts.push(p.description.trim());
    return parts.length > 0
      ? `- **${title}**  \n  ${parts.join('  \n  ')}`
      : `- **${title}**`;
  }));

  lines.push(section('Accomplishments', accomplishments, (a) => {
    const meta = [a.date, a.category].filter(Boolean).join(' · ');
    const parts: string[] = [];
    if (meta) parts.push(meta);
    if (a.description) parts.push(a.description.trim());
    return parts.length > 0
      ? `- **${a.title}**  \n  ${parts.join('  \n  ')}`
      : `- **${a.title}**`;
  }));

  if (essays.length > 0) {
    lines.push(`## Essays`);
    lines.push('');
    for (const essay of essays) {
      lines.push(`### ${essay.title}`);
      const meta: string[] = [`${essay.wordCount} words`];
      if (essay.tags) meta.push(`tags: ${essay.tags}`);
      lines.push(`_${meta.join(' · ')}_`);
      lines.push('');
      lines.push(essay.content.trim());
      lines.push('');
    }
  }

  // Trim trailing blank line but keep one at end for POSIX friendliness.
  while (lines.length > 1 && lines[lines.length - 1] === '' && lines[lines.length - 2] === '') {
    lines.pop();
  }
  if (lines[lines.length - 1] !== '') lines.push('');
  return lines.join('\n');
}

function section<T>(title: string, items: T[], render: (item: T) => string): string {
  if (items.length === 0) return '';
  const body = items.map(render).join('\n');
  return `## ${title}\n\n${body}\n`;
}

function formatYearRange(start: number | null, end: number | null): string {
  if (!start && !end) return '';
  if (start && end) return `${start}–${end}`;
  if (start) return `${start}–present`;
  return `${end}`;
}

function formatDateRange(start: string | null, end: string | null, current: boolean): string {
  if (!start && !end && !current) return '';
  const left = start ?? '';
  const right = current ? 'present' : (end ?? '');
  if (!left && !right) return '';
  if (left && right) return `${left} – ${right}`;
  return left || right;
}
