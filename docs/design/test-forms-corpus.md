# Test Forms Corpus — 20 Application Types

*A diverse set of real-world application forms for testing and designing the Arpli Application Workspace. Covers the full range of form complexity, question types, and user contexts.*

---

## How to read this

Each entry has:
- **What it is** — the real-world form
- **Question types** — what kinds of answers the form asks for
- **Design challenge for Arpli** — the hardest part of supporting this type
- **Link** — real URL if always-live, or "seasonal / build sample"

---

## Scholarship & Fellowship (Narrative-heavy)

### 1. Fulbright U.S. Student Program
- **Questions:** 3 essays (1,000–1,500 words each), project statement, language evaluation, personal statement
- **Also:** Transcripts upload, 3 recommendation letters, country rank selections
- **Design challenge:** Very long per-question word counts, multiple document uploads, structured sections within a single "question"
- **Link:** https://apply.iie.org/fusp (seasonal — open Aug–Oct)

### 2. Rhodes Scholarship
- **Questions:** Personal statement + 8 essay questions (200–500 words each), academic achievement narrative
- **Also:** Academic transcripts, 4–8 recommendation letters, achievements list
- **Design challenge:** High volume of distinct essays, each one requires a different angle on the same person
- **Link:** https://www.rhodeshouse.ox.ac.uk/scholars/how-to-apply/ (seasonal)

### 3. Gates Cambridge Scholarship
- **Questions:** Why Gates Cambridge (500 words), research proposal (2,000 words), contribution to improving lives of others (500 words)
- **Also:** CV/resume upload, 2 academic references, university application required separately
- **Design challenge:** The "research proposal" is a structured document, not just an essay — has its own internal sections
- **Link:** https://www.gatescambridge.org/apply/ (seasonal)

### 4. Marshall Scholarship
- **Questions:** Career goals essay, how Marshall supports your development, proposed program/university (choose 3), academic writing sample
- **Also:** Transcripts, 3 recommendations, official academic records
- **Design challenge:** Multiple sub-selections (which universities you're applying to) affect what essays you write
- **Link:** https://www.marshallscholarship.org/apply (seasonal)

---

## Accelerator & Startup

### 5. Y Combinator Application
- **Questions:** ~25 short-answer questions, most with 150–250 word limits — e.g. "What are you building?", "Why did you pick this idea?", "What's your progress?"
- **Also:** Company URL, demo video URL, founder bios, co-founder agreements
- **Design challenge:** High question volume with strict word limits; answers must be crisp and punchy, not academic — very different register from scholarships
- **Link:** https://www.ycombinator.com/apply (always open)

### 6. Techstars Application
- **Questions:** Idea description, team background, what stage are you at, why Techstars, biggest challenge so far
- **Also:** Pitch deck upload (optional), product URL, metrics/traction data
- **Design challenge:** Metrics fields (MRR, users, growth rate) mixed with narrative — some answers are numbers not prose
- **Link:** https://www.techstars.com/apply (program-specific, often open)

### 7. a16z Speedrun
- **Questions:** What are you building, who is your customer, what's the evidence of demand, why now, team bios
- **Also:** One-pager or deck upload, quick financial info
- **Design challenge:** Very compressed — the whole form takes ~15 minutes. Arpli must help write fast without losing substance.
- **Link:** https://speedrun.a16z.com (varies)

---

## Job Applications (ATS)

### 8. Greenhouse ATS (mid-size tech)
- **Questions:** Resume upload, cover letter (optional or required), 4–8 custom screening questions ("Describe your experience with X", "What's your expected salary?")
- **Also:** EEO demographic form (separate), LinkedIn/portfolio URL, work authorization status
- **Design challenge:** Screening questions are unique per job, often vague, and must be answered in the form's own text box — no word limit shown but ~200–400 words typical
- **Link:** Find any current job at e.g. Stripe, Notion, Linear on Greenhouse

### 9. Workday Application (enterprise)
- **Questions:** 10–15 form pages — personal info, work history (structured data), education, certifications, references, cover letter, 3–5 essay questions
- **Also:** Resume parsing (often breaks), EEO, veteran status, background check consent
- **Design challenge:** Structured data fields (dates, titles, company names) mixed with narrative; resume parsing errors require manual correction; extremely long
- **Link:** Any Fortune 500 careers page (Walmart, Salesforce, etc.)

### 10. Ashby ATS (modern startup)
- **Questions:** Resume upload, 3–5 custom questions (200–400 words), optional cover letter, portfolio/GitHub/Behance URL
- **Also:** Work authorization, referral source
- **Design challenge:** Clean modern form — almost pleasant — but questions are highly contextual and company-specific
- **Link:** Loom, Vercel, Linear, Figma job pages often use Ashby

### 11. LinkedIn Easy Apply
- **Questions:** Resume pull from profile, contact info, 5–10 quick questions (often yes/no, dropdowns, or one-liners), sometimes a cover letter field
- **Also:** Often auto-fills from LinkedIn profile
- **Design challenge:** Speed is the whole point — but answers are often shallow. Does Arpli still help here?
- **Link:** Any job on LinkedIn with "Easy Apply" badge

---

## Academic Admissions

### 12. PhD Application (typical graduate portal)
- **Questions:** Statement of Purpose (1,000–1,500 words), personal history statement (500–1,000 words), research proposal (varies)
- **Also:** Transcripts, 3 recommendation letter invitations sent to referees, writing sample PDF upload, GRE scores (often optional now)
- **Design challenge:** The "SOP" is a very specific genre with program-specific conventions; multiple uploads; referees act independently
- **Link:** Most use a common portal like ApplyWeb or Slate — e.g., UC Berkeley, MIT, Stanford grad admissions

### 13. MBA Application (HBS / Wharton / Booth)
- **Questions:** 2–4 essays (250–500 words each), optional "additional information" essay, resume, goals statement
- **Also:** GMAT/GRE upload, recommendation letters, interview (separate stage)
- **Design challenge:** MBA essays require knowing the specific school's "culture" and tailoring — high strategic complexity
- **Link:** Harvard: https://www.hbs.edu/mba/admissions/application-process/ (seasonal)

### 14. Common App (Undergraduate)
- **Questions:** Personal essay (650 words), activities list (150 chars each × 10 activities), school-specific supplemental essays (varies per school)
- **Also:** Test scores, GPA, demographics, recommendations from counselor + 1–2 teachers
- **Design challenge:** One platform, many schools — each school has different supplemental questions. Managing multiple versions of answers across schools.
- **Link:** https://www.commonapp.org (seasonal, Aug–Jan)

---

## Grants & Awards

### 15. NSF Graduate Research Fellowship (GRFP)
- **Questions:** Personal, Relevant Background & Future Goals statement (3 pages PDF), Graduate Research Plan statement (2 pages PDF)
- **Also:** 3 reference letters, transcripts, FastLane/Research.gov portal (notoriously difficult)
- **Design challenge:** PDF uploads, not text fields — but the PDFs are written documents that must match specific format requirements. Very process-heavy portal.
- **Link:** https://www.nsfgrfp.org (open annually Sept–Oct)

### 16. Artist/Creative Grant (Knight Arts Challenge / NEA style)
- **Questions:** Project description (300–500 words), artistic vision, community impact, budget narrative
- **Also:** Work samples (images, video links, audio files), artist bio, organizational budget if nonprofit
- **Design challenge:** Work sample uploads are critical and often weighted as heavily as the text; many file format requirements
- **Link:** https://knightarts.org/apply (varies by program)

### 17. Design Award Application (D&AD / ADC Young Guns)
- **Questions:** Project title, brief statement, case study description, design rationale
- **Also:** Image uploads (specific pixel/size requirements), category selection, credit list (every contributor named)
- **Design challenge:** The "answers" are mostly visual — the written component matters less than the work samples; but the credit list is complex
- **Link:** https://www.dandad.org/en/d-and-ad-awards/ (seasonal Jan–April)

---

## Government & Civic

### 18. U.S. Nonimmigrant Visa Application (DS-160)
- **Questions:** 40+ sections — personal info, travel history, family info, work history, security questions (all yes/no or dropdown)
- **Also:** Photo upload (specific ICAO standard), passport scan, travel itinerary
- **Design challenge:** Zero narrative — but extremely long and high-stakes. Errors have serious consequences. Arpli would help avoid mistakes, not draft prose.
- **Link:** https://ceac.state.gov/genniv/ (always open)

### 19. SNAP Benefits Application (government benefits style)
- **Questions:** Household composition, income sources, housing costs, resources/assets — all structured data
- **Also:** ID upload, proof of income upload, residency verification
- **Design challenge:** This is entirely structured data + document uploads, no narrative at all. Tests whether Arpli is only for essay questions or also helps with data-entry forms.
- **Link:** Each state has their own — e.g., https://www.dhs.state.il.us/ABE

---

## Modern/Conversational

### 20. Typeform-style conversational form (e.g., a fellowship using Typeform)
- **Questions:** One question at a time, full-screen, with emoji reactions, progress bar, branching logic (answer A leads to different next question than answer B)
- **Also:** File upload steps, NPS-style rating questions, video response option (some Typeforms)
- **Design challenge:** The question-by-question format is completely different from a multi-question page — the user never sees all questions at once. What does the "Application Workspace" even look like for this?
- **Link:** Any Typeform — e.g., some residency programs, small foundation grants, and startup programs use this

---

## Summary: What these 20 reveal

| Characteristic | Forms that have it |
|---|---|
| Long-form essays (1,000+ words) | Fulbright, Rhodes, Gates Cambridge, NSF GRFP, SOP |
| Strict word limits (150–500 words) | YC, Common App supplements, MBA |
| File uploads (PDF documents) | NSF GRFP, PhD app, artist grants |
| File uploads (images/video) | Design awards, artist grants |
| Structured data fields (no narrative) | DS-160, SNAP, Workday |
| Mixed structured + narrative | Greenhouse ATS, Techstars, Marshall |
| Branching / conditional logic | Typeform, government forms |
| Multi-stage / sequential | All academic applications, MBA |
| Referees / external participants | Rhodes, Fulbright, PhD, MBA |
| Program-specific tailoring needed | MBA, Marshall, Fulbright country-specific |
| Speed-optimized (< 20 min) | LinkedIn Easy Apply, some Typeforms |
| Multi-day / multi-week effort | Rhodes, Fulbright, PhD, MBA |




---

## Real Live Form Links (Updated Oct 2026)

*These are actual clickable application forms, not program home pages.*

### Always-live

| Form | Platform | Link |
|---|---|---|
| Y Combinator (Winter 2027 batch open) | YC portal | https://ycombinator.com/apply |
| Workday applying to Workday | Workday | https://workday.wd5.myworkdayjobs.com/en-US/Workday/introduceYourself |
| GM Careers (browse then apply) | Workday | https://generalmotors.wd5.myworkdayjobs.com/Careers_GM |
| State of NC public sector jobs | Workday | https://nc.wd108.myworkdayjobs.com/NC_Careers |
| U.S. Visa DS-160 application | Government | https://ceac.state.gov/genniv/ |

### Live job postings (Ashby ATS — open until filled)

| Role | Company | Link |
|---|---|---|
| Product Designer | Watershed | https://jobs.ashbyhq.com/watershed/bb7b1da5-1e38-48e8-a4d0-e3c8e32a8970 |
| Sr./Staff Product Designer, Growth | Runway | https://jobs.ashbyhq.com/runway-ml/28e151ac-cb29-4695-9041-a9e352624111 |
| Founding Product Designer | Mastra | https://jobs.ashbyhq.com/mastra/2b50b79c-588b-4983-bed5-7748a46e5ca2 |
| Founding Product Designer | Inferact | https://jobs.ashbyhq.com/inferact/f73d3f45-cdea-41a8-8144-acf504aa4fda |

### Live job postings (Greenhouse ATS — open until filled)

| Role | Org | Link |
|---|---|---|
| Software Engineer Intern 2025/2026 | IMC | https://boards.greenhouse.io/imc/jobs/4388436101 |
| Economics Consulting Analyst | Charles River Associates | https://boards.greenhouse.io/charlesriverassociates/jobs/6142000 |
| Data Scientist Intern (Spring 2026) | Zipline | https://boards.greenhouse.io/embed/job_app?token=7480013003 |

### Live fellowship/scholarship forms

| Form | Platform | Link |
|---|---|---|
| 2026-2027 Fellowship Application | JotForm (conversational) | https://form.jotform.com/252252484296058 |
| Research & Scholarship Fellowship | Google Forms | https://forms.gle/T2suiVjsBw28hYP4A |

### Seasonal (check during application window)

| Form | Opens | Notes |
|---|---|---|
| Fulbright U.S. Student | April each year | Portal: apply.iie.org/fusp — 2026-2027 cycle closed Oct 6 |
| Rhodes Scholarship | June–Oct | rhodeshouse.ox.ac.uk/scholars/how-to-apply |
| Gates Cambridge | Sept–Dec | gatescambridge.org/apply |
| NSF GRFP | Aug–Oct | nsfgrfp.org |
| ACLS Fellowships | July–Sept | acls.org/competitions/acls-fellowships — closed Sept 17, 2026 |
| Common App (undergrad) | Aug–Jan | commonapp.org |

### LinkedIn Easy Apply
No permanent link — any current job posting on LinkedIn with the "Easy Apply" badge is an example. Search any role on linkedin.com/jobs and filter for Easy Apply.
