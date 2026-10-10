<!--
  Onboarding Step 3: Build Profile.
  Two paths: paste a resume / LinkedIn export, OR tell Arpli in your own words.
  On submit, POSTs to profileApi.create (Phase 2) or stores the seed locally (Phase 1).
-->
<script lang="ts">
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/Button.svelte';
  import Textarea from '$lib/components/ui/Textarea.svelte';
  import { onboarding } from '$lib/stores/onboarding';

  type Mode = 'choose' | 'paste' | 'talk';

  let mode = $state<Mode>('choose');
  let resumeText = $state('');
  let bio = $state('');
  let saving = $state(false);
  let error = $state<string | null>(null);

  async function submitResume() {
    if (!resumeText.trim()) {
      error = 'Paste your resume text above.';
      return;
    }
    saving = true;
    error = null;
    try {
      // Phase 1: store seed locally; the daemon ingestion happens in a later phase.
      onboarding.patch({ profileSeed: 'resume' });
      await goto('/onboarding/done');
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
      saving = false;
    }
  }

  async function submitBio() {
    if (!bio.trim()) {
      error = 'Tell me a little about yourself first.';
      return;
    }
    saving = true;
    error = null;
    try {
      onboarding.patch({ profileSeed: 'conversation' });
      await goto('/onboarding/done');
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
      saving = false;
    }
  }

  function skip() {
    onboarding.patch({ profileSeed: 'skipped' });
    goto('/onboarding/done');
  }
</script>

<div class="flex flex-col gap-6">
  <div class="text-center">
    <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Step 3 of 4</p>
    <h1 class="mt-2 text-2xl font-semibold tracking-tight">Build your profile</h1>
    <p class="mt-1 text-sm text-muted-foreground">
      Your profile is Arpli's knowledge base. Start by importing what you already have.
    </p>
  </div>

  {#if mode === 'choose'}
    <div class="flex flex-col gap-3">
      <button
        class="flex flex-col items-start gap-1 rounded-md border border-border bg-card p-4 text-left transition-colors hover:bg-muted"
        onclick={() => (mode = 'paste')}
      >
        <p class="font-medium">Import a resume or LinkedIn export</p>
        <p class="text-sm text-muted-foreground">
          Paste plain text from a PDF, Word doc, or LinkedIn data export.
        </p>
      </button>

      <button
        class="flex flex-col items-start gap-1 rounded-md border border-border bg-card p-4 text-left transition-colors hover:bg-muted"
        onclick={() => (mode = 'talk')}
      >
        <p class="font-medium">Tell me about yourself</p>
        <p class="text-sm text-muted-foreground">
          Write a few sentences and Arpli will structure it into a profile.
        </p>
      </button>
    </div>

    <button
      class="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
      onclick={skip}
    >
      Skip — I'll add my profile later
    </button>

  {:else if mode === 'paste'}
    <div class="flex flex-col gap-4">
      <button
        class="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors text-left"
        onclick={() => (mode = 'choose')}
      >
        ← Back
      </button>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium" for="resume-input">
          Paste your resume or LinkedIn export
        </label>
        <Textarea
          id="resume-input"
          bind:value={resumeText}
          rows={10}
          placeholder="John Smith&#10;Software Engineer&#10;&#10;Experience:&#10;..."
        />
      </div>

      {#if error}
        <p class="text-sm text-danger">{error}</p>
      {/if}

      <Button onclick={submitResume} disabled={saving} size="lg" class="w-full">
        {saving ? 'Importing…' : 'Import resume'}
      </Button>
    </div>

  {:else}
    <div class="flex flex-col gap-4">
      <button
        class="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors text-left"
        onclick={() => (mode = 'choose')}
      >
        ← Back
      </button>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium" for="bio-input">
          Tell me about yourself
        </label>
        <Textarea
          id="bio-input"
          bind:value={bio}
          rows={6}
          placeholder="I'm a second-year CS student at UBC focused on machine learning. I've interned at two startups and I'm looking for research fellowships for next summer…"
        />
        <p class="text-xs text-muted-foreground">
          Include your current situation, background, and what you're looking for.
        </p>
      </div>

      {#if error}
        <p class="text-sm text-danger">{error}</p>
      {/if}

      <Button onclick={submitBio} disabled={saving} size="lg" class="w-full">
        {saving ? 'Saving…' : 'Continue'}
      </Button>
    </div>
  {/if}
</div>
