<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import { Root as ToggleGroupRoot, Item as ToggleGroupItem } from '$lib/components/ui/toggle-group';
  import SquaresFourIcon from 'phosphor-svelte/lib/SquaresFourIcon';
  import RowsIcon from 'phosphor-svelte/lib/RowsIcon';
  import CalendarIcon from 'phosphor-svelte/lib/CalendarIcon';

  const { Story } = defineMeta({
    title: 'Forms/ToggleGroup',
    component: ToggleGroupRoot,
    tags: ['autodocs'],
    args: { type: 'single', value: 'all', variant: 'default', size: 'default', disabled: false, onValueChange: fn() },
    argTypes: {
      variant: { control: 'inline-radio', options: ['default', 'outline', 'flat'] },
      size: { control: 'inline-radio', options: ['xs', 'sm', 'default', 'lg'] },
      disabled: { control: 'boolean' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <ToggleGroupRoot {...args} aria-label="Application status">
      <ToggleGroupItem value="all">All</ToggleGroupItem>
      <ToggleGroupItem value="draft">Drafts</ToggleGroupItem>
      <ToggleGroupItem value="submitted">Submitted</ToggleGroupItem>
      <ToggleGroupItem value="awarded">Awarded</ToggleGroupItem>
    </ToggleGroupRoot>
  {/snippet}
</Story>

<Story name="Variants">
  {#snippet template()}
    <div class="flex flex-col items-start gap-4">
      {#each ['default', 'outline', 'flat'] as const as variant (variant)}
        <ToggleGroupRoot type="single" value="month" {variant} aria-label="Deadline range ({variant})">
          <ToggleGroupItem value="week">This week</ToggleGroupItem>
          <ToggleGroupItem value="month">This month</ToggleGroupItem>
          <ToggleGroupItem value="all">All upcoming</ToggleGroupItem>
        </ToggleGroupRoot>
      {/each}
    </div>
  {/snippet}
</Story>

<Story name="Icons and sizes">
  {#snippet template()}
    <div class="flex flex-col items-start gap-4">
      {#each ['xs', 'sm', 'default', 'lg'] as const as size (size)}
        <ToggleGroupRoot type="single" value="grid" {size} aria-label="View ({size})">
          <ToggleGroupItem value="grid" aria-label="Grid view"><SquaresFourIcon class="size-4" /></ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view"><RowsIcon class="size-4" /></ToggleGroupItem>
          <ToggleGroupItem value="calendar" aria-label="Calendar view"><CalendarIcon class="size-4" /></ToggleGroupItem>
        </ToggleGroupRoot>
      {/each}
    </div>
  {/snippet}
</Story>

<Story name="Multiple">
  {#snippet template()}
    <ToggleGroupRoot type="multiple" value={['stem', 'arts']} aria-label="Fields">
      <ToggleGroupItem value="stem">STEM</ToggleGroupItem>
      <ToggleGroupItem value="arts">Arts</ToggleGroupItem>
      <ToggleGroupItem value="humanities">Humanities</ToggleGroupItem>
      <ToggleGroupItem value="business" disabled>Business</ToggleGroupItem>
    </ToggleGroupRoot>
  {/snippet}
</Story>
