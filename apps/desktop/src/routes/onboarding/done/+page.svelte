<!--
  Onboarding Step 4: Done.
  Marks onboarding complete and routes into the main app.
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/Button.svelte';
  import { onboarding } from '$lib/stores/onboarding';

  onMount(() => {
    // Mark as complete immediately — the user can dismiss the screen at their pace.
    onboarding.complete();
  });

  function enter() {
    goto('/profile', { replaceState: true });
  }
</script>

<div class="flex flex-col items-center gap-6 text-center">
  <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="text-primary-foreground"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  </div>

  <div class="flex flex-col gap-2">
    <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Step 4 of 4</p>
    <h1 class="text-2xl font-semibold tracking-tight">You're all set</h1>
    <p class="text-sm text-muted-foreground">
      Arpli is ready. Your profile, opportunities, and applications live here — private,
      local, and always growing.
    </p>
  </div>

  <ul class="flex flex-col gap-2 text-left text-sm w-full">
    {#each [
      'Paste an opportunity URL or description to get started',
      'Arpli surfaces how your profile fits each requirement',
      'Draft application materials with AI assistance',
    ] as tip, i}
      <li class="flex items-start gap-3 rounded-md bg-card border border-border p-3">
        <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {i + 1}
        </span>
        {tip}
      </li>
    {/each}
  </ul>

  <Button onclick={enter} size="lg" class="w-full">Open Arpli</Button>
</div>
