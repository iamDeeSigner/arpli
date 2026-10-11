<!-- Demonstrates the three motion tiers from $lib/motion side by side. -->
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { fade, fly, scale, slide } from '$lib/motion';

  const tiers = ['fast', 'moderate', 'slow'] as const;
  let visible = $state(true);
</script>

<div class="flex flex-col gap-6">
  <div class="flex items-center gap-3">
    <Button variant="primary" onclick={() => (visible = !visible)}>
      {visible ? 'Hide' : 'Show'}
    </Button>
    <span class="type-caption text-muted-foreground">
      Enter uses the tier's settle curve; exit uses its shorter crisp-out.
    </span>
  </div>
  <div class="grid grid-cols-[8rem_repeat(4,9rem)] items-center gap-4">
    <span></span>
    {#each ['fade', 'fly', 'slide', 'scale'] as name (name)}
      <span class="type-caption text-muted-foreground">{name}</span>
    {/each}
    {#each tiers as tier (tier)}
      <code class="type-code">{tier}</code>
      {#each [fade, fly, slide, scale] as transition, index (index)}
        <div class="h-12">
          {#if visible}
            <div
              transition:transition={{ tier }}
              class="type-caption flex h-12 items-center justify-center rounded-(--radius-medium) bg-primary text-primary-foreground"
            >
              {tier}
            </div>
          {/if}
        </div>
      {/each}
    {/each}
  </div>
</div>
