<script lang="ts">
  import { onMount } from 'svelte';
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
  import * as Tabs from '$lib/components/ui/tabs';
  import { Textarea } from '$lib/components/ui/textarea';
  import { fade, fly } from '$lib/motion';
  import ArchiveIcon from 'phosphor-svelte/lib/ArchiveIcon';
  import ArrowLeftIcon from 'phosphor-svelte/lib/ArrowLeftIcon';
  import ArrowSquareOutIcon from 'phosphor-svelte/lib/ArrowSquareOutIcon';
  import CalendarBlankIcon from 'phosphor-svelte/lib/CalendarBlankIcon';
  import FilePdfIcon from 'phosphor-svelte/lib/FilePdfIcon';
  import PencilSimpleIcon from 'phosphor-svelte/lib/PencilSimpleIcon';
  import PlusIcon from 'phosphor-svelte/lib/PlusIcon';
  import SparkleIcon from 'phosphor-svelte/lib/SparkleIcon';
  import TargetIcon from 'phosphor-svelte/lib/TargetIcon';
  import TrashIcon from 'phosphor-svelte/lib/TrashIcon';
  import XIcon from 'phosphor-svelte/lib/XIcon';
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

  const INPUT_MODES: { value: InputMode; label: string }[] = [
    { value: 'text', label: 'Paste text' },
    { value: 'url', label: 'URL' },
    { value: 'pdf', label: 'PDF' },
  ];

  const typeItems = $derived(OPPORTUNITY_TYPES.map((t) => ({ value: t, label: typeLabel(t) })));
</script>

<TopBar title="Opportunities" subtitle="Scholarships, grants, fellowships, accelerators, jobs">
  {#snippet actions()}
    {#if view === 'list'}
      <Button size="sm" variant="primary" onclick={openIntake}>
        {#snippet leadingIcon()}<PlusIcon />{/snippet}
        Add opportunity
      </Button>
    {:else}
      <Button size="sm" variant="ghost" onclick={() => { view = 'list'; }}>
        {#snippet leadingIcon()}<ArrowLeftIcon />{/snippet}
        Back
      </Button>
    {/if}
  {/snippet}
</TopBar>

<ScreenBody>
  <!-- LIST VIEW -->
  {#if view === 'list'}
    {#if loadingList}
      <LoadingState recipe="card-grid" count={3} label="Loading…" />
    {:else if loadError}
      {#snippet errorMessage()}
        Could not reach the daemon: {loadError}
      {/snippet}
      <ErrorState message={errorMessage} retryLabel="Try again" onRetry={loadOpportunities} />
    {:else if activeOpps.length === 0}
      <div in:fade>
        <EmptyState
          title="Find an opportunity and paste it here"
          description="Arpli will parse it, understand the deadline and requirements, and surface which parts of your profile fit."
          icon={TargetIcon}
        >
          {#snippet actions()}
            <Button variant="primary" onclick={openIntake}>
              {#snippet leadingIcon()}<PlusIcon />{/snippet}
              Add opportunity
            </Button>
          {/snippet}
        </EmptyState>
      </div>
    {:else}
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each activeOpps as opp (opp.id)}
          <div class="flex" in:fly={{ tier: 'fast' }} out:fade={{ tier: 'fast' }}>
            <Card.Root class="flex-1">
              <Card.Header class="flex flex-col gap-3">
                <div class="flex items-start justify-between gap-2">
                  <Badge size="compact">{typeLabel(opp.type)}</Badge>
                  {#if opp.deadline}
                    <Badge size="compact" variant="dot">
                      {#snippet leadingIcon()}<CalendarBlankIcon />{/snippet}
                      Due {opp.deadline}
                    </Badge>
                  {/if}
                </div>
                <div class="flex flex-col gap-1">
                  <Card.Title>{opp.title}</Card.Title>
                  {#if opp.organization}
                    <Card.Description>{opp.organization}</Card.Description>
                  {/if}
                </div>
              </Card.Header>
              <Card.Content class="flex-1">
                {#if opp.description}
                  <p class="type-caption line-clamp-3 text-muted-foreground">{opp.description}</p>
                {/if}
              </Card.Content>
              <Card.Footer class="flex flex-wrap items-center gap-2 border-t border-border">
                {#if opp.url}
                  <Button
                    size="sm"
                    variant="link"
                    href={opp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                    {#snippet trailingIcon()}<ArrowSquareOutIcon />{/snippet}
                  </Button>
                {/if}
                <div class="ml-auto flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onclick={() => startDrafting(opp.id)}
                    disabled={startingDraftId === opp.id}
                    loading={startingDraftId === opp.id}
                  >
                    {#snippet leadingIcon()}<PencilSimpleIcon />{/snippet}
                    {startingDraftId === opp.id ? 'Opening…' : 'Draft answers'}
                  </Button>
                  <Button size="sm" variant="ghost" onclick={() => archiveOpportunity(opp.id)}>
                    {#snippet leadingIcon()}<ArchiveIcon />{/snippet}
                    Archive
                  </Button>
                  <Button size="sm" variant="ghost" onclick={() => deleteOpportunity(opp.id)}>
                    {#snippet leadingIcon()}<TrashIcon />{/snippet}
                    Delete
                  </Button>
                </div>
              </Card.Footer>
            </Card.Root>
          </div>
        {/each}
      </div>
    {/if}

  <!-- INTAKE VIEW -->
  {:else}
    <!-- Step 1: input -->
    {#if intakeStep === 'input'}
      <div class="mx-auto max-w-2xl" in:fly={{ tier: 'moderate' }}>
        <Card.Root>
          <Card.Header>
            <Card.Title>Add an opportunity</Card.Title>
            <Card.Description>
              Paste the opportunity description, enter its URL, or upload a PDF. Arpli will
              extract the key details.
            </Card.Description>
          </Card.Header>

          <Card.Content class="flex flex-col gap-4">
            <Tabs.Root
              variant="underline"
              bind:value={() => inputMode, (v) => { inputMode = v as InputMode; }}
            >
              <Tabs.List>
                {#each INPUT_MODES as mode (mode.value)}
                  <Tabs.Trigger value={mode.value}>{mode.label}</Tabs.Trigger>
                {/each}
              </Tabs.List>
            </Tabs.Root>

            {#key inputMode}
              <div in:fade={{ tier: 'fast' }}>
                {#if inputMode === 'text'}
                  <Textarea
                    bind:value={textInput}
                    rows={10}
                    minHeight={200}
                    placeholder="Paste the opportunity listing here…"
                    aria-label="Opportunity text"
                  />
                {:else if inputMode === 'url'}
                  <Input
                    type="url"
                    bind:value={urlInput}
                    placeholder="https://example.org/fellowship-2026"
                    aria-label="Opportunity URL"
                    message="Arpli will fetch the page and extract the opportunity details."
                  />
                {:else}
                  <label
                    class="type-body flex cursor-pointer flex-col items-center justify-center gap-2 rounded-(--radius-large)
                      border-2 border-dashed border-border py-10 text-muted-foreground
                      transition-colors hover:border-ring hover:text-foreground"
                  >
                    <input type="file" accept=".pdf" class="sr-only" onchange={handlePdfFile} />
                    <FilePdfIcon class="size-6" aria-hidden="true" />
                    {#if pdfFileName}
                      <span class="font-medium text-foreground">{pdfFileName}</span>
                      <span class="type-caption">Click to change</span>
                    {:else}
                      <span>Click to upload a PDF</span>
                    {/if}
                  </label>
                {/if}
              </div>
            {/key}

            {#if parseError}
              <p
                class="type-body rounded-(--radius-medium) bg-danger/10 px-3 py-2 text-danger"
                role="alert"
                transition:fade={{ tier: 'fast' }}
              >
                {parseError}
              </p>
            {/if}
          </Card.Content>

          <Card.Footer class="flex justify-end gap-2">
            <Button variant="secondary" onclick={() => { view = 'list'; }}>Cancel</Button>
            <Button
              variant="primary"
              onclick={parse}
              disabled={parsing || !parseInputReady()}
              loading={parsing}
            >
              {#snippet leadingIcon()}<SparkleIcon />{/snippet}
              {parsing ? 'Parsing…' : 'Parse with AI'}
            </Button>
          </Card.Footer>
        </Card.Root>
      </div>

    <!-- Step 2: preview + edit -->
    {:else}
      <div class="mx-auto flex max-w-2xl flex-col gap-4" in:fly={{ tier: 'moderate' }}>
        <Card.Root>
          <Card.Header>
            <Card.Title>Review and edit</Card.Title>
            <Card.Description>
              Arpli extracted the fields below. Edit anything before saving.
            </Card.Description>
          </Card.Header>
        </Card.Root>

        <!-- core fields -->
        <Card.Root>
          <Card.Header>
            <Card.Title>Core fields</Card.Title>
          </Card.Header>
          <Card.Content class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <Label for="draft-title">Title *</Label>
              <Input id="draft-title" bind:value={draftTitle} placeholder="e.g. Thiel Fellowship 2026" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <Label for="draft-type">Type</Label>
                <Select.Root
                  value={draftType}
                  items={typeItems}
                  onchange={(v) => { draftType = v as OpportunityType; }}
                >
                  <Select.Trigger id="draft-type">
                    <span class="truncate">{typeLabel(draftType)}</span>
                  </Select.Trigger>
                  <Select.Content portal>
                    {#each typeItems as item (item.value)}
                      <Select.Item value={item.value} label={item.label}>{item.label}</Select.Item>
                    {/each}
                  </Select.Content>
                </Select.Root>
              </div>
              <div class="flex flex-col gap-1.5">
                <Label for="draft-deadline">Deadline</Label>
                <Input id="draft-deadline" bind:value={draftDeadline} placeholder="e.g. 2026-03-15" />
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <Label for="draft-org">Organization</Label>
              <Input id="draft-org" bind:value={draftOrganization} placeholder="e.g. Thiel Foundation" />
            </div>

            <div class="flex flex-col gap-1.5">
              <Label for="draft-url">URL</Label>
              <Input type="url" id="draft-url" bind:value={draftUrl} placeholder="https://…" />
            </div>
          </Card.Content>
        </Card.Root>

        <!-- description + eligibility -->
        <Card.Root>
          <Card.Header>
            <Card.Title>Details</Card.Title>
          </Card.Header>
          <Card.Content class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <Label for="draft-desc">Description</Label>
              <Textarea id="draft-desc" bind:value={draftDescription} rows={5} minHeight={120} autoResize />
            </div>
            <div class="flex flex-col gap-1.5">
              <Label for="draft-elig">Eligibility</Label>
              <Textarea
                id="draft-elig"
                bind:value={draftEligibility}
                rows={3}
                autoResize
                placeholder="Who can apply…"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <Label for="draft-tags">
                Tags <span class="font-normal">(comma-separated)</span>
              </Label>
              <Input id="draft-tags" bind:value={draftTagsRaw} placeholder="tech, undergrad, STEM" />
            </div>
          </Card.Content>
        </Card.Root>

        <!-- questions -->
        <Card.Root>
          <Card.Header>
            <Card.Title>Application questions</Card.Title>
            <Card.Action>
              <Button size="sm" variant="secondary" onclick={addQuestion}>
                {#snippet leadingIcon()}<PlusIcon />{/snippet}
                Add
              </Button>
            </Card.Action>
          </Card.Header>

          <Card.Content>
            {#if draftQuestions.length === 0}
              <p class="type-body text-muted-foreground">No questions extracted. Add them manually.</p>
            {:else}
              <div class="flex flex-col gap-3">
                {#each draftQuestions as q, i (q.id)}
                  <div
                    class="rounded-(--radius-medium) border border-border p-3"
                    in:fly={{ tier: 'fast' }}
                    out:fade={{ tier: 'fast' }}
                  >
                    <div class="flex items-start gap-2">
                      <span class="type-caption mt-2 w-5 shrink-0 font-medium text-muted-foreground">
                        {i + 1}.
                      </span>
                      <div class="flex flex-1 flex-col gap-2">
                        <Textarea
                          rows={2}
                          minHeight={56}
                          autoResize
                          value={q.text}
                          placeholder="Question text…"
                          aria-label={`Question ${i + 1}`}
                          oninput={(e) => updateQuestion(i, 'text', (e.target as HTMLTextAreaElement).value)}
                        />
                        <div class="flex items-center gap-2">
                          <Label for={`q-wl-${q.id}`}>Word limit:</Label>
                          <Input
                            id={`q-wl-${q.id}`}
                            type="number"
                            min="0"
                            class="w-24"
                            value={q.wordLimit ?? ''}
                            oninput={(e) => updateQuestion(i, 'wordLimit', (e.target as HTMLInputElement).value)}
                          />
                        </div>
                      </div>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label="Remove question"
                        onclick={() => removeQuestion(i)}
                      >
                        <XIcon />
                      </Button>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </Card.Content>
        </Card.Root>

        <!-- save bar -->
        {#if saveError}
          <div
            class="type-body rounded-(--radius-medium) bg-danger/10 px-4 py-3 text-danger"
            role="alert"
            transition:fade={{ tier: 'fast' }}
          >
            {saveError}
          </div>
        {/if}

        <div class="flex justify-between gap-2 pb-6">
          <Button variant="ghost" onclick={() => { intakeStep = 'input'; }}>
            {#snippet leadingIcon()}<ArrowLeftIcon />{/snippet}
            Back
          </Button>
          <div class="flex gap-2">
            <Button variant="secondary" onclick={() => { view = 'list'; }}>Cancel</Button>
            <Button
              variant="primary"
              onclick={save}
              disabled={saving || !draftTitle.trim()}
              loading={saving}
            >
              {saving ? 'Saving…' : 'Save opportunity'}
            </Button>
          </div>
        </div>
      </div>
    {/if}
  {/if}
</ScreenBody>
