<!--
  Onboarding Step 4: Done.
  Marks onboarding complete and routes into the main app.
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { fly } from '$lib/motion';
  import { onboarding } from '$lib/stores/onboarding';
  import CheckIcon from 'phosphor-svelte/lib/CheckIcon';

  onMount(() => {
    // Mark as complete immediately — the user can dismiss the screen at their pace.
    onboarding.complete();
  });

  function enter() {
    goto('/profile', { replaceState: true });
  }

  const tips = [
    'Paste an opportunity URL or description to get started',
    'Arpli surfaces how your profile fits each requirement',
    'Draft application materials with AI assistance',
  ];
</script>

<div class="flex flex-col items-center gap-6 text-center" in:fly={{ tier: 'moderate' }}>
  <div
    class="flex size-16 items-center justify-center rounded-(--radius-large) bg-primary text-primary-foreground"
    aria-hidden="true"
  >
    <CheckIcon class="size-7" weight="bold" />
  </div>

  <div class="flex flex-col gap-2">
    <p class="type-caption text-muted-foreground">Step 4 of 4</p>
    <h1 class="type-display">You're all set</h1>
    <p class="type-body text-muted-foreground">
      Arpli is ready. Your profile, opportunities, and applications live here — private,
      local, and always growing.
    </p>
  </div>

  <ol class="flex w-full flex-col gap-2 text-left">
    {#each tips as tip, i (tip)}
      <li>
        <Card.Root class="flex-row items-start gap-3 p-3">
          <span
            class="type-caption mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground"
            aria-hidden="true"
          >
            {i + 1}
          </span>
          <span class="type-body">{tip}</span>
        </Card.Root>
      </li>
    {/each}
  </ol>

  <Button variant="primary" onclick={enter} size="lg" class="w-full">Open Arpli</Button>
</div>
