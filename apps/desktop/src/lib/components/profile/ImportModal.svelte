<!--
  ImportModal — document import flow for the Profile page.

  Steps:
    idle    → user sees drop zone and URL input
    parsing → file/URL is being processed by the daemon
    preview → preview returned; user reviews and confirms
    applying → writing to DB
    done    → success banner before close

  All daemon calls go through profileImportApi; the component is
  self-contained and emits an `imported` event when the apply succeeds.
-->
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { Label } from '$lib/components/ui/label';
  import { Badge } from '$lib/components/ui/badge';
  import * as Dialog from '$lib/components/ui/dialog';
  import { cn } from '$lib/utils';
  import { fade, fly } from '$lib/motion';
  import FileArrowUpIcon from 'phosphor-svelte/lib/FileArrowUpIcon';
  import UploadSimpleIcon from 'phosphor-svelte/lib/UploadSimpleIcon';
  import CircleNotchIcon from 'phosphor-svelte/lib/CircleNotchIcon';
  import CheckCircleIcon from 'phosphor-svelte/lib/CheckCircleIcon';
  import WarningIcon from 'phosphor-svelte/lib/WarningIcon';
  import { profileImportApi } from '$lib/ipc/client';
  import type { ImportPreview } from '$lib/ipc/client';

  type Step = 'idle' | 'parsing' | 'preview' | 'applying' | 'done';

  let {
    profileId,
    onimported,
    onclose,
  }: {
    profileId: string;
    onimported: () => void;
    onclose: () => void;
  } = $props();

  let step = $state<Step>('idle');
  let error = $state<string | null>(null);
  let preview = $state<ImportPreview | null>(null);
  let updateBio = $state(true);
  let isDragOver = $state(false);
  let urlInput = $state('');
  let applyResult = $state<{ workAdded: unknown[]; educationAdded: unknown[] } | null>(null);
  let fileInput = $state<HTMLInputElement | null>(null);

  // The parent mounts this component only while the modal should be shown,
  // so the dialog is always open; any dismissal is forwarded to `onclose`.
  let open = $state(true);

  function handleOpenChange(next: boolean) {
    open = next;
    if (!next) onclose();
  }

  // ── File drop / pick ──────────────────────────────────────────────────────

  async function handleFile(file: File) {
    step = 'parsing';
    error = null;
    preview = null;
    try {
      preview = await profileImportApi.importFile(file);
      step = 'preview';
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
      step = 'idle';
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    isDragOver = false;
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    isDragOver = true;
  }

  function onDragLeave() {
    isDragOver = false;
  }

  function onFileInput(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (file) handleFile(file);
    input.value = '';
  }

  // ── URL import ────────────────────────────────────────────────────────────

  async function handleUrl() {
    const url = urlInput.trim();
    if (!url) return;
    step = 'parsing';
    error = null;
    preview = null;
    try {
      preview = await profileImportApi.importUrl(url);
      step = 'preview';
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
      step = 'idle';
    }
  }

  // ── Confirm ───────────────────────────────────────────────────────────────

  async function applyPreview() {
    if (!preview) return;
    step = 'applying';
    error = null;
    try {
      const result = await profileImportApi.applyPreview(profileId, preview, { updateBio });
      applyResult = result;
      step = 'done';
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
      step = 'preview';
    }
  }

  function reset() {
    step = 'idle';
    error = null;
    preview = null;
    urlInput = '';
    applyResult = null;
    updateBio = true;
  }

  // Confidence → human label
  function confidenceLabel(c: number): string {
    if (c >= 0.8) return 'High confidence';
    if (c >= 0.5) return 'Medium confidence';
    return 'Low confidence — review carefully';
  }
  function confidenceColor(c: number): 'green' | 'amber' | 'red' {
    if (c >= 0.8) return 'green';
    if (c >= 0.5) return 'amber';
    return 'red';
  }
</script>

<Dialog.Root bind:open onOpenChange={handleOpenChange}>
  <Dialog.Content size="lg">
    <Dialog.Header>
      <Dialog.Title>Import profile</Dialog.Title>
    </Dialog.Header>

    {#if step === 'idle' || step === 'parsing'}
      <div class="flex flex-col gap-4" in:fade={{ tier: 'fast' }}>
        <!-- Drop zone -->
        <div
          class={cn(
            'flex flex-col items-center justify-center gap-3 rounded-(--radius-large) border-2 border-dashed px-6 py-10 text-center transition-colors',
            isDragOver ? 'border-primary bg-muted' : 'border-border hover:border-primary/50',
          )}
          ondrop={onDrop}
          ondragover={onDragOver}
          ondragleave={onDragLeave}
          role="region"
          aria-label="File drop zone"
        >
          <FileArrowUpIcon class="size-8 text-muted-foreground" aria-hidden="true" />
          <p class="type-body font-medium">Drop a file here or</p>
          <Button
            variant="primary"
            size="sm"
            disabled={step === 'parsing'}
            onclick={() => fileInput?.click()}
          >
            {#snippet leadingIcon()}<UploadSimpleIcon />{/snippet}
            Browse files
          </Button>
          <input
            bind:this={fileInput}
            type="file"
            class="sr-only"
            tabindex="-1"
            aria-hidden="true"
            accept=".pdf,.docx,.zip,.json,.txt"
            onchange={onFileInput}
            disabled={step === 'parsing'}
          />
          <p class="type-caption text-muted-foreground">
            PDF, DOCX, LinkedIn ZIP or JSON export, plain text
          </p>
        </div>

        <!-- Divider -->
        <div class="flex items-center gap-3">
          <span class="h-px flex-1 bg-border"></span>
          <span class="type-caption text-muted-foreground">or import from URL</span>
          <span class="h-px flex-1 bg-border"></span>
        </div>

        <!-- URL input -->
        <div class="flex gap-2">
          <Input
            type="url"
            class="flex-1"
            placeholder="LinkedIn profile URL (public)"
            aria-label="LinkedIn profile URL"
            bind:value={urlInput}
            disabled={step === 'parsing'}
            onkeydown={(e) => e.key === 'Enter' && handleUrl()}
          />
          <Button
            variant="secondary"
            disabled={!urlInput.trim() || step === 'parsing'}
            onclick={handleUrl}
          >
            Import
          </Button>
        </div>

        {#if step === 'parsing'}
          <p
            class="type-body flex items-center justify-center gap-2 text-muted-foreground"
            role="status"
            transition:fade={{ tier: 'fast' }}
          >
            <CircleNotchIcon class="size-4 animate-spin" aria-hidden="true" />
            Parsing… this may take a moment.
          </p>
        {/if}

        {#if error}
          <p class="type-body text-danger" role="alert" transition:fade={{ tier: 'fast' }}>
            {error}
          </p>
        {/if}
      </div>
    {:else if step === 'preview' && preview}
      <div class="flex flex-col gap-4" in:fly={{ tier: 'moderate', axis: 'x' }}>
        <!-- Confidence badge -->
        <div class="flex flex-wrap items-center gap-2">
          <Badge variant="dot" color={confidenceColor(preview.confidence)}>
            {confidenceLabel(preview.confidence)}
          </Badge>
          <span class="type-caption text-muted-foreground">source: {preview.source}</span>
        </div>

        <!-- Warnings -->
        {#if preview.warnings.length > 0}
          <ul class="flex flex-col gap-1">
            {#each preview.warnings as w, i (i)}
              <li class="type-caption flex items-start gap-1.5 text-warning-ink">
                <WarningIcon class="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                <span>{w}</span>
              </li>
            {/each}
          </ul>
        {/if}

        <!-- Bio -->
        {#if preview.bio}
          <div class="flex flex-col gap-1">
            <h3 class="type-caption font-medium text-muted-foreground">Bio</h3>
            <p class="type-body rounded-(--radius-medium) bg-muted p-3">{preview.bio}</p>
          </div>
        {/if}

        <!-- Summary counts -->
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {#each [
            { label: 'Work', count: preview.work.length },
            { label: 'Education', count: preview.education.length },
            { label: 'Projects', count: preview.projects.length },
            { label: 'Accomplishments', count: preview.accomplishments.length },
          ] as item (item.label)}
            <div class="rounded-(--radius-medium) bg-muted p-3 text-center">
              <p class="type-title">{item.count}</p>
              <p class="type-caption text-muted-foreground">{item.label}</p>
            </div>
          {/each}
        </div>

        <!-- Skills -->
        {#if preview.skills.length > 0}
          <div class="flex flex-col gap-2">
            <h3 class="type-caption font-medium text-muted-foreground">
              Skills ({preview.skills.length})
            </h3>
            <div class="flex flex-wrap gap-1">
              {#each preview.skills.slice(0, 20) as skill, i (i)}
                <Badge size="compact">{skill}</Badge>
              {/each}
              {#if preview.skills.length > 20}
                <span class="type-caption text-muted-foreground">
                  +{preview.skills.length - 20} more
                </span>
              {/if}
            </div>
          </div>
        {/if}

        <!-- Bio toggle -->
        {#if preview.bio}
          <div class="flex items-center gap-2">
            <Checkbox id="import-update-bio" bind:checked={updateBio} />
            <Label for="import-update-bio" class="type-body cursor-pointer text-foreground">
              Update profile bio from import
            </Label>
          </div>
        {/if}

        {#if error}
          <p class="type-body text-danger" role="alert" transition:fade={{ tier: 'fast' }}>
            {error}
          </p>
        {/if}
      </div>

      <Dialog.Footer>
        <Button variant="ghost" onclick={reset}>Back</Button>
        <Button variant="primary" onclick={applyPreview}>Add to profile</Button>
      </Dialog.Footer>
    {:else if step === 'applying'}
      <p
        class="type-body flex items-center justify-center gap-2 py-6 text-muted-foreground"
        role="status"
        in:fade={{ tier: 'fast' }}
      >
        <CircleNotchIcon class="size-4 animate-spin" aria-hidden="true" />
        Saving to profile…
      </p>
    {:else if step === 'done' && applyResult}
      <div class="flex flex-col items-center text-center" in:fly={{ tier: 'moderate' }}>
        <CheckCircleIcon class="size-10 text-success" weight="fill" aria-hidden="true" />
        <p class="type-title mt-3">Import complete</p>
        <p class="type-body mt-1 text-muted-foreground">
          Added {(applyResult.workAdded as unknown[]).length} work
          {(applyResult.workAdded as unknown[]).length === 1 ? 'entry' : 'entries'} and
          {(applyResult.educationAdded as unknown[]).length} education
          {(applyResult.educationAdded as unknown[]).length === 1 ? 'record' : 'records'}.
        </p>
      </div>

      <Dialog.Footer class="justify-center">
        <Button variant="secondary" onclick={reset}>Import another</Button>
        <Button
          variant="primary"
          onclick={() => {
            onimported();
            onclose();
          }}
        >
          Done
        </Button>
      </Dialog.Footer>
    {/if}
  </Dialog.Content>
</Dialog.Root>
