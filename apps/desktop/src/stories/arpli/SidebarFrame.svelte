<!-- Story helper: mounts the Arpli Sidebar inside the same provider the (app) layout uses. -->
<script lang="ts">
  import Sidebar from '$lib/components/layout/Sidebar.svelte';
  import * as SidebarPrimitive from '$lib/components/ui/sidebar';
</script>

<SidebarPrimitive.Provider open persist={false} class="h-[560px] w-full overflow-hidden">
  <Sidebar />
  <SidebarPrimitive.Inset class="flex min-w-0 flex-1 items-center justify-center">
    <p class="type-body text-muted-foreground">Page content</p>
  </SidebarPrimitive.Inset>
</SidebarPrimitive.Provider>
