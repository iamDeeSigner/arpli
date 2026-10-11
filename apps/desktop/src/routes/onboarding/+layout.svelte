<script lang="ts">
  let { children } = $props();
</script>

<!--
  Onboarding layout — full-screen takeover, no sidebar. Centers a narrow column
  vertically. Uses semantic tokens so it respects theme changes.
-->
<div
  data-slot="onboarding-layout"
  class="flex min-h-screen flex-col items-center justify-center bg-background text-foreground"
>
  <div class="w-full max-w-md px-6 py-10">
    {@render children()}
  </div>
</div>
