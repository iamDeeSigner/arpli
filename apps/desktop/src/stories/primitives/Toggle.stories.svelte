<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import { Toggle } from '$lib/components/ui/toggle';
  import StarIcon from 'phosphor-svelte/lib/StarIcon';
  import FunnelSimpleIcon from 'phosphor-svelte/lib/FunnelSimpleIcon';

  const { Story } = defineMeta({
    title: 'Primitives/Toggle',
    component: Toggle,
    tags: ['autodocs'],
    args: { pressed: false, disabled: false, size: 'default', onChange: fn() },
    argTypes: {
      pressed: { control: 'boolean' },
      disabled: { control: 'boolean' },
      size: { control: 'inline-radio', options: ['xs', 'sm', 'default', 'lg'] },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <Toggle {...args} ariaLabel="Show starred only">
      <StarIcon class="mr-1.5 size-4" /> Starred only
    </Toggle>
  {/snippet}
</Story>

<Story name="States">
  {#snippet template()}
    <div class="flex flex-wrap items-center gap-3">
      <Toggle>Off</Toggle>
      <Toggle pressed>On</Toggle>
      <Toggle disabled>Disabled</Toggle>
      <Toggle pressed disabled>Disabled on</Toggle>
    </div>
  {/snippet}
</Story>

<Story name="Sizes">
  {#snippet template()}
    <div class="flex flex-wrap items-center gap-3">
      {#each ['xs', 'sm', 'default', 'lg'] as const as size (size)}
        <Toggle {size} ariaLabel="Filter by eligibility ({size})">
          <FunnelSimpleIcon class="mr-1.5 size-4" /> Eligible ({size})
        </Toggle>
      {/each}
    </div>
  {/snippet}
</Story>
