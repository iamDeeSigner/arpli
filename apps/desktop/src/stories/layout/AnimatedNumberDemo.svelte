<!-- Story helper: drives AnimatedNumber with buttons so the value transition is visible. -->
<script lang="ts">
  import AnimatedNumber from '$lib/components/ui/AnimatedNumber.svelte';
  import { Button } from '$lib/components/ui/button';

  let { tier = 'slow' }: { tier?: 'fast' | 'moderate' | 'slow' } = $props();
  let funding = $state(125000);
  const usd = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
</script>

<div class="flex flex-col items-start gap-3">
  <span class="type-caption text-muted-foreground">Potential funding</span>
  <AnimatedNumber value={funding} {tier} format={usd} class="type-title font-bold text-foreground" />
  <div class="flex gap-2">
    <Button variant="secondary" size="sm" onclick={() => (funding += 40000)}>
      Add Fulbright (+$40,000)
    </Button>
    <Button variant="ghost" size="sm" onclick={() => (funding = Math.max(0, funding - 25000))}>
      Remove a grant
    </Button>
  </div>
</div>
