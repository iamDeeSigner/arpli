<!--
  Onboarding Step 3: Build Profile.
  Two paths: paste a resume / LinkedIn export, OR tell Arpli in your own words.
  On submit, POSTs to profileApi.create (Phase 2) or stores the seed locally (Phase 1).
-->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import MicButton from '$lib/components/voice/MicButton.svelte';
  import { fade, fly } from '$lib/motion';
  import { onboarding } from '$lib/stores/onboarding';
  import { voiceSettings } from '$lib/voice/settings';
  import ArrowLeftIcon from 'phosphor-svelte/lib/ArrowLeftIcon';
  import ChatCircleTextIcon from 'phosphor-svelte/lib/ChatCircleTextIcon';
  import FileTextIcon from 'phosphor-svelte/lib/FileTextIcon';

  type Mode = 'choose' | 'paste' | 'talk';

  let mode = $state<Mode>('choose');
  let resumeText = $state('');
  let bio = $state('');
  let saving = $state(false);
  let error = $state<string | null>(null);

  const choices = [
    {
      mode: 'paste' as const,
      icon: FileTextIcon,
      title: 'Import a resume or LinkedIn export',
      desc: 'Paste plain text from a PDF, Word doc, or LinkedIn data export.',
    },
    {
      mode: 'talk' as const,
      icon: ChatCircleTextIcon,
      title: 'Tell me about yourself',
      desc: 'Write a few sentences and Arpli will structure it into a profile.',
    },
  ];

  function chooseOnKey(event: KeyboardEvent, next: Mode) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      mode = next;
    }
  }

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

<div class="flex flex-col gap-6" in:fly={{ tier: 'moderate' }}>
  <div class="flex flex-col gap-2 text-center">
    <p class="type-caption text-muted-foreground">Step 3 of 4</p>
    <h1 class="type-display">Build your profile</h1>
    <p class="type-body text-muted-foreground">
      Your profile is Arpli's knowledge base. Start by importing what you already have.
    </p>
  </div>

  {#if mode === 'choose'}
    <div class="flex flex-col gap-6" in:fly={{ tier: 'moderate' }}>
      <div class="flex flex-col gap-3">
        {#each choices as choice (choice.mode)}
          {@const Icon = choice.icon}
          <Card.Root
            interactive
            role="button"
            tabindex={0}
            class="flex-row items-start"
            onclick={() => (mode = choice.mode)}
            onkeydown={(event) => chooseOnKey(event, choice.mode)}
          >
            {#snippet media()}
              <Icon class="size-5 text-muted-foreground" aria-hidden="true" />
            {/snippet}
            <Card.Header class="flex-1 pb-4 pl-0">
              <Card.Title class="type-body">{choice.title}</Card.Title>
              <Card.Description>{choice.desc}</Card.Description>
            </Card.Header>
          </Card.Root>
        {/each}
      </div>

      <Button variant="underline" size="sm" class="self-center" onclick={skip}>
        Skip — I'll add my profile later
      </Button>
    </div>
  {:else if mode === 'paste'}
    <div class="flex flex-col gap-4" in:fly={{ tier: 'moderate' }}>
      <Button variant="ghost" size="sm" class="self-start" onclick={() => (mode = 'choose')}>
        {#snippet leadingIcon()}<ArrowLeftIcon />{/snippet}
        Back
      </Button>

      <div class="flex flex-col gap-1.5">
        <Label for="resume-input">Paste your resume or LinkedIn export</Label>
        <Textarea
          id="resume-input"
          bind:value={resumeText}
          autoResize
          minHeight={220}
          placeholder="John Smith&#10;Software Engineer&#10;&#10;Experience:&#10;..."
        />
      </div>

      {#if error}
        <p class="type-caption text-danger" role="alert" transition:fade={{ tier: 'fast' }}>
          {error}
        </p>
      {/if}

      <Button
        variant="primary"
        onclick={submitResume}
        disabled={saving}
        loading={saving}
        size="lg"
        class="w-full"
      >
        {saving ? 'Importing…' : 'Import resume'}
      </Button>
    </div>
  {:else}
    <div class="flex flex-col gap-4" in:fly={{ tier: 'moderate' }}>
      <Button variant="ghost" size="sm" class="self-start" onclick={() => (mode = 'choose')}>
        {#snippet leadingIcon()}<ArrowLeftIcon />{/snippet}
        Back
      </Button>

      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
          <Label for="bio-input">Tell me about yourself</Label>
          {#if $voiceSettings.enabled}
            <MicButton bind:value={bio} appendToValue={true} />
          {/if}
        </div>
        <Textarea
          id="bio-input"
          bind:value={bio}
          autoResize
          minHeight={140}
          placeholder="I'm a second-year CS student at UBC focused on machine learning. I've interned at two startups and I'm looking for research fellowships for next summer…"
        />
        <p class="type-caption text-muted-foreground">
          Include your current situation, background, and what you're looking for.
          {#if $voiceSettings.enabled}
            Use the mic button above to dictate.
          {/if}
        </p>
      </div>

      {#if error}
        <p class="type-caption text-danger" role="alert" transition:fade={{ tier: 'fast' }}>
          {error}
        </p>
      {/if}

      <Button
        variant="primary"
        onclick={submitBio}
        disabled={saving}
        loading={saving}
        size="lg"
        class="w-full"
      >
        {saving ? 'Saving…' : 'Continue'}
      </Button>
    </div>
  {/if}
</div>
