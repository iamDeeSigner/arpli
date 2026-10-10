<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { onboarding } from '$lib/stores/onboarding';
  import { lastSection } from '$lib/stores/nav';
  import { profileApi } from '$lib/ipc/client';

  onMount(async () => {
    // Decide the entry route: finished onboarding goes to the last visited
    // section (defaulting to Profile); first-time users enter onboarding.
    let needsOnboarding = !$onboarding.completed;

    // If local onboarding state is missing but a profile already exists in the
    // daemon database, treat the user as returning.
    if (needsOnboarding) {
      try {
        const existing = await profileApi.get();
        if (existing) {
          onboarding.complete();
          needsOnboarding = false;
        }
      } catch {
        // Daemon unreachable — fall through to onboarding; the step 2 check
        // against Ollama will surface the real connectivity story.
      }
    }

    if (needsOnboarding) {
      await goto('/onboarding', { replaceState: true });
    } else {
      await goto(`/${$lastSection}`, { replaceState: true });
    }
  });
</script>

<main class="flex min-h-screen items-center justify-center bg-background">
  <p class="text-sm text-muted-foreground">Loading Arpli…</p>
</main>
