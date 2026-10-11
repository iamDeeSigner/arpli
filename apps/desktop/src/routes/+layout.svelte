<script lang="ts">
  import '../app.css';
  import { theme } from '$lib/stores/theme';
  import { TooltipProvider } from '$lib/components/ui/tooltip';
  import { Toast } from '$lib/components/ui/toast';
  import { ConfirmHost } from '$lib/components/patterns/confirm';

  // On mount, apply the persisted theme. The import triggers the side-effect
  // inside the theme store that reads localStorage and sets the class on <html>.
  // We use the store value to keep TypeScript happy about the import.
  void theme;

  let { children } = $props();
</script>

<!-- App-wide providers, as in Intent's root layout: tooltips, toasts and confirm dialogs. -->
<TooltipProvider>
  {@render children()}
  <Toast />
  <ConfirmHost />
</TooltipProvider>
