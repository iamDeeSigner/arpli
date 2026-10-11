<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import { Slider } from '$lib/components/ui/slider';

  const { Story } = defineMeta({
    title: 'Forms/Slider',
    component: Slider,
    tags: ['autodocs'],
    args: {
      value: 3.5,
      min: 2,
      max: 4,
      step: 0.1,
      showValue: true,
      valuePosition: 'right',
      disabled: false,
      'aria-label': 'Minimum GPA',
      onValueChange: fn(),
    },
    argTypes: {
      valuePosition: { control: 'select', options: ['left', 'right', 'top', 'bottom', 'tooltip'] },
      showValue: { control: 'boolean' },
      showSteps: { control: 'boolean' },
      disabled: { control: 'boolean' },
      appearance: { control: 'inline-radio', options: ['default', 'overlay'] },
    },
  });

  const formatUsd = (value: number) => `$${value.toLocaleString('en-US')}`;
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-80">
      <Slider {...args} />
    </div>
  {/snippet}
</Story>

<Story name="Value positions">
  {#snippet template()}
    <div class="flex w-80 flex-col gap-6">
      {#each ['left', 'right', 'top', 'bottom', 'tooltip'] as const as position (position)}
        <Slider value={40} showValue valuePosition={position} aria-label="Hours per week ({position})" />
      {/each}
    </div>
  {/snippet}
</Story>

<Story name="Steps and formatting">
  {#snippet template()}
    <div class="flex w-80 flex-col gap-6">
      <Slider
        value={10000}
        min={0}
        max={50000}
        step={1000}
        steps={[0, 5000, 10000, 25000, 50000]}
        showSteps
        showValue
        formatValue={formatUsd}
        aria-label="Minimum award"
      />
      <Slider value={60} disabled showValue aria-label="Disabled slider" />
    </div>
  {/snippet}
</Story>
