<script lang="ts">
  let { children } = $props();
</script>

<!--
  Onboarding layout — full-screen, no sidebar. Centers content vertically.
  Uses the bg-background + text-foreground tokens so it respects theme changes.
-->
<div class="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
  <div class="w-full max-w-md px-6 py-10">
    {@render children()}
  </div>
</div>
