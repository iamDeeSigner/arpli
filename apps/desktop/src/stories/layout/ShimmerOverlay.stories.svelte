<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ShimmerOverlay from '$lib/components/ui/ShimmerOverlay.svelte';

  const { Story } = defineMeta({
    title: 'Layout/ShimmerOverlay',
    component: ShimmerOverlay,
    tags: ['autodocs'],
    args: { duration: 8 },
    argTypes: { duration: { control: { type: 'number', min: 1, max: 20 } } },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <ShimmerOverlay {...args} class="type-title">Matching you with opportunities…</ShimmerOverlay>
  {/snippet}
</Story>

<Story name="Fast">
  <ShimmerOverlay duration={2} class="type-body">Checking eligibility for 48 scholarships…</ShimmerOverlay>
</Story>

<Story name="As overlay">
  <div class="relative w-80 overflow-hidden rounded-(--radius-large) bg-muted p-4">
    <ShimmerOverlay />
    <p class="type-body font-medium text-foreground">Drafting your personal statement</p>
    <p class="type-caption text-muted-foreground">This usually takes a few seconds.</p>
  </div>
</Story>
