<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ScrollArea } from '$lib/components/ui/scroll-area';

  const deadlines = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    name: [
      'Rhodes Scholarship',
      'Fulbright Program',
      'Marshall Scholarship',
      'Gates Cambridge',
      'Schwarzman Scholars',
      'Knight-Hennessy Scholars',
    ][i % 6],
    date: `Nov ${(i % 28) + 1}, 2026`,
  }));

  const { Story } = defineMeta({
    title: 'Layout/ScrollArea',
    component: ScrollArea,
    tags: ['autodocs'],
    args: { orientation: 'vertical', fadeEdges: true },
    argTypes: {
      orientation: { control: 'select', options: ['vertical', 'horizontal', 'both'] },
      fadeEdges: { control: 'boolean' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <ScrollArea {...args} class="h-72 w-72 rounded-(--radius-large) border border-border">
      <ul class="flex flex-col p-2">
        {#each deadlines as item (item.id)}
          <li class="type-body flex justify-between gap-4 px-2 py-1.5">
            <span class="truncate text-foreground">{item.name}</span>
            <span class="shrink-0 text-muted-foreground">{item.date}</span>
          </li>
        {/each}
      </ul>
    </ScrollArea>
  {/snippet}
</Story>

<Story name="Horizontal">
  {#snippet template()}
    <ScrollArea orientation="horizontal" class="w-96 rounded-(--radius-large) border border-border">
      <div class="flex w-max gap-3 p-3">
        {#each deadlines.slice(0, 12) as item (item.id)}
          <div class="type-caption flex w-36 shrink-0 flex-col gap-1 rounded-(--radius-medium) bg-muted p-3">
            <span class="font-medium text-foreground">{item.name}</span>
            <span class="text-muted-foreground">{item.date}</span>
          </div>
        {/each}
      </div>
    </ScrollArea>
  {/snippet}
</Story>

<Story name="Both axes">
  {#snippet template()}
    <ScrollArea orientation="both" class="h-64 w-80 rounded-(--radius-large) border border-border">
      <div class="type-body w-[40rem] p-4 text-foreground">
        {#each deadlines as item (item.id)}
          <p class="whitespace-nowrap">
            {item.name} — application due {item.date}. Remember to request transcripts and letters
            two weeks in advance.
          </p>
        {/each}
      </div>
    </ScrollArea>
  {/snippet}
</Story>
