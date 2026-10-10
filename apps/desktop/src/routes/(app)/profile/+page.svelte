<script lang="ts">
  import { onMount } from 'svelte';
  import TopBar from '$lib/components/layout/TopBar.svelte';
  import EmptyState from '$lib/components/layout/EmptyState.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import ImportModal from '$lib/components/profile/ImportModal.svelte';
  import MicButton from '$lib/components/voice/MicButton.svelte';
  import { profileApi } from '$lib/ipc/client';
  import { voiceSettings } from '$lib/voice/settings';
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

<div class="flex-1 overflow-auto p-6">
  {#if loading}
    <p class="text-sm text-muted-foreground">Loading…</p>
  {:else if loadError}
    <Card>
      <h2 class="text-base font-semibold">Could not reach the daemon</h2>
      <p class="mt-2 text-sm text-muted-foreground">{loadError}</p>
      <div class="mt-4">
        <Button variant="secondary" size="sm" onclick={loadProfile}>Try again</Button>
      </div>
    </Card>
  {:else if !profile}
    <EmptyState
      title="Your story starts here"
      description="Import a resume or LinkedIn export, or talk Arpli through your background. Everything stays on this machine."
    >
      {#snippet actions()}
        <Button href="/onboarding/profile">Import resume</Button>
        <Button href="/onboarding/profile" variant="secondary">Tell me about yourself</Button>
      {/snippet}
    </EmptyState>
  {:else}
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <h2 class="text-base font-semibold">Overview</h2>
        <dl class="mt-4 grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
          <dt class="text-muted-foreground">Mode</dt>
          <dd>{profile.mode}</dd>
          <dt class="text-muted-foreground">Updated</dt>
          <dd>{new Date(profile.updatedAt).toLocaleDateString()}</dd>
        </dl>

        {#if editingBio}
          <div class="mt-4 flex flex-col gap-2">
            <div class="relative">
              <textarea
                class="w-full rounded-md border border-border bg-background px-3 py-2 pr-10 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                rows={5}
                bind:value={bioValue}
                placeholder="Tell Arpli about your background…"
              ></textarea>
              {#if $voiceSettings.enabled}
                <div class="absolute bottom-2 right-2">
                  <MicButton bind:value={bioValue} appendToValue={true} />
                </div>
              {/if}
            </div>
            <div class="flex gap-2">
              <Button size="sm" onclick={saveBio}>Save</Button>
              <Button size="sm" variant="secondary" onclick={() => (editingBio = false)}>Cancel</Button>
            </div>
          </div>
        {:else if profile.bio}
          <p class="mt-4 text-sm leading-relaxed">{profile.bio}</p>
          <div class="mt-3 flex items-center gap-2">
            <Button size="sm" variant="ghost" onclick={startEditBio}>Edit bio</Button>
            {#if $voiceSettings.enabled}
              <span class="text-xs text-muted-foreground">or</span>
              <Button size="sm" variant="ghost" onclick={startEditBio}>
                <svg class="mr-1.5 h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="8" y1="22" x2="16" y2="22" />
                </svg>
                Dictate
              </Button>
            {/if}
          </div>
        {:else}
          <div class="mt-4 flex items-center gap-2">
            <p class="text-sm text-muted-foreground">No bio yet.</p>
            <Button size="sm" variant="ghost" onclick={startEditBio}>Add bio</Button>
          </div>
        {/if}
      </Card>

      <Card>
        <h2 class="text-base font-semibold">Sections</h2>
        <p class="mt-2 text-sm text-muted-foreground">
          Education, work, projects, accomplishments, and essays will land here as other
          Phase 1 features ship.
        </p>
      </Card>
    </div>
  {/if}
</div>
