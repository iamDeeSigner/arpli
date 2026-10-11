<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Content as SheetContent } from '$lib/components/ui/sheet';
  import * as Sheet from '$lib/components/ui/sheet';
  import { Button } from '$lib/components/ui/button';
  import SheetOpenDemo from './SheetOpenDemo.svelte';

  const sides = ['top', 'right', 'bottom', 'left'] as const;

  const { Story } = defineMeta({
    title: 'Overlays/Sheet',
    component: SheetContent,
    tags: ['autodocs'],
    parameters: { layout: 'fullscreen' },
    args: { side: 'right', showCloseButton: true },
    argTypes: {
      side: { control: 'select', options: sides },
      showCloseButton: { control: 'boolean' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="flex h-[32rem] items-center justify-center bg-background">
      <Sheet.Root>
        <Sheet.Trigger>
          {#snippet child({ props })}
            <Button {...props} variant="primary">View opportunity</Button>
          {/snippet}
        </Sheet.Trigger>
        <Sheet.Content side={args.side} showCloseButton={args.showCloseButton}>
          <Sheet.Header>
            <Sheet.Title>Gates Cambridge Scholarship</Sheet.Title>
            <Sheet.Description>University of Cambridge · Postgraduate</Sheet.Description>
          </Sheet.Header>
          <p class="type-body py-4 text-foreground">
            Covers the full cost of studying at Cambridge for outstanding applicants from outside
            the UK. Applications close December 3, 2026.
          </p>
          <Sheet.Footer>
            <Sheet.Close>
              {#snippet child({ props })}
                <Button {...props} variant="ghost">Close</Button>
              {/snippet}
            </Sheet.Close>
            <Button variant="primary">Start application</Button>
          </Sheet.Footer>
        </Sheet.Content>
      </Sheet.Root>
    </div>
  {/snippet}
</Story>

<Story name="Open by default">
  <div class="flex h-[32rem] items-center justify-center bg-background">
    <SheetOpenDemo />
  </div>
</Story>

<Story name="Each side">
  <div class="flex h-[32rem] items-center justify-center gap-2 bg-background">
    {#each sides as side (side)}
      <Sheet.Root>
        <Sheet.Trigger>
          {#snippet child({ props })}
            <Button {...props} variant="secondary">{side}</Button>
          {/snippet}
        </Sheet.Trigger>
        <Sheet.Content {side}>
          <Sheet.Header>
            <Sheet.Title>Upcoming deadlines</Sheet.Title>
            <Sheet.Description>Opened from the {side} edge.</Sheet.Description>
          </Sheet.Header>
          <ul class="type-body flex flex-col gap-2 py-4 text-foreground">
            <li>Fulbright U.S. Student Program · Oct 14</li>
            <li>Marshall Scholarship · Oct 28</li>
            <li>Schwarzman Scholars · Nov 2</li>
          </ul>
        </Sheet.Content>
      </Sheet.Root>
    {/each}
  </div>
</Story>

<Story name="Open on the left">
  <div class="flex h-[32rem] items-center justify-center bg-background">
    <SheetOpenDemo side="left" />
  </div>
</Story>
