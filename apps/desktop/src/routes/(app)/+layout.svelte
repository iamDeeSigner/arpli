<script lang="ts">
  import Sidebar from '$lib/components/layout/Sidebar.svelte';
  import { page } from '$app/state';
  import { lastSection, sectionFromPath } from '$lib/stores/nav';

  let { children } = $props();

  // Persist the active section so a refresh returns to the last visited area.
  $effect(() => {
    const section = sectionFromPath(page.url.pathname);
    if (section) lastSection.set(section);
  });
</script>

<div class="flex h-screen w-screen overflow-hidden bg-background text-foreground">
  <Sidebar />
  <section class="flex min-w-0 flex-1 flex-col">
    {@render children()}
  </section>
</div>
