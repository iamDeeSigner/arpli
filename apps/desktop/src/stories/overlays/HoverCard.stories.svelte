<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import HoverCard from '$lib/components/ui/HoverCard.svelte';
  import HoverCardDemo from './HoverCardDemo.svelte';

  const { Story } = defineMeta({
    title: 'Overlays/HoverCard',
    component: HoverCardDemo,
    tags: ['autodocs'],
    args: { position: 'right' },
    argTypes: {
      position: {
        control: 'select',
        options: ['right', 'bottom', 'bottom-right', 'bottom-left', 'top'],
      },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="p-24">
      <HoverCardDemo {...args} />
    </div>
  {/snippet}
</Story>

<Story name="Positions">
  <div class="grid grid-cols-3 gap-x-24 gap-y-40 p-24">
    {#each ['right', 'bottom', 'bottom-right', 'bottom-left', 'top'] as const as position (position)}
      <div class="flex flex-col items-start gap-1">
        <span class="type-caption text-muted-foreground">{position}</span>
        <HoverCardDemo {position} anchor={`--story-hover-${position}`} />
      </div>
    {/each}
  </div>
</Story>

<Story name="Static">
  <HoverCard anchor="--story-hover-static" staticPosition class="gap-2 rounded-(--radius-large) p-3">
    <p class="type-body font-medium text-foreground">Fulbright U.S. Student Program</p>
    <p class="type-caption text-muted-foreground">
      Research, study or teach abroad for one academic year in more than 140 countries.
    </p>
    <p class="type-caption text-foreground">Deadline · October 14, 2026</p>
  </HoverCard>
</Story>
