import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  buildExtractionPrompt,
  buildLinkedinPreview,
  detectDocType,
  extractJsonObject,
  parseCsv,
  parseLinkedinPublicHtml,
  toLinkedinBundle,
  toPreviewFromAiOutput,
  type LinkedinBundle,
} from './profile-import.js';

/**
 * Parser-only tests. These avoid touching the AI connector, the daemon,
 * or the SQLite store: every function under test is a pure data
 * transformation. Integration tests for `applyPreview()` land in the
 * profile.test.ts suite once we wire a DB double.
 */

// ────────────────────────── CSV ──────────────────────────

test('parseCsv parses a simple LinkedIn-style CSV', () => {
  const csv = 'Company Name,Title,Started On\nAcme,Engineer,2020-01-01\nContoso,Lead,2022-06-01';
  const rows = parseCsv(csv);
  assert.equal(rows.length, 2);
  assert.equal(rows[0]['Company Name'], 'Acme');
  assert.equal(rows[0]['Title'], 'Engineer');
  assert.equal(rows[1]['Started On'], '2022-06-01');
});

test('parseCsv handles quoted fields with commas and embedded quotes', () => {
  const csv = 'Title,Description\n"Senior, Role","She said ""hi"""';
  const rows = parseCsv(csv);
  assert.equal(rows.length, 1);
  assert.equal(rows[0]['Title'], 'Senior, Role');
  assert.equal(rows[0]['Description'], 'She said "hi"');
});

test('parseCsv handles CRLF line endings', () => {
  const csv = 'A,B\r\n1,2\r\n3,4\r\n';
  const rows = parseCsv(csv);
  assert.equal(rows.length, 2);
  assert.deepEqual(rows[1], { A: '3', B: '4' });
});

test('parseCsv returns empty array for empty input', () => {
  assert.deepEqual(parseCsv(''), []);
});

// ────────────────────────── LinkedIn bundle ──────────────────────────

test('toLinkedinBundle normalises a mixed-case JSON payload', () => {
  const payload = {
    Profile: { Headline: 'Builder', Summary: 'I build things.' },
    Positions: [
      { 'Company Name': 'Acme', Title: 'Engineer', 'Started On': 'Jan 2020' },
    ],
    education: [{ 'School Name': 'MIT', 'Degree Name': 'BSc' }],
    skills: [{ Name: 'TypeScript' }, 'Node.js'],
  };
  const bundle = toLinkedinBundle(payload);
  assert.ok(bundle.profile);
  assert.equal(bundle.profile!.Headline, 'Builder');
  assert.equal(bundle.positions?.length, 1);
  assert.equal(bundle.education?.length, 1);
  assert.equal(bundle.skills?.length, 2);
});

test('toLinkedinBundle tolerates null/undefined/wrong-shape input', () => {
  assert.deepEqual(toLinkedinBundle(null), {});
  assert.deepEqual(toLinkedinBundle(undefined), {});
  assert.deepEqual(toLinkedinBundle('string'), {});
  const partial = toLinkedinBundle({ positions: 'not an array' });
  assert.deepEqual(partial.positions, []);
});

test('buildLinkedinPreview assembles work, education and accomplishments', () => {
  const bundle: LinkedinBundle = {
    profile: { Headline: 'Builder', Summary: 'I build things.' },
    positions: [
      {
        'Company Name': 'Acme',
        Title: 'Engineer',
        'Started On': 'Jan 2020',
        'Finished On': 'Mar 2022',
        Description: 'Shipped things.',
      },
      {
        'Company Name': 'Contoso',
        Title: 'Lead',
        'Started On': 'Apr 2022',
        'Finished On': '',
      },
    ],
    education: [
      {
        'School Name': 'MIT',
        'Degree Name': 'BSc',
        'Field Of Study': 'CS',
        'Start Date': '2016',
        'End Date': '2020',
        Grade: '3.9',
      },
    ],
    honors: [{ Title: "Dean's List", 'Issued On': '2019' }],
    certifications: [{ Name: 'AWS Certified', Authority: 'Amazon' }],
    skills: ['TypeScript', 'Node.js', 'TypeScript'],
  };
  const preview = buildLinkedinPreview(bundle, 'linkedin-json');
  assert.equal(preview.work.length, 2);
  assert.equal(preview.work[0].company, 'Acme');
  assert.equal(preview.work[0].startDate, '2020-01');
  assert.equal(preview.work[0].endDate, '2022-03');
  assert.equal(preview.work[1].current, true);
  assert.equal(preview.education.length, 1);
  assert.equal(preview.education[0].startYear, 2016);
  assert.equal(preview.education[0].endYear, 2020);
  assert.equal(preview.education[0].gpa, 3.9);
  assert.equal(preview.accomplishments.length, 2);
  assert.equal(preview.accomplishments[0].category, 'honor');
  assert.equal(preview.accomplishments[1].category, 'certification');
  // Skills de-duplicated case-insensitively.
  assert.equal(preview.skills.length, 2);
  assert.ok(preview.bio && preview.bio.includes('Builder'));
  assert.ok(preview.confidence > 0 && preview.confidence <= 1);
});

test('buildLinkedinPreview emits a warning when positions and education are missing', () => {
  const preview = buildLinkedinPreview(
    { profile: { Headline: 'Builder' } } as LinkedinBundle,
    'linkedin-zip',
  );
  assert.equal(preview.work.length, 0);
  assert.equal(preview.education.length, 0);
  assert.ok(preview.warnings.length >= 1);
  assert.match(preview.warnings[0], /Positions/);
});

test('parseLinkedinPublicHtml extracts a JSON-LD Person block', () => {
  const html = `
    <html>
      <head>
        <script type="application/ld+json">
          {"@type":"Person","name":"Avery","jobTitle":"Builder","description":"Builds.","worksFor":{"name":"Acme"},"alumniOf":[{"name":"MIT"}]}
        </script>
      </head>
      <body></body>
    </html>`;
  const bundle = parseLinkedinPublicHtml(html);
  assert.ok(bundle);
  assert.equal(bundle!.profile!.Name, 'Avery');
  assert.equal(bundle!.positions?.[0]['Company Name'], 'Acme');
  assert.equal(bundle!.education?.[0]['School Name'], 'MIT');
});

test('parseLinkedinPublicHtml returns null when no JSON-LD is present', () => {
  assert.equal(parseLinkedinPublicHtml('<html><body>login wall</body></html>'), null);
});

// ────────────────────────── Doc-type detection ──────────────────────────

test('detectDocType identifies supported file types', () => {
  assert.equal(detectDocType('resume.pdf', 'application/pdf'), 'pdf');
  assert.equal(detectDocType('resume.PDF', ''), 'pdf');
  assert.equal(
    detectDocType(
      'resume.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ),
    'docx',
  );
  assert.equal(detectDocType('resume.docx', ''), 'docx');
  assert.equal(detectDocType('export.zip', 'application/zip'), 'linkedin-zip');
  assert.equal(detectDocType('profile.json', 'application/json'), 'linkedin-json');
  assert.equal(detectDocType('bio.txt', 'text/plain'), 'text');
  assert.equal(detectDocType('weird.xyz', 'application/x-weird'), 'unknown');
});

// ────────────────────────── AI output normalisation ──────────────────────────

test('extractJsonObject parses raw JSON', () => {
  const data = extractJsonObject('{"a":1,"b":"two"}');
  assert.deepEqual(data, { a: 1, b: 'two' });
});

test('extractJsonObject strips ```json fences', () => {
  const data = extractJsonObject('```json\n{"a":1}\n```');
  assert.deepEqual(data, { a: 1 });
});

test('extractJsonObject recovers from preamble/postamble', () => {
  const raw = 'Sure, here you go:\n{"a":1,"b":2}\nLet me know if…';
  assert.deepEqual(extractJsonObject(raw), { a: 1, b: 2 });
});

test('extractJsonObject returns {} on invalid input', () => {
  assert.deepEqual(extractJsonObject(''), {});
  assert.deepEqual(extractJsonObject('not json at all'), {});
});

test('buildExtractionPrompt truncates very long input', () => {
  const long = 'x'.repeat(30_000);
  const prompt = buildExtractionPrompt(long);
  assert.ok(prompt.user.includes('[truncated]'));
  assert.ok(prompt.user.length < 25_000);
});

test('toPreviewFromAiOutput normalises a well-formed AI blob', () => {
  const data = {
    bio: 'I build things.',
    education: [
      {
        institution: 'MIT',
        degree: 'BSc',
        field: 'CS',
        startYear: 2016,
        endYear: 2020,
        gpa: '3.9',
      },
    ],
    work: [
      {
        company: 'Acme',
        title: 'Engineer',
        startDate: '2020-01',
        endDate: '2022-03',
        current: false,
      },
    ],
    projects: [{ name: 'Build thing', url: 'https://example.com' }],
    accomplishments: [{ title: "Dean's List", category: 'honor' }],
    skills: ['TypeScript', 'TypeScript', 'Node.js'],
  };
  const preview = toPreviewFromAiOutput(data, 'pdf', 'raw resume text');
  assert.equal(preview.source, 'pdf');
  assert.equal(preview.bio, 'I build things.');
  assert.equal(preview.education[0].institution, 'MIT');
  assert.equal(preview.education[0].gpa, 3.9);
  assert.equal(preview.work[0].company, 'Acme');
  assert.equal(preview.projects[0].url, 'https://example.com');
  assert.equal(preview.skills.length, 2);
  assert.ok(preview.confidence > 0.5);
});

test('toPreviewFromAiOutput salvages an empty blob into bio-only mode', () => {
  const preview = toPreviewFromAiOutput({}, 'pdf', 'raw resume text here');
  assert.equal(preview.work.length, 0);
  assert.equal(preview.education.length, 0);
  assert.ok(preview.warnings.length >= 1);
  assert.ok(preview.bio);
  assert.ok(preview.confidence < 0.5);
});

test('toPreviewFromAiOutput falls back institution/title when AI omits required fields', () => {
  const data = {
    education: [{ degree: 'BSc' }],
    work: [{ title: 'Engineer' }],
  };
  const preview = toPreviewFromAiOutput(data, 'pdf', 'some text');
  assert.equal(preview.education[0].institution, 'Unknown institution');
  assert.equal(preview.work[0].company, 'Unknown company');
});
