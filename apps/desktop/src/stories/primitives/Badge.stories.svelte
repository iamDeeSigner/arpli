<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import { Badge, badgeColors, type BadgeColor } from '$lib/components/ui/badge';
  import CalendarIcon from 'phosphor-svelte/lib/CalendarIcon';
  import GraduationCapIcon from 'phosphor-svelte/lib/GraduationCapIcon';
  import CurrencyDollarIcon from 'phosphor-svelte/lib/CurrencyDollarIcon';

  const colors = Object.keys(badgeColors) as BadgeColor[];

  const { Story } = defineMeta({
    title: 'Primitives/Badge',
    component: Badge,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: { variant: 'solid', color: 'blue', size: 'default', dot: false },
    argTypes: {
      variant: {
        control: 'select',
        options: ['solid', 'dot', 'default', 'secondary', 'outline', 'destructive', 'success', 'info'],
      },
      color: { control: 'select', options: colors },
      size: { control: 'inline-radio', options: ['default', 'compact'] },
      dot: { control: 'boolean' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <Badge {...args}>Scholarship</Badge>
  {/snippet}
</Story>

<Story name="Colors">
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap gap-2">
      {#each colors as color (color)}
        <Badge variant="solid" {color}>{color}</Badge>
      {/each}
    </div>
    <div class="flex flex-wrap gap-2">
      {#each colors as color (color)}
        <Badge variant="dot" {color}>{color}</Badge>
      {/each}
    </div>
  </div>
</Story>

<Story name="Variants">
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap items-center gap-2">
      <Badge variant="solid" color="green">Submitted</Badge>
      <Badge variant="dot" color="amber">Due in 3 days</Badge>
      <Badge variant="solid" color="violet" dot>In review</Badge>
    </div>
    <p class="type-caption text-muted-foreground">Legacy aliases</p>
    <div class="flex flex-wrap items-center gap-2">
      <Badge variant="default">default</Badge>
      <Badge variant="secondary">secondary</Badge>
      <Badge variant="outline">outline</Badge>
      <Badge variant="destructive">destructive</Badge>
      <Badge variant="success">success</Badge>
      <Badge variant="info">info</Badge>
    </div>
  </div>
</Story>

<Story name="Sizes">
  <div class="flex flex-wrap items-center gap-2">
    <Badge size="default" color="blue">Default</Badge>
    <Badge size="compact" color="blue">Compact</Badge>
    <Badge size="default" variant="dot" color="green">Default dot</Badge>
    <Badge size="compact" variant="dot" color="green">Compact dot</Badge>
  </div>
</Story>

<Story name="With icon and removable">
  <div class="flex flex-wrap items-center gap-2">
    <Badge color="indigo">
      {#snippet leadingIcon()}<GraduationCapIcon />{/snippet}
      Fellowship
    </Badge>
    <Badge color="emerald">
      {#snippet leadingIcon()}<CurrencyDollarIcon />{/snippet}
      $25,000
    </Badge>
    <Badge variant="dot" color="red">
      {#snippet leadingIcon()}<CalendarIcon />{/snippet}
      Closes Mar 15
    </Badge>
    <Badge color="gray" removable removeLabel="Remove STEM filter" onRemove={fn()}>STEM</Badge>
    <Badge color="blue" removable removeLabel="Remove first-generation filter" onRemove={fn()}>
      First-generation
    </Badge>
  </div>
</Story>
