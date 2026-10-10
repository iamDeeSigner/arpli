<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import TopBar from '$lib/components/layout/TopBar.svelte';
  import EmptyState from '$lib/components/layout/EmptyState.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Textarea from '$lib/components/ui/Textarea.svelte';
  import { applicationApi, opportunityApi, profileApi } from '$lib/ipc/client';
  import type { Opportunity, OpportunityDraft, OpportunityType, OpportunityQuestion } from '@arpli/shared';

  // ── page state ──────────────────────────────────────────────────────────────

  type View = 'list' | 'intake';
  type InputMode = 'text' | 'url' | 'pdf';
  type IntakeStep = 'input' | 'preview';

  let view = $state<View>('list');
  let opportunities = $state<Opportunity[]>([]);
  let loadError = $state<string | null>(null);
  let loadingList = $state(true);

  // intake
  let inputMode = $state<InputMode>('text');
  let intakeStep = $state<IntakeStep>('input');
  let textInput = $state('');
  let urlInput = $state('');
  let pdfFileName = $state('');
  let pdfBase64 = $state('');
  let parsing = $state(false);
  let parseError = $state<string | null>(null);
  let saving = $state(false);
  let saveError = $state<string | null>(null);

  // draft fields (editable after parse)
  let draftTitle = $state('');
  let draftType = $state<OpportunityType>('other');
  let draftOrganization = $state('');
  let draftUrl = $state('');
  let draftDeadline = $state('');
  let draftEligibility = $state('');
  let draftDescription = $state('');
  let draftTagsRaw = $state('');      // comma-separated
  let draftQuestions = $state<OpportunityQuestion[]>([]);

  // ── load list ───────────────────────────────────────────────────────────────

  async function loadOpportunities() {
    loadingList = true;
    loadError = null;
    try {
      const result = await opportunityApi.list();
      opportunities = result.opportunities;
    } catch (err) {
      loadError = err instanceof Error ? err.message : String(err);
    } finally {
      loadingList = false;
    }
  }

  onMount(loadOpportunities);

  // ── intake flow ─────────────────────────────────────────────────────────────

  function openIntake() {
    resetIntake();
    view = 'intake';
  }

  function resetIntake() {
    inputMode = 'text';
    intakeStep = 'input';
    textInput = '';
    urlInput = '';
    pdfFileName = '';
    pdfBase64 = '';
    parseError = null;
    saveError = null;
    clearDraft();
  }

  function clearDraft() {
    draftTitle = '';
    draftType = 'other';
    draftOrganization = '';
    draftUrl = '';
    draftDeadline = '';
    draftEligibility = '';
    draftDescription = '';
    draftTagsRaw = '';
    draftQuestions = [];
  }

  function applyDraft(d: OpportunityDraft) {
    draftTitle = d.title ?? '';
    draftType = d.type ?? 'other';
    draftOrganization = d.organization ?? '';
    draftUrl = d.url ?? '';
    draftDeadline = d.deadline ?? '';
    draftEligibility = d.eligibility ?? '';
    draftDescription = d.description ?? '';
    draftTagsRaw = (d.tags ?? []).join(', ');
    draftQuestions = d.questions ?? [];
  }

  async function handlePdfFile(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    pdfFileName = file.name;
    const buf = await file.arrayBuffer();
    pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
  }

  async function parse() {
    parseError = null;
    parsing = true;
    try {
      const payload =
        inputMode === 'pdf' ? { pdfBase64 }
        : inputMode === 'url' ? { url: urlInput.trim() }
        : { text: textInput.trim() };

      const result = await opportunityApi.intake(payload);
      applyDraft(result.draft);
      intakeStep = 'preview';
    } catch (err) {
      parseError = err instanceof Error ? err.message : String(err);
    } finally {
      parsing = false;
    }
  }

  async function save() {
    saveError = null;
    saving = true;
    try {
      const tags = draftTagsRaw
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await opportunityApi.create({
        title: draftTitle,
        type: draftType,
        organization: draftOrganization || null,
        url: draftUrl || null,
        deadline: draftDeadline || null,
        eligibility: draftEligibility || null,
        description: draftDescription || null,
        tags,
        questions: draftQuestions,
      } as OpportunityDraft);

      view = 'list';
      await loadOpportunities();
    } catch (err) {
      saveError = err instanceof Error ? err.message : String(err);
    } finally {
      saving = false;
    }
  }

  async function archiveOpportunity(id: string) {
    try {
      await opportunityApi.update(id, { status: 'archived' } as unknown as Partial<OpportunityDraft>);
      await loadOpportunities();
    } catch {
      // silently ignore — user can retry
    }
  }

  async function deleteOpportunity(id: string) {
    if (!confirm('Delete this opportunity? This cannot be undone.')) return;
    try {
      await opportunityApi.delete(id);
      await loadOpportunities();
    } catch {
      // silently ignore
    }
  }

  let startingDraftId = $state<string | null>(null);

  async function startDrafting(opportunityId: string) {
    startingDraftId = opportunityId;
    try {
      const profile = await profileApi.get();
      if (!profile) {
        alert('Create a profile first in Profile → Builder so Arpli has context to draft from.');
        return;
      }
      const { application } = await applicationApi.ensure(opportunityId, profile.id);
      await goto(`/applications/${application.id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      startingDraftId = null;
    }
  }

  // ── helpers ─────────────────────────────────────────────────────────────────

  const OPPORTUNITY_TYPES: OpportunityType[] = [
    'scholarship', 'grant', 'fellowship', 'accelerator', 'job', 'other',
  ];

  function typeLabel(t: OpportunityType): string {
    const map: Record<OpportunityType, string> = {
      scholarship: 'Scholarship',
      grant: 'Grant',
      fellowship: 'Fellowship',
      accelerator: 'Accelerator',
      job: 'Job',
      other: 'Other',
    };
    return map[t] ?? t;
  }

  function parseInputReady(): boolean {
    if (inputMode === 'text') return textInput.trim().length > 0;
    if (inputMode === 'url') return urlInput.trim().length > 0;
    if (inputMode === 'pdf') return pdfBase64.length > 0;
    return false;
  }

  function updateQuestion(i: number, field: 'text' | 'wordLimit', val: string) {
    const updated = [...draftQuestions];
    if (field === 'wordLimit') {
      const n = parseInt(val, 10);
      updated[i] = { ...updated[i], wordLimit: isNaN(n) ? undefined : n };
    } else {
      updated[i] = { ...updated[i], text: val };
    }
    draftQuestions = updated;
  }

  function removeQuestion(i: number) {
    draftQuestions = draftQuestions.filter((_, idx) => idx !== i);
  }

  function addQuestion() {
    draftQuestions = [
      ...draftQuestions,
      { id: crypto.randomUUID(), text: '' },
    ];
  }

  const activeOpps = $derived(opportunities.filter((o) => o.status === 'active'));
</script>

<!-- ── Top bar ─────────────────────────────────────────────────────────────── -->

<TopBar title="Opportunities" subtitle="Scholarships, grants, fellowships, accelerators, jobs">
  {#snippet actions()}
    {#if view === 'list'}
      <Button size="sm" onclick={openIntake}>Add opportunity</Button>
    {:else}
      <Button size="sm" variant="ghost" onclick={() => { view = 'list'; }}>← Back</Button>
    {/if}
  {/snippet}
</TopBar>

<!-- ── Content ────────────────────────────────────────────────────────────── -->

<div class="flex-1 overflow-auto p-6">

  <!-- LIST VIEW -->
  {#if view === 'list'}
    {#if loadingList}
      <p class="text-sm text-muted-foreground">Loading…</p>
    {:else if loadError}
      <Card>
        <h2 class="text-base font-semibold">Could not reach the daemon</h2>
        <p class="mt-2 text-sm text-muted-foreground">{loadError}</p>
        <div class="mt-4">
          <Button variant="secondary" size="sm" onclick={loadOpportunities}>Try again</Button>
        </div>
      </Card>
    {:else if activeOpps.length === 0}
      <EmptyState
        title="Find an opportunity and paste it here"
        description="Arpli will parse it, understand the deadline and requirements, and surface which parts of your profile fit."
      >
        {#snippet actions()}
          <Button onclick={openIntake}>Add opportunity</Button>
        {/snippet}
      </EmptyState>
    {:else}
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each activeOpps as opp (opp.id)}
          <Card padded={false} class="flex flex-col gap-0 overflow-hidden">
            <div class="flex-1 p-5">
              <div class="flex items-start justify-between gap-2">
                <span class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {typeLabel(opp.type)}
                </span>
                {#if opp.deadline}
                  <span class="text-xs text-muted-foreground">Due {opp.deadline}</span>
                {/if}
              </div>
              <h3 class="mt-3 text-sm font-semibold leading-snug">{opp.title}</h3>
              {#if opp.organization}
                <p class="mt-1 text-sm text-muted-foreground">{opp.organization}</p>
              {/if}
              {#if opp.description}
                <p class="mt-2 line-clamp-3 text-xs text-muted-foreground">{opp.description}</p>
              {/if}
            </div>
            <div class="flex items-center gap-2 border-t px-5 py-3">
              {#if opp.url}
                <a
                  href={opp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-xs text-primary hover:underline"
                >
                  View ↗
                </a>
              {/if}
              <div class="ml-auto flex gap-2">
                <Button
                  size="sm"
                  onclick={() => startDrafting(opp.id)}
                  disabled={startingDraftId === opp.id}
                >{startingDraftId === opp.id ? 'Opening…' : 'Draft answers'}</Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onclick={() => archiveOpportunity(opp.id)}
                >Archive</Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onclick={() => deleteOpportunity(opp.id)}
                >Delete</Button>
              </div>
            </div>
          </Card>
        {/each}
      </div>
    {/if}

  <!-- INTAKE VIEW -->
  {:else}

    <!-- Step 1: input -->
    {#if intakeStep === 'input'}
      <div class="mx-auto max-w-2xl">
        <Card>
          <h2 class="text-base font-semibold">Add an opportunity</h2>
          <p class="mt-1 text-sm text-muted-foreground">
            Paste the opportunity description, enter its URL, or upload a PDF. Arpli will
            extract the key details.
          </p>

          <!-- tabs -->
          <div class="mt-5 flex gap-2 border-b">
            {#each ['text', 'url', 'pdf'] as mode}
              <button
                class="px-3 pb-2 text-sm font-medium transition-colors
                  {inputMode === mode
                    ? 'border-b-2 border-primary text-foreground'
                    : 'text-muted-foreground hover:text-foreground'}"
                onclick={() => { inputMode = mode as InputMode; }}
              >
                {mode === 'text' ? 'Paste text' : mode === 'url' ? 'URL' : 'PDF'}
              </button>
            {/each}
          </div>

          <!-- input area -->
          <div class="mt-4">
            {#if inputMode === 'text'}
              <Textarea
                bind:value={textInput}
                rows={10}
                placeholder="Paste the opportunity listing here…"
              />
            {:else if inputMode === 'url'}
              <Input
                type="url"
                bind:value={urlInput}
                placeholder="https://example.org/fellowship-2026"
              />
              <p class="mt-2 text-xs text-muted-foreground">
                Arpli will fetch the page and extract the opportunity details.
              </p>
            {:else}
              <label
                class="flex cursor-pointer flex-col items-center justify-center rounded-md
                  border-2 border-dashed border-border py-10 text-sm text-muted-foreground
                  transition hover:border-ring"
              >
                <input
                  type="file"
                  accept=".pdf"
                  class="sr-only"
                  onchange={handlePdfFile}
                />
                {#if pdfFileName}
                  <span class="font-medium text-foreground">{pdfFileName}</span>
                  <span class="mt-1 text-xs">Click to change</span>
                {:else}
                  <span>Click to upload a PDF</span>
                {/if}
              </label>
            {/if}
          </div>

          {#if parseError}
            <p class="mt-3 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{parseError}</p>
          {/if}

          <div class="mt-5 flex justify-end gap-2">
            <Button variant="secondary" onclick={() => { view = 'list'; }}>Cancel</Button>
            <Button
              onclick={parse}
              disabled={parsing || !parseInputReady()}
            >
              {parsing ? 'Parsing…' : 'Parse with AI'}
            </Button>
          </div>
        </Card>
      </div>

    <!-- Step 2: preview + edit -->
    {:else}
      <div class="mx-auto max-w-2xl space-y-4">
        <Card>
          <h2 class="text-base font-semibold">Review and edit</h2>
          <p class="mt-1 text-sm text-muted-foreground">
            Arpli extracted the fields below. Edit anything before saving.
          </p>
        </Card>

        <!-- core fields -->
        <Card>
          <h3 class="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Core fields
          </h3>

          <div class="space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium" for="draft-title">Title *</label>
              <Input id="draft-title" bind:value={draftTitle} placeholder="e.g. Thiel Fellowship 2026" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium" for="draft-type">Type</label>
                <select
                  id="draft-type"
                  bind:value={draftType}
                  class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm
                    focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
                >
                  {#each OPPORTUNITY_TYPES as t}
                    <option value={t}>{typeLabel(t)}</option>
                  {/each}
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium" for="draft-deadline">Deadline</label>
                <Input id="draft-deadline" bind:value={draftDeadline} placeholder="e.g. 2026-03-15" />
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium" for="draft-org">Organization</label>
              <Input id="draft-org" bind:value={draftOrganization} placeholder="e.g. Thiel Foundation" />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium" for="draft-url">URL</label>
              <Input type="url" id="draft-url" bind:value={draftUrl} placeholder="https://…" />
            </div>
          </div>
        </Card>

        <!-- description + eligibility -->
        <Card>
          <h3 class="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Details
          </h3>

          <div class="space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium" for="draft-desc">Description</label>
              <Textarea id="draft-desc" bind:value={draftDescription} rows={5} />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium" for="draft-elig">Eligibility</label>
              <Textarea id="draft-elig" bind:value={draftEligibility} rows={3}
                placeholder="Who can apply…" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium" for="draft-tags">
                Tags <span class="text-muted-foreground font-normal">(comma-separated)</span>
              </label>
              <Input id="draft-tags" bind:value={draftTagsRaw} placeholder="tech, undergrad, STEM" />
            </div>
          </div>
        </Card>

        <!-- questions -->
        <Card>
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Application questions
            </h3>
            <Button size="sm" variant="secondary" onclick={addQuestion}>+ Add</Button>
          </div>

          {#if draftQuestions.length === 0}
            <p class="mt-3 text-sm text-muted-foreground">No questions extracted. Add them manually.</p>
          {:else}
            <div class="mt-4 space-y-3">
              {#each draftQuestions as q, i (q.id)}
                <div class="rounded-md border border-border p-3">
                  <div class="flex items-start gap-2">
                    <span class="mt-0.5 text-xs font-medium text-muted-foreground w-5 shrink-0">
                      {i + 1}.
                    </span>
                    <div class="flex-1 space-y-2">
                      <Textarea
                        rows={2}
                        value={q.text}
                        placeholder="Question text…"
                        oninput={(e) => updateQuestion(i, 'text', (e.target as HTMLTextAreaElement).value)}
                      />
                      <div class="flex items-center gap-2">
                        <label class="text-xs text-muted-foreground" for={`q-wl-${q.id}`}>
                          Word limit:
                        </label>
                        <input
                          id={`q-wl-${q.id}`}
                          type="number"
                          min="0"
                          class="w-24 rounded border border-border bg-background px-2 py-1 text-xs
                            focus:outline-none focus:ring-1 focus:ring-ring"
                          value={q.wordLimit ?? ''}
                          oninput={(e) => updateQuestion(i, 'wordLimit', (e.target as HTMLInputElement).value)}
                        />
                      </div>
                    </div>
                    <button
                      class="mt-0.5 text-muted-foreground hover:text-foreground text-sm"
                      aria-label="Remove question"
                      onclick={() => removeQuestion(i)}
                    >✕</button>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </Card>

        <!-- save bar -->
        {#if saveError}
          <div class="rounded-md bg-danger/10 px-4 py-3 text-sm text-danger">{saveError}</div>
        {/if}

        <div class="flex justify-between gap-2 pb-6">
          <Button variant="ghost" onclick={() => { intakeStep = 'input'; }}>← Back</Button>
          <div class="flex gap-2">
            <Button variant="secondary" onclick={() => { view = 'list'; }}>Cancel</Button>
            <Button
              onclick={save}
              disabled={saving || !draftTitle.trim()}
            >
              {saving ? 'Saving…' : 'Save opportunity'}
            </Button>
          </div>
        </div>
      </div>
    {/if}

  {/if}
</div>
