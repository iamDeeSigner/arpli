<script lang="ts">
  import Sidebar from '$lib/components/layout/Sidebar.svelte';
  import * as SidebarPrimitive from '$lib/components/ui/sidebar';
  import { page } from '$app/state';
  import { lastSection, sectionFromPath } from '$lib/stores/nav';

  let { children } = $props();

  // Persist the active section so a refresh returns to the last visited area.
  $effect(() => {
    const section = sectionFromPath(page.url.pathname);
    if (section) lastSection.set(section);
  });
</script>

<SidebarPrimitive.Provider open persist={false} class="h-screen w-screen overflow-hidden">
  <Sidebar />
  <SidebarPrimitive.Inset class="flex min-w-0 flex-1 flex-col overflow-hidden">
    {@render children()}
  </SidebarPrimitive.Inset>
</SidebarPrimitive.Provider>
