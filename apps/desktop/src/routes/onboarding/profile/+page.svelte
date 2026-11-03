<!--
  Onboarding step 3: start the profile.
  Creates the profile (one per Mac) and saves what the person gives: pasted
  CV or LinkedIn text is read into roles, schools and achievements; their own
  words become the bio. Skipping still creates the profile, so the app never
  loops back here.
-->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import * as ToggleGroup from '$lib/components/ui/toggle-group';
  import { Spinner } from '$lib/components/ui/indicators';
  import MicButton from '$lib/components/voice/MicButton.svelte';
  import { fade, fly } from '$lib/motion';
  import { onboarding } from '$lib/stores/onboarding';
  import { voiceSettings } from '$lib/voice/settings';
  import { profileApi, profileImportApi, type ImportApplyResult } from '$lib/ipc/client';
  import type { Profile, ProfileMode } from '@arpli/shared';
  import ArrowLeftIcon from 'phosphor-svelte/lib/ArrowLeftIcon';
  import ChatCircleTextIcon from 'phosphor-svelte/lib/ChatCircleTextIcon';
  import FileTextIcon from 'phosphor-svelte/lib/FileTextIcon';

  type Step = 'choose' | 'paste' | 'talk' | 'added';

  const MODES: { value: ProfileMode; label: string }[] = [
    { value: 'student', label: 'Student' },
    { value: 'founder', label: 'Founder' },
    { value: 'researcher', label: 'Researcher' },
    { value: 'professional', label: 'Working' },
  ];

  let mode = $state<ProfileMode | null>(null);
  let step = $state<Step>('choose');
  let resumeText = $state('');
  let bio = $state('');
  let busy = $state<string | null>(null);
  let error = $state<string | null>(null);
  let added = $state<ImportApplyResult | null>(null);
  let warnings = $state<string[]>([]);

  const choices = [
    {
      step: 'paste' as const,
      icon: FileTextIcon,
      title: 'Paste your CV or LinkedIn profile',
      desc: 'Copy the text from a PDF, a Word file or your LinkedIn page and paste it here.',
    },
    {
      step: 'talk' as const,
      icon: ChatCircleTextIcon,
      title: 'Tell it in your own words',
      desc: 'A few sentences about where you are, what you have done and what you are going for.',
    },
  ];

  function setMode(value: string) {
    const match = MODES.find((m) => m.value === value);
    if (match) mode = match.value;
  }

  function chooseOnKey(event: KeyboardEvent, next: Step) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      step = next;
    }
  }

  /** One profile per Mac: reuse it if it exists, otherwise create it. */
  async function ensureProfile(withMode: ProfileMode, withBio?: string): Promise<Profile> {
    const existing = await profileApi.get();
    if (existing) {
      const patch: Partial<Profile> = { mode: withMode };
      if (withBio !== undefined) patch.bio = withBio;
      return profileApi.update(existing.id, patch);
    }
    return profileApi.create({ mode: withMode, bio: withBio ?? null });
  }

  function needMode(): ProfileMode | null {
    if (!mode) {
      error = 'Pick the one closest to you first.';
      return null;
    }
    return mode;
  }

  async function submitResume() {
    const chosen = needMode();
    if (!chosen) return;
    if (!resumeText.trim()) {
      error = 'Paste your CV or profile text first.';
      return;
    }
    busy = 'resume';
    error = null;
    try {
      const profile = await ensureProfile(chosen);
      const preview = await profileImportApi.importText(resumeText);
      added = await profileImportApi.applyPreview(profile.id, preview, { updateBio: true });
      warnings = preview.warnings ?? [];
      onboarding.patch({ profileSeed: 'resume' });
      step = 'added';
    } catch (e) {
      error = `That didn't save. Your text is still here, so you can try again. (${
        e instanceof Error ? e.message : String(e)
      })`;
    } finally {
      busy = null;
    }
  }

  async function submitBio() {
    const chosen = needMode();
    if (!chosen) return;
    if (!bio.trim()) {
      error = 'Write a few sentences first.';
      return;
    }
    busy = 'bio';
    error = null;
    try {
      await ensureProfile(chosen, bio.trim());
      onboarding.patch({ profileSeed: 'conversation' });
      await goto('/onboarding/done');
    } catch (e) {
      error = `That didn't save. Your words are still here, so you can try again. (${
        e instanceof Error ? e.message : String(e)
      })`;
    } finally {
      busy = null;
    }
  }

  async function skip() {
    busy = 'skip';
    error = null;
    try {
      await ensureProfile(mode ?? 'professional');
      onboarding.patch({ profileSeed: 'skipped' });
      await goto('/onboarding/done');
    } catch (e) {
      error = `Arpli's engine isn't answering. (${e instanceof Error ? e.message : String(e)})`;
    } finally {
      busy = null;
    }
  }

  function count(list: unknown[] | undefined, one: string, many: string): string | null {
    const n = list?.length ?? 0;
    return n === 0 ? null : `${n} ${n === 1 ? one : many}`;
  }

  const addedSummary = $derived(
    added
      ? [
          count(added.workAdded, 'role', 'roles'),
          count(added.educationAdded, 'school', 'schools'),
          count(added.projectsAdded, 'project', 'projects'),
          count(added.accomplishmentsAdded, 'achievement', 'achievements'),
          added.bioUpdated ? 'a short bio' : null,
        ].filter((part): part is string => part !== null)
      : [],
  );
</script>

<div class="flex flex-col gap-6" in:fly={{ tier: 'moderate' }}>
  <div class="flex flex-col gap-2 text-center">
    <p class="type-caption text-muted-foreground">Step 3 of 4</p>
    <h1 class="type-display">Start your profile</h1>
    <p class="type-body text-muted-foreground">
      This is what Arpli draws on when you apply. Everything stays on this Mac.
    </p>
  </div>

  {#if step !== 'added'}
    <div class="flex flex-col gap-1.5">
      <Label id="mode-label">What best describes you right now?</Label>
      <ToggleGroup.Root
        type="single"
        value={mode ?? ''}
        onValueChange={setMode}
        aria-labelledby="mode-label"
      >
        {#each MODES as m (m.value)}
          <ToggleGroup.Item value={m.value}>{m.label}</ToggleGroup.Item>
        {/each}
      </ToggleGroup.Root>
    </div>
  {/if}

  {#if step === 'choose'}
    <div class="flex flex-col gap-6" in:fly={{ tier: 'moderate' }}>
      <div class="flex flex-col gap-3">
        {#each choices as choice (choice.step)}
          {@const Icon = choice.icon}
          <Card.Root
            interactive
            role="button"
            tabindex={0}
            class="flex-row items-start"
            onclick={() => (step = choice.step)}
            onkeydown={(event) => chooseOnKey(event, choice.step)}
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

      <Button
        variant="underline"
        size="sm"
        class="self-center"
        loading={busy === 'skip'}
        disabled={busy !== null}
        onclick={skip}
      >
        Skip for now. I'll add to my profile later.
      </Button>
    </div>
  {:else if step === 'paste'}
    <div class="flex flex-col gap-4" in:fly={{ tier: 'moderate' }}>
      <Button variant="ghost" size="sm" class="self-start" onclick={() => (step = 'choose')}>
        {#snippet leadingIcon()}<ArrowLeftIcon />{/snippet}
        Back
      </Button>

      <div class="flex flex-col gap-1.5">
        <Label for="resume-input">Your CV or LinkedIn profile</Label>
        <Textarea
          id="resume-input"
          bind:value={resumeText}
          autoResize
          minHeight={220}
          placeholder="Paste the whole thing. Arpli sorts it into roles, schools and achievements."
        />
      </div>

      {#if busy === 'resume'}
        <p class="type-caption flex items-center gap-2 text-muted-foreground" aria-live="polite">
          <Spinner size={14} />
          Reading your CV. This can take up to a minute.
        </p>
      {/if}

      <Button
        variant="primary"
        size="lg"
        class="w-full"
        loading={busy === 'resume'}
        disabled={busy !== null}
        onclick={submitResume}
      >
        Add to my profile
      </Button>
    </div>
  {:else if step === 'talk'}
    <div class="flex flex-col gap-4" in:fly={{ tier: 'moderate' }}>
      <Button variant="ghost" size="sm" class="self-start" onclick={() => (step = 'choose')}>
        {#snippet leadingIcon()}<ArrowLeftIcon />{/snippet}
        Back
      </Button>

      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
          <Label for="bio-input">In your own words</Label>
          {#if $voiceSettings.enabled}
            <MicButton bind:value={bio} appendToValue={true} />
          {/if}
        </div>
        <Textarea
          id="bio-input"
          bind:value={bio}
          autoResize
          minHeight={140}
          placeholder="Where you are now, something you're proud of, and what you're going for next."
        />
      </div>

      <Button
        variant="primary"
        size="lg"
        class="w-full"
        loading={busy === 'bio'}
        disabled={busy !== null}
        onclick={submitBio}
      >
        Save and continue
      </Button>
    </div>
  {:else}
    <div class="flex flex-col gap-4" in:fly={{ tier: 'moderate' }}>
      <Card.Root>
        <Card.Header>
          <Card.Title class="type-body">Added to your profile</Card.Title>
          <Card.Description>
            {#if addedSummary.length > 0}
              {addedSummary.join(', ')}. You can check and edit everything on your Profile page.
            {:else}
              Nothing could be picked out of that text. You can add things by hand on your Profile
              page.
            {/if}
          </Card.Description>
        </Card.Header>
        {#if warnings.length > 0}
          <Card.Content class="pt-0">
            <ul class="type-caption flex flex-col gap-1 text-muted-foreground">
              {#each warnings as warning (warning)}
                <li>{warning}</li>
              {/each}
            </ul>
          </Card.Content>
        {/if}
      </Card.Root>
      <Button variant="primary" size="lg" class="w-full" onclick={() => goto('/onboarding/done')}>
        Continue
      </Button>
    </div>
  {/if}

  {#if error}
    <p class="type-caption text-danger" role="alert" transition:fade={{ tier: 'fast' }}>
      {error}
    </p>
  {/if}
</div>
