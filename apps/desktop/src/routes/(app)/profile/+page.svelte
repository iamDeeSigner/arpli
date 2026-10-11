<script lang="ts">
  import { onMount } from 'svelte';
  import TopBar from '$lib/components/layout/TopBar.svelte';
  import EmptyState from '$lib/components/layout/EmptyState.svelte';
  import { ErrorState, LoadingState, ScreenBody } from '$lib/components/patterns/screen';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Textarea } from '$lib/components/ui/textarea';
  import ImportModal from '$lib/components/profile/ImportModal.svelte';
  import MicButton from '$lib/components/voice/MicButton.svelte';
  import { profileApi } from '$lib/ipc/client';
  import { voiceSettings } from '$lib/voice/settings';
  import { fade } from '$lib/motion';
  import MicrophoneIcon from 'phosphor-svelte/lib/MicrophoneIcon';
  import UserCircleIcon from 'phosphor-svelte/lib/UserCircleIcon';
  import type { Profile } from '@arpli/shared';

  let profile = $state<Profile | null>(null);
  let loading = $state(true);
  let loadError = $state<string | null>(null);
  let showImport = $state(false);
  let editingBio = $state(false);
  let bioValue = $state('');

  async function loadProfile() {
    loading = true;
    loadError = null;
    try {
      profile = await profileApi.get();
    } catch (err) {
      loadError = err instanceof Error ? err.message : String(err);
    } finally {
      loading = false;
    }
  }

  onMount(loadProfile);

  function startEditBio() {
    bioValue = profile?.bio ?? '';
    editingBio = true;
  }

  async function saveBio() {
    if (!profile) return;
    try {
      await profileApi.update(profile.id, { bio: bioValue });
      profile = { ...profile, bio: bioValue };
      editingBio = false;
    } catch {
      // Leave editing open so the user can retry.
    }
  }
</script>

<TopBar title="Profile" subtitle="Your permanent, growing knowledge base">
  {#snippet actions()}
    {#if profile}
      <Button variant="secondary" size="sm" onclick={() => (showImport = true)}>
        Import document
      </Button>
      <Button variant="ghost" size="sm" onclick={loadProfile}>Refresh</Button>
    {/if}
  {/snippet}
</TopBar>

{#if showImport && profile}
  <ImportModal
    profileId={profile.id}
    onimported={loadProfile}
    onclose={() => (showImport = false)}
  />
{/if}

<ScreenBody>
  {#if loading}
    <LoadingState recipe="card-grid" count={2} label="Loading profile" />
  {:else if loadError}
    {#snippet errorMessage()}
      Could not reach the daemon: {loadError}
    {/snippet}
    <ErrorState message={errorMessage} retryLabel="Try again" onRetry={loadProfile} />
  {:else if !profile}
    <div in:fade>
      <EmptyState
        title="Your story starts here"
        description="Import a resume or LinkedIn export, or talk Arpli through your background. Everything stays on this machine."
        icon={UserCircleIcon}
      >
        {#snippet actions()}
          <Button variant="primary" href="/onboarding/profile">Import resume</Button>
          <Button variant="secondary" href="/onboarding/profile">Tell me about yourself</Button>
        {/snippet}
      </EmptyState>
    </div>
  {:else}
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2" in:fade>
      <Card.Root>
        <Card.Header>
          <Card.Title>Overview</Card.Title>
        </Card.Header>
        <Card.Content class="flex flex-col gap-4">
          <dl class="type-body grid grid-cols-[8rem_1fr] gap-y-2">
            <dt class="text-muted-foreground">Mode</dt>
            <dd>{profile.mode}</dd>
            <dt class="text-muted-foreground">Updated</dt>
            <dd>{new Date(profile.updatedAt).toLocaleDateString()}</dd>
          </dl>

          {#if editingBio}
            <div class="flex flex-col gap-2">
              <div class="relative">
                <Textarea
                  bind:value={bioValue}
                  minHeight={120}
                  autoResize
                  placeholder="Tell Arpli about your background…"
                  aria-label="Bio"
                />
                {#if $voiceSettings.enabled}
                  <div class="absolute bottom-2 right-2">
                    <MicButton bind:value={bioValue} appendToValue={true} />
                  </div>
                {/if}
              </div>
              <div class="flex gap-2">
                <Button size="sm" variant="primary" onclick={saveBio}>Save</Button>
                <Button size="sm" variant="secondary" onclick={() => (editingBio = false)}>
                  Cancel
                </Button>
              </div>
            </div>
          {:else if profile.bio}
            <p class="type-body">{profile.bio}</p>
            <div class="flex items-center gap-2">
              <Button size="sm" variant="ghost" onclick={startEditBio}>Edit bio</Button>
              {#if $voiceSettings.enabled}
                <Button size="sm" variant="ghost" onclick={startEditBio}>
                  {#snippet leadingIcon()}<MicrophoneIcon />{/snippet}
                  Dictate
                </Button>
              {/if}
            </div>
          {:else}
            <div class="flex items-center gap-2">
              <p class="type-body text-muted-foreground">No bio yet.</p>
              <Button size="sm" variant="ghost" onclick={startEditBio}>Add bio</Button>
            </div>
          {/if}
        </Card.Content>
      </Card.Root>

      <Card.Root>
        <Card.Header>
          <Card.Title>Sections</Card.Title>
          <Card.Description>
            Education, work, projects, accomplishments, and essays will land here as other
            Phase 1 features ship.
          </Card.Description>
        </Card.Header>
      </Card.Root>
    </div>
  {/if}
</ScreenBody>
