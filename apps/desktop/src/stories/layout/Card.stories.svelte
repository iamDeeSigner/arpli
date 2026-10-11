<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Root as CardRoot } from '$lib/components/ui/card';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import DotsThreeIcon from 'phosphor-svelte/lib/DotsThreeIcon';
  import GraduationCapIcon from 'phosphor-svelte/lib/GraduationCapIcon';

  const opportunities = [
    { name: 'Rhodes Scholarship', org: 'Rhodes Trust', deadline: 'Oct 1' },
    { name: 'Fulbright U.S. Student Program', org: 'U.S. Department of State', deadline: 'Oct 14' },
    { name: 'Marshall Scholarship', org: 'Marshall Aid Commemoration Commission', deadline: 'Oct 28' },
  ];

  const { Story } = defineMeta({
    title: 'Layout/Card',
    component: CardRoot,
    tags: ['autodocs'],
    args: { interactive: false, selected: false, border: 'none' },
    argTypes: {
      interactive: { control: 'boolean' },
      selected: { control: 'boolean' },
      border: { control: 'select', options: ['none', 'outlined'] },
      level: { control: { type: 'number', min: 0, max: 4 } },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <Card.Root {...args} class="w-96">
      <Card.Header>
        <Card.Title>Gates Cambridge Scholarship</Card.Title>
        <Card.Description>University of Cambridge · Postgraduate</Card.Description>
        <Card.Action>
          <Button variant="ghost" size="icon-sm" iconOnly aria-label="More actions">
            <DotsThreeIcon aria-hidden="true" />
          </Button>
        </Card.Action>
      </Card.Header>
      <Card.Content>
        <p class="type-body text-foreground">
          Full cost of study for outstanding applicants from outside the UK, with a commitment to
          improving the lives of others.
        </p>
      </Card.Content>
      <Card.Footer class="justify-between">
        <span class="type-caption text-muted-foreground">Closes Dec 3, 2026</span>
        <Button variant="primary" size="sm">Start application</Button>
      </Card.Footer>
    </Card.Root>
  {/snippet}
</Story>

<Story name="All parts">
  <Card.Root class="w-96" border="outlined">
    {#snippet media()}
      <div class="flex h-28 items-center justify-center bg-muted text-muted-foreground">
        <GraduationCapIcon size={40} aria-hidden="true" />
      </div>
    {/snippet}
    <Card.Header>
      <Card.Title>Schwarzman Scholars</Card.Title>
      <Card.Description>Tsinghua University · One-year master's</Card.Description>
      <Card.Action>
        <Badge color="green">92% match</Badge>
      </Card.Action>
    </Card.Header>
    <Card.Content>
      <dl class="type-body grid grid-cols-[7rem_1fr] gap-y-1">
        <dt class="text-muted-foreground">Award</dt>
        <dd>Full tuition, room, board, travel</dd>
        <dt class="text-muted-foreground">Deadline</dt>
        <dd>September 20, 2026</dd>
      </dl>
    </Card.Content>
    <Card.Footer class="justify-end gap-2">
      <Button variant="ghost" size="sm">Dismiss</Button>
      <Button variant="secondary" size="sm">Save</Button>
    </Card.Footer>
  </Card.Root>
</Story>

<Story name="Interactive and selected">
  <div class="flex gap-4">
    <Card.Root interactive class="w-64">
      <Card.Header>
        <Card.Title>Interactive</Card.Title>
        <Card.Description>Hover to see the raised surface.</Card.Description>
      </Card.Header>
    </Card.Root>
    <Card.Root interactive selected class="w-64">
      <Card.Header>
        <Card.Title>Selected</Card.Title>
        <Card.Description>The opportunity you're viewing.</Card.Description>
      </Card.Header>
    </Card.Root>
    <Card.Root border="outlined" class="w-64">
      <Card.Header>
        <Card.Title>Outlined</Card.Title>
        <Card.Description>Static card with a border.</Card.Description>
      </Card.Header>
    </Card.Root>
  </div>
</Story>

<Story name="CardGroup">
  <div class="flex w-[40rem] flex-col gap-8">
    <Card.Group border="outlined" selected={1}>
      {#each opportunities as item (item.name)}
        <Card.Root interactive>
          <Card.Header>
            <Card.Title>{item.name}</Card.Title>
            <Card.Description>{item.org}</Card.Description>
            <Card.Action>
              <span class="type-caption text-muted-foreground">{item.deadline}</span>
            </Card.Action>
          </Card.Header>
        </Card.Root>
      {/each}
    </Card.Group>
    <Card.Group columns={3} separated>
      {#each opportunities as item (item.name)}
        <Card.Root>
          <Card.Header>
            <Card.Title>{item.deadline}</Card.Title>
            <Card.Description>{item.name}</Card.Description>
          </Card.Header>
        </Card.Root>
      {/each}
    </Card.Group>
  </div>
</Story>
