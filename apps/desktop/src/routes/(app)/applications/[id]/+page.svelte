<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import TopBar from '$lib/components/layout/TopBar.svelte';
  import EmptyState from '$lib/components/layout/EmptyState.svelte';
  import { ErrorState, LoadingState, ScreenBody } from '$lib/components/patterns/screen';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Select } from '$lib/components/ui/select';
  import { Textarea } from '$lib/components/ui/textarea';
  import { fade, fly, slide } from '$lib/motion';
  import { applicationApi, opportunityApi } from '$lib/ipc/client';
  import ArrowClockwiseIcon from 'phosphor-svelte/lib/ArrowClockwiseIcon';
  import ArrowLeftIcon from 'phosphor-svelte/lib/ArrowLeftIcon';
  import CopyIcon from 'phosphor-svelte/lib/CopyIcon';
  import FileTextIcon from 'phosphor-svelte/lib/FileTextIcon';
  import FloppyDiskIcon from 'phosphor-svelte/lib/FloppyDiskIcon';
  import PlusIcon from 'phosphor-svelte/lib/PlusIcon';
  import SparkleIcon from 'phosphor-svelte/lib/SparkleIcon';
  import WarningCircleIcon from 'phosphor-svelte/lib/WarningCircleIcon';
  import XIcon from 'phosphor-svelte/lib/XIcon';
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

  const STATUS_ITEMS = STATUSES.map((value) => ({ value, label: STATUS_LABEL[value] }));

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
      <div class="w-40">
        <Select.Root
          value={application.status}
          items={STATUS_ITEMS}
          onchange={(value) => updateStatus(value as ApplicationStatus)}
        >
          <Select.Trigger aria-label="Application status">
            <Select.Value />
          </Select.Trigger>
          <Select.Content portal class="w-40">
            {#each STATUS_ITEMS as item (item.value)}
              <Select.Item value={item.value} label={item.label}>{item.label}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>
    {/if}
    <Button size="sm" variant="ghost" href="/applications">
      {#snippet leadingIcon()}<ArrowLeftIcon />{/snippet}
      Back
    </Button>
  {/snippet}
</TopBar>

<ScreenBody>
  {#if loading}
    <LoadingState recipe="form" label="Loading application" />
  {:else if loadError}
    {#snippet errorMessage()}
      Could not load this application: {loadError}
    {/snippet}
    <ErrorState message={errorMessage} retryLabel="Try again" onRetry={load} />
  {:else if !application || !opportunity}
    <div in:fade>
      <EmptyState title="Application not found." icon={FileTextIcon} />
    </div>
  {:else}
    <div class="mx-auto flex max-w-3xl flex-col gap-6" in:fade>
      {#if allQuestions.length === 0}
        <Card.Root>
          <Card.Header>
            <Card.Title>No questions saved on this opportunity</Card.Title>
            <Card.Description>
              Add questions below and Arpli will draft them. You can also go back and edit the
              opportunity to add its application questions once.
            </Card.Description>
          </Card.Header>
        </Card.Root>
      {/if}

      {#each allQuestions as q, i (q.id)}
        {@const s = qState[q.id]}
        {@const isCustom = customQuestions.some((c) => c.id === q.id)}
        <div in:fly={{ tier: 'moderate' }} out:fade={{ tier: 'fast' }}>
          <Card.Root>
            <Card.Header>
              <div class="flex min-w-0 items-start gap-3">
                <span class="type-caption mt-0.5 font-medium text-muted-foreground">Q{i + 1}</span>
                <div class="flex min-w-0 flex-1 flex-col gap-1.5">
                  <Card.Title class="type-body leading-relaxed">{q.text}</Card.Title>
                  <div class="type-caption flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
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
                      {#key s.savedVersion}
                        <span in:fade={{ tier: 'fast' }}>
                          <Badge size="compact">Saved: v{s.savedVersion}</Badge>
                        </span>
                      {/key}
                    {/if}
                    {#if s?.dirty}
                      <span transition:fade={{ tier: 'fast' }}>
                        <Badge variant="dot" color="amber" size="compact">Unsaved changes</Badge>
                      </span>
                    {/if}
                  </div>
                </div>
              </div>
              {#if isCustom}
                <Card.Action>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    tooltip="Remove question"
                    aria-label="Remove question"
                    onclick={() => removeCustomQuestion(q.id)}
                  >
                    <XIcon />
                  </Button>
                </Card.Action>
              {/if}
            </Card.Header>

            {#if s}
              <Card.Content class="flex flex-col gap-4">
                <div class="grid grid-cols-2 gap-3">
                  <div class="flex flex-col gap-1.5">
                    <Label for={`tone-${q.id}`}>Tone (optional)</Label>
                    <Input
                      id={`tone-${q.id}`}
                      bind:value={() => s.tone, (v: string) => updateTone(q.id, v)}
                      placeholder="e.g. concise, warm, formal"
                    />
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <Label for={`instr-${q.id}`}>Regenerate instruction (optional)</Label>
                    <Input
                      id={`instr-${q.id}`}
                      bind:value={() => s.instruction, (v: string) => updateInstruction(q.id, v)}
                      placeholder="e.g. shorter, lead with ARPA-E"
                    />
                  </div>
                </div>

                <Textarea
                  autoResize
                  minHeight={176}
                  maxHeight={640}
                  bind:value={() => s.content, (v: string) => updateContent(q.id, v)}
                  placeholder="Click Draft to generate an answer grounded in your profile…"
                  aria-label={`Answer to question ${i + 1}`}
                />

                {#if s.error}
                  <p
                    role="alert"
                    class="type-caption flex items-start gap-2 rounded-(--radius-medium) bg-danger/10 px-3 py-2 text-danger"
                    transition:slide={{ tier: 'fast' }}
                  >
                    <WarningCircleIcon class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span>{s.error}</span>
                  </p>
                {/if}
              </Card.Content>

              <Card.Footer>
                {#if s.content.trim().length === 0}
                  <Button variant="primary" onclick={() => draft(q, 'draft')} disabled={s.busy}>
                    {#snippet leadingIcon()}<SparkleIcon />{/snippet}
                    {s.busy ? 'Drafting…' : 'Draft with AI'}
                  </Button>
                {:else}
                  <Button variant="primary" onclick={() => draft(q, 'regenerate')} disabled={s.busy}>
                    {#snippet leadingIcon()}<ArrowClockwiseIcon />{/snippet}
                    {s.busy ? 'Regenerating…' : 'Regenerate'}
                  </Button>
                  <Button
                    variant="secondary"
                    onclick={() => saveEdit(q)}
                    disabled={s.busy || !s.dirty}
                  >
                    {#snippet leadingIcon()}<FloppyDiskIcon />{/snippet}
                    {s.busy ? 'Saving…' : s.dirty ? 'Save edits' : 'Saved'}
                  </Button>
                  <Button variant="ghost" onclick={() => copyToClipboard(q)}>
                    {#snippet leadingIcon()}<CopyIcon />{/snippet}
                    Copy
                  </Button>
                {/if}
              </Card.Footer>
            {/if}
          </Card.Root>
        </div>
      {/each}

      <!-- Add custom question -->
      {#if addingCustom}
        <div in:slide={{ tier: 'moderate' }}>
          <Card.Root>
            <Card.Header>
              <Card.Title>Add a question</Card.Title>
              <Card.Description>
                For when the opportunity has prompts you didn't record earlier.
              </Card.Description>
            </Card.Header>
            <Card.Content class="flex flex-col gap-3">
              <Textarea
                autoResize
                minHeight={88}
                bind:value={newCustomText}
                placeholder="Paste the question text…"
                aria-label="Question text"
              />
              <div class="flex items-center gap-2">
                <Label for="new-wl">Word limit:</Label>
                <Input
                  id="new-wl"
                  type="number"
                  min="0"
                  class="w-24"
                  bind:value={
                    () => newCustomLimit,
                    (v: string | number | null | undefined) =>
                      (newCustomLimit = v == null ? '' : String(v))
                  }
                />
              </div>
            </Card.Content>
            <Card.Footer>
              <Button
                variant="primary"
                onclick={addCustomQuestion}
                disabled={!newCustomText.trim()}
              >
                Add
              </Button>
              <Button
                variant="ghost"
                onclick={() => {
                  addingCustom = false;
                  newCustomText = '';
                  newCustomLimit = '';
                }}
              >
                Cancel
              </Button>
            </Card.Footer>
          </Card.Root>
        </div>
      {:else}
        <div class="flex justify-center">
          <Button
            variant="secondary"
            onclick={() => {
              addingCustom = true;
            }}
          >
            {#snippet leadingIcon()}<PlusIcon />{/snippet}
            Add a question
          </Button>
        </div>
      {/if}
    </div>
  {/if}
</ScreenBody>
