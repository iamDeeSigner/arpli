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
  import Button from '$lib/components/ui/Button.svelte';
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
  function confidenceColor(c: number): string {
    if (c >= 0.8) return 'text-green-600 dark:text-green-400';
    if (c >= 0.5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  }
</script>

<!-- ── Backdrop ──────────────────────────────────────────────────────────── -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
  role="presentation"
  onclick={(e) => { if (e.target === e.currentTarget) onclose(); }}
>
  <!-- ── Panel ─────────────────────────────────────────────────────────── -->
  <div
    class="bg-card text-card-foreground w-full max-w-lg rounded-xl border shadow-xl"
    role="dialog"
    aria-modal="true"
    aria-label="Import profile"
  >
    <!-- Header -->
    <div class="flex items-center justify-between border-b px-6 py-4">
      <h2 class="text-base font-semibold">Import profile</h2>
      <button
        class="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
        aria-label="Close"
        onclick={onclose}
      >
        ✕
      </button>
    </div>

    <!-- Body -->
    <div class="p-6">

      {#if step === 'idle' || step === 'parsing'}

        <!-- Drop zone -->
        <div
          class={[
            'flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors',
            isDragOver
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50',
          ].join(' ')}
          ondrop={onDrop}
          ondragover={onDragOver}
          ondragleave={onDragLeave}
          role="region"
          aria-label="File drop zone"
        >
          <span class="text-3xl" aria-hidden="true">📄</span>
          <p class="text-sm font-medium">Drop a file here or</p>
          <label>
            <span class="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors">
              Browse files
            </span>
            <input
              type="file"
              class="sr-only"
              accept=".pdf,.docx,.zip,.json,.txt"
              onchange={onFileInput}
              disabled={step === 'parsing'}
            />
          </label>
          <p class="text-muted-foreground text-xs">
            PDF, DOCX, LinkedIn ZIP or JSON export, plain text
          </p>
        </div>

        <!-- Divider -->
        <div class="my-4 flex items-center gap-3">
          <span class="bg-border h-px flex-1"></span>
          <span class="text-muted-foreground text-xs">or import from URL</span>
          <span class="bg-border h-px flex-1"></span>
        </div>

        <!-- URL input -->
        <div class="flex gap-2">
          <input
            type="url"
            class="border-border bg-background placeholder:text-muted-foreground flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="LinkedIn profile URL (public)"
            bind:value={urlInput}
            disabled={step === 'parsing'}
            onkeydown={(e) => e.key === 'Enter' && handleUrl()}
          />
          <Button
            size="sm"
            variant="secondary"
            disabled={!urlInput.trim() || step === 'parsing'}
            onclick={handleUrl}
          >
            Import
          </Button>
        </div>

        {#if step === 'parsing'}
          <p class="text-muted-foreground mt-4 text-center text-sm">
            Parsing… this may take a moment.
          </p>
        {/if}

        {#if error}
          <p class="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
        {/if}

      {:else if step === 'preview' && preview}

        <!-- Confidence badge -->
        <p class={['mb-4 text-sm font-medium', confidenceColor(preview.confidence)].join(' ')}>
          {confidenceLabel(preview.confidence)}
          <span class="text-muted-foreground font-normal">
            — source: {preview.source}
          </span>
        </p>

        <!-- Warnings -->
        {#if preview.warnings.length > 0}
          <ul class="mb-4 space-y-1">
            {#each preview.warnings as w}
              <li class="text-xs text-yellow-700 dark:text-yellow-400">⚠ {w}</li>
            {/each}
          </ul>
        {/if}

        <!-- Bio -->
        {#if preview.bio}
          <div class="mb-4">
            <h3 class="text-muted-foreground mb-1 text-xs font-semibold uppercase tracking-wider">
              Bio
            </h3>
            <p class="bg-muted rounded-md p-3 text-sm leading-relaxed">{preview.bio}</p>
          </div>
        {/if}

        <!-- Summary counts -->
        <div class="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {#each [
            { label: 'Work', count: preview.work.length },
            { label: 'Education', count: preview.education.length },
            { label: 'Projects', count: preview.projects.length },
            { label: 'Accomplishments', count: preview.accomplishments.length },
          ] as item}
            <div class="bg-muted rounded-md p-3 text-center">
              <p class="text-xl font-bold">{item.count}</p>
              <p class="text-muted-foreground text-xs">{item.label}</p>
            </div>
          {/each}
        </div>

        <!-- Skills -->
        {#if preview.skills.length > 0}
          <div class="mb-4">
            <h3 class="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-wider">
              Skills ({preview.skills.length})
            </h3>
            <div class="flex flex-wrap gap-1">
              {#each preview.skills.slice(0, 20) as skill}
                <span class="bg-muted rounded px-2 py-0.5 text-xs">{skill}</span>
              {/each}
              {#if preview.skills.length > 20}
                <span class="text-muted-foreground text-xs">+{preview.skills.length - 20} more</span>
              {/if}
            </div>
          </div>
        {/if}

        <!-- Bio toggle -->
        {#if preview.bio}
          <label class="mb-5 flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" bind:checked={updateBio} class="rounded" />
            Update profile bio from import
          </label>
        {/if}

        {#if error}
          <p class="mb-3 text-sm text-red-600 dark:text-red-400">{error}</p>
        {/if}

        <div class="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onclick={reset}>Back</Button>
          <Button size="sm" onclick={applyPreview}>Add to profile</Button>
        </div>

      {:else if step === 'applying'}
        <p class="text-muted-foreground text-center text-sm">Saving to profile…</p>

      {:else if step === 'done' && applyResult}
        <div class="text-center">
          <p class="text-4xl" aria-hidden="true">✅</p>
          <p class="mt-3 font-semibold">Import complete</p>
          <p class="text-muted-foreground mt-1 text-sm">
            Added {(applyResult.workAdded as unknown[]).length} work
            {(applyResult.workAdded as unknown[]).length === 1 ? 'entry' : 'entries'} and
            {(applyResult.educationAdded as unknown[]).length} education
            {(applyResult.educationAdded as unknown[]).length === 1 ? 'record' : 'records'}.
          </p>
          <div class="mt-6 flex justify-center gap-2">
            <Button variant="secondary" size="sm" onclick={reset}>Import another</Button>
            <Button size="sm" onclick={() => { onimported(); onclose(); }}>Done</Button>
          </div>
        </div>
      {/if}

    </div>
  </div>
</div>
