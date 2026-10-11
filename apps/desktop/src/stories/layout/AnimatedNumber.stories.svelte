<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AnimatedNumber from '$lib/components/ui/AnimatedNumber.svelte';
  import AnimatedNumberDemo from './AnimatedNumberDemo.svelte';

  const { Story } = defineMeta({
    title: 'Layout/AnimatedNumber',
    component: AnimatedNumber,
    tags: ['autodocs'],
    args: { value: 12, tier: 'slow', pulse: true, accessible: true },
    argTypes: {
      value: { control: { type: 'number', step: 1 } },
      tier: { control: 'select', options: ['fast', 'moderate', 'slow'] },
      pulse: { control: 'boolean' },
      accessible: { control: 'boolean' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="type-body text-foreground">
      <AnimatedNumber {...args} class="type-title font-bold" /> applications tracked
    </div>
  {/snippet}
</Story>

<Story name="Interactive">
  <AnimatedNumberDemo />
</Story>

<Story name="With secondary value">
  <div class="type-body text-foreground">
    <AnimatedNumber
      value={3}
      secondaryValue={5}
      format={(n, total) => `${Math.round(n)} of ${total} sections complete`}
    />
  </div>
</Story>
