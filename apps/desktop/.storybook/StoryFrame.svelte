<!-- Wraps every story in the providers the app root supplies (see src/routes/+layout.svelte). -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { TooltipProvider } from '$lib/components/ui/tooltip';
  import { Toast } from '$lib/components/ui/toast';

  let { children }: { children?: Snippet } = $props();
</script>

<TooltipProvider>
  <div class="bg-background text-foreground" style="font-family: var(--font-ui);">
    {@render children?.()}
  </div>
  <Toast />
</TooltipProvider>
