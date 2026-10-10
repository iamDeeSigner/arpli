<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import TopBar from '$lib/components/layout/TopBar.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Textarea from '$lib/components/ui/Textarea.svelte';
  import { applicationApi, opportunityApi } from '$lib/ipc/client';
  import type {
    Application,
    ApplicationDraft,
    ApplicationStatus,
    Opportunity,
    OpportunityQuestion,
  } from '@arpli/shared';

  const applicationId = $derived(($page.params.id ?? '') as string);

  let application = $state<Application | null>(null);
  let opportunity = $state<Opportunity | null>(null);
  let drafts = $state<ApplicationDraft[]>([]);
  let loading = $state(true);
  let loadError = $state<string | null>(null);

  /** Per-question working state: current content, word count, in-flight flag, errors. */
  type QuestionState = {
    content: string;
    tone: string;
    instruction: string;
    wordCount: number;
    busy: boolean;
    error: string | null;
    savedVersion: number | null;
    dirty: boolean;
  };
  let qState = $state<Record<string, QuestionState>>({});

  // custom questions the user added that aren't on the opportunity.
  type CustomQuestion = OpportunityQuestion;
  let customQuestions = $state<CustomQuestion[]>([]);
  let addingCustom = $state(false);
  let newCustomText = $state('');
  let newCustomLimit = $state<string>('');

  const STATUS_LABEL: Record<ApplicationStatus, string> = {
    discovered: 'Discovered',
    qualifying: 'Qualifying',
    drafting: 'Drafting',
    reviewing: 'Reviewing',
    submitted: 'Submitted',
    awaiting: 'Awaiting',
    won: 'Won',
    rejected: 'Rejected',
    waitlisted: 'Waitlisted',
    withdrew: 'Withdrew',
  };

  const STATUSES: ApplicationStatus[] = [
    'drafting',
    'reviewing',
    'submitted',
    'awaiting',
    'won',
    'rejected',
    'waitlisted',
    'withdrew',
  ];

  function countWords(s: string): number {
    const t = s.trim();
    return t === '' ? 0 : t.split(/\s+/u).length;
  }

  function parseQuestions(opp: Opportunity | null): OpportunityQuestion[] {
    if (!opp?.questions) return [];
    try {
      const parsed = JSON.parse(opp.questions);
      return Array.isArray(parsed) ? (parsed as OpportunityQuestion[]) : [];
    } catch {
      return [];
    }
  }

  const opportunityQuestions = $derived(parseQuestions(opportunity));
  const allQuestions = $derived([...opportunityQuestions, ...customQuestions]);

  function initQuestionState(questions: OpportunityQuestion[], drafts: ApplicationDraft[]) {
    const next: Record<string, QuestionState> = {};
    for (const q of questions) {
      const latest = drafts
        .filter((d) => d.questionId === q.id || (!d.questionId && d.questionText === q.text))
        .sort((a, b) => b.version - a.version)[0];
      next[q.id] = {
        content: latest?.draftContent ?? '',
        tone: latest?.tone ?? '',
        instruction: '',
        wordCount: latest ? latest.wordCount : 0,
        busy: false,
        error: null,
        savedVersion: latest?.version ?? null,
        dirty: false,
      };
    }
    qState = next;
  }

  async function load() {
    loading = true;
    loadError = null;
    try {
      const { application: a, drafts: d } = await applicationApi.get(applicationId);
      application = a;
      drafts = d;
      const { opportunity: o } = await opportunityApi.get(a.opportunityId);
      opportunity = o;
      const qs = parseQuestions(o);
      // Any draft whose questionId isn't in the opportunity's question list is a custom one.
      const knownIds = new Set(qs.map((q) => q.id));
      const seenCustom = new Map<string, CustomQuestion>();
      for (const draft of d) {
        if (!draft.questionId) continue;
        if (knownIds.has(draft.questionId)) continue;
        if (seenCustom.has(draft.questionId)) continue;
        seenCustom.set(draft.questionId, { id: draft.questionId, text: draft.questionText });
      }
      customQuestions = Array.from(seenCustom.values());
      initQuestionState([...qs, ...customQuestions], d);
    } catch (err) {
      loadError = err instanceof Error ? err.message : String(err);
    } finally {
      loading = false;
    }
  }

  onMount(load);

  function updateContent(qid: string, value: string) {
    const s = qState[qid];
    if (!s) return;
    qState = {
      ...qState,
      [qid]: {
        ...s,
        content: value,
        wordCount: countWords(value),
        dirty: true,
      },
    };
  }

  function updateTone(qid: string, value: string) {
    const s = qState[qid];
    if (!s) return;
    qState = { ...qState, [qid]: { ...s, tone: value } };
  }

  function updateInstruction(qid: string, value: string) {
    const s = qState[qid];
    if (!s) return;
    qState = { ...qState, [qid]: { ...s, instruction: value } };
  }

  async function draft(q: OpportunityQuestion, mode: 'draft' | 'regenerate') {
    const s = qState[q.id];
    if (!s) return;
    qState = { ...qState, [q.id]: { ...s, busy: true, error: null } };
    try {
      const result = await applicationApi.draft(applicationId, {
        questionId: q.id,
        questionText: q.text,
        wordLimit: q.wordLimit ?? null,
        tone: s.tone || null,
        instructions: s.instruction || null,
        previousDraft: mode === 'regenerate' ? s.content : null,
      });
      drafts = [result.draft, ...drafts];
      qState = {
        ...qState,
        [q.id]: {
          ...qState[q.id],
          content: result.draft.draftContent,
          wordCount: result.draft.wordCount,
          busy: false,
          error: result.withinLimit
            ? null
            : `Draft is ${result.draft.wordCount} words — over the ${q.wordLimit ?? ''} limit. Try regenerating with "shorter" in the instruction.`,
          savedVersion: result.draft.version,
          dirty: false,
          instruction: '',
        },
      };
      // bump the application status to drafting if it was earlier.
      if (application && application.status === 'discovered') {
        await updateStatus('drafting');
      }
    } catch (err) {
      qState = {
        ...qState,
        [q.id]: {
          ...qState[q.id],
          busy: false,
          error: err instanceof Error ? err.message : String(err),
        },
      };
    }
  }

  async function saveEdit(q: OpportunityQuestion) {
    const s = qState[q.id];
    if (!s) return;
    if (!s.content.trim()) {
      qState = { ...qState, [q.id]: { ...s, error: 'Draft is empty' } };
      return;
    }
    qState = { ...qState, [q.id]: { ...s, busy: true, error: null } };
    try {
      const { draft } = await applicationApi.saveDraft(applicationId, {
        questionId: q.id,
        questionText: q.text,
        draftContent: s.content,
        tone: s.tone || null,
      });
      drafts = [draft, ...drafts];
      qState = {
        ...qState,
        [q.id]: {
          ...qState[q.id],
          busy: false,
          dirty: false,
          savedVersion: draft.version,
          wordCount: draft.wordCount,
        },
      };
    } catch (err) {
      qState = {
        ...qState,
        [q.id]: {
          ...qState[q.id],
          busy: false,
          error: err instanceof Error ? err.message : String(err),
        },
      };
    }
  }

  async function copyToClipboard(q: OpportunityQuestion) {
    const content = qState[q.id]?.content ?? '';
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      // Fallback for environments without clipboard permission — select the field.
      // Users can also copy with cmd/ctrl + C from the textarea.
    }
  }

  async function updateStatus(status: ApplicationStatus) {
    if (!application) return;
    try {
      const { application: updated } = await applicationApi.update(application.id, { status });
      application = updated;
    } catch {
      // non-fatal
    }
  }

  function addCustomQuestion() {
    const text = newCustomText.trim();
    if (!text) return;
    const q: CustomQuestion = {
      id: crypto.randomUUID(),
      text,
      wordLimit: newCustomLimit.trim() ? parseInt(newCustomLimit.trim(), 10) || undefined : undefined,
    };
    customQuestions = [...customQuestions, q];
    qState = {
      ...qState,
      [q.id]: {
        content: '',
        tone: '',
        instruction: '',
        wordCount: 0,
        busy: false,
        error: null,
        savedVersion: null,
        dirty: false,
      },
    };
    newCustomText = '';
    newCustomLimit = '';
    addingCustom = false;
  }

  function removeCustomQuestion(qid: string) {
    customQuestions = customQuestions.filter((q) => q.id !== qid);
    const { [qid]: _, ...rest } = qState;
    qState = rest;
  }
</script>

<TopBar
  title={opportunity?.title ?? 'Application'}
  subtitle={opportunity?.organization ?? null}
>
  {#snippet actions()}
    {#if application}
      <select
        value={application.status}
        onchange={(e) => updateStatus((e.target as HTMLSelectElement).value as ApplicationStatus)}
        class="rounded-md border border-border bg-background px-2 py-1 text-sm
          focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
      >
        {#each STATUSES as s}
          <option value={s}>{STATUS_LABEL[s]}</option>
        {/each}
      </select>
    {/if}
    <Button size="sm" variant="ghost" href="/applications">← Back</Button>
  {/snippet}
</TopBar>

<div class="flex-1 overflow-auto p-6">
  {#if loading}
    <p class="text-sm text-muted-foreground">Loading…</p>
  {:else if loadError}
    <Card>
      <h2 class="text-base font-semibold">Could not load this application</h2>
      <p class="mt-2 text-sm text-muted-foreground">{loadError}</p>
      <div class="mt-4">
        <Button variant="secondary" size="sm" onclick={load}>Try again</Button>
      </div>
    </Card>
  {:else if !application || !opportunity}
    <p class="text-sm text-muted-foreground">Application not found.</p>
  {:else}
    <div class="mx-auto max-w-3xl space-y-6">
      {#if allQuestions.length === 0}
        <Card>
          <h2 class="text-base font-semibold">No questions saved on this opportunity</h2>
          <p class="mt-2 text-sm text-muted-foreground">
            Add questions below and Arpli will draft them. You can also go back and edit the opportunity
            to add its application questions once.
          </p>
        </Card>
      {/if}

      {#each allQuestions as q, i (q.id)}
        {@const s = qState[q.id]}
        {@const isCustom = customQuestions.some((c) => c.id === q.id)}
        <Card>
          <div class="flex items-start gap-3">
            <span class="mt-0.5 text-sm font-medium text-muted-foreground">Q{i + 1}</span>
            <div class="flex-1">
              <p class="text-sm font-medium leading-relaxed">{q.text}</p>
              <div class="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {#if q.wordLimit}
                  <span>Limit: {q.wordLimit} words</span>
                {/if}
                <span>
                  Current: {s?.wordCount ?? 0} words{q.wordLimit
                    ? s?.wordCount && s.wordCount > q.wordLimit
                      ? ` (over by ${s.wordCount - q.wordLimit})`
                      : ''
                    : ''}
                </span>
                {#if s?.savedVersion}
                  <span>Saved: v{s.savedVersion}</span>
                {/if}
                {#if s?.dirty}
                  <span class="text-warning">Unsaved changes</span>
                {/if}
              </div>
            </div>
            {#if isCustom}
              <button
                aria-label="Remove question"
                class="text-muted-foreground hover:text-foreground text-sm"
                onclick={() => removeCustomQuestion(q.id)}
              >✕</button>
            {/if}
          </div>

          {#if s}
            <div class="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label class="mb-1 block text-xs font-medium text-muted-foreground" for={`tone-${q.id}`}>
                  Tone (optional)
                </label>
                <Input
                  id={`tone-${q.id}`}
                  value={s.tone}
                  placeholder="e.g. concise, warm, formal"
                  oninput={(e: Event) => updateTone(q.id, (e.target as HTMLInputElement).value)}
                />
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-muted-foreground" for={`instr-${q.id}`}>
                  Regenerate instruction (optional)
                </label>
                <Input
                  id={`instr-${q.id}`}
                  value={s.instruction}
                  placeholder="e.g. shorter, lead with ARPA-E"
                  oninput={(e: Event) => updateInstruction(q.id, (e.target as HTMLInputElement).value)}
                />
              </div>
            </div>

            <div class="mt-4">
              <Textarea
                rows={8}
                value={s.content}
                placeholder="Click Draft to generate an answer grounded in your profile…"
                oninput={(e: Event) => updateContent(q.id, (e.target as HTMLTextAreaElement).value)}
              />
            </div>

            {#if s.error}
              <p class="mt-3 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{s.error}</p>
            {/if}

            <div class="mt-4 flex flex-wrap items-center gap-2">
              {#if s.content.trim().length === 0}
                <Button onclick={() => draft(q, 'draft')} disabled={s.busy}>
                  {s.busy ? 'Drafting…' : 'Draft with AI'}
                </Button>
              {:else}
                <Button onclick={() => draft(q, 'regenerate')} disabled={s.busy}>
                  {s.busy ? 'Regenerating…' : 'Regenerate'}
                </Button>
                <Button variant="secondary" onclick={() => saveEdit(q)} disabled={s.busy || !s.dirty}>
                  {s.busy ? 'Saving…' : s.dirty ? 'Save edits' : 'Saved'}
                </Button>
                <Button variant="ghost" onclick={() => copyToClipboard(q)}>Copy</Button>
              {/if}
            </div>
          {/if}
        </Card>
      {/each}

      <!-- Add custom question -->
      {#if addingCustom}
        <Card>
          <h3 class="text-sm font-semibold">Add a question</h3>
          <p class="mt-1 text-xs text-muted-foreground">
            For when the opportunity has prompts you didn't record earlier.
          </p>
          <div class="mt-3 space-y-3">
            <Textarea
              rows={3}
              bind:value={newCustomText}
              placeholder="Paste the question text…"
            />
            <div class="flex items-center gap-2">
              <label class="text-xs text-muted-foreground" for="new-wl">Word limit:</label>
              <input
                id="new-wl"
                type="number"
                min="0"
                bind:value={newCustomLimit}
                class="w-24 rounded border border-border bg-background px-2 py-1 text-xs
                  focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div class="flex gap-2">
              <Button onclick={addCustomQuestion} disabled={!newCustomText.trim()}>Add</Button>
              <Button variant="ghost" onclick={() => { addingCustom = false; newCustomText = ''; newCustomLimit = ''; }}>Cancel</Button>
            </div>
          </div>
        </Card>
      {:else}
        <div class="flex justify-center">
          <Button variant="secondary" onclick={() => { addingCustom = true; }}>
            + Add a question
          </Button>
        </div>
      {/if}
    </div>
  {/if}
</div>
