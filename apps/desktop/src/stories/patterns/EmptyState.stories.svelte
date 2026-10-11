<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import { EmptyState } from '$lib/components/patterns/screen';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import TargetIcon from 'phosphor-svelte/lib/TargetIcon';
  import FileTextIcon from 'phosphor-svelte/lib/FileTextIcon';
  import MagnifyingGlassIcon from 'phosphor-svelte/lib/MagnifyingGlassIcon';
  import TrashIcon from 'phosphor-svelte/lib/TrashIcon';

  const { Story } = defineMeta({
    title: 'Patterns/EmptyState',
    component: EmptyState,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: {
      density: 'default',
      emphasis: 'routine',
      severity: 'routine',
      inset: false,
      actionLabel: 'Browse opportunities',
      onAction: fn(),
    },
    argTypes: {
      density: { control: 'inline-radio', options: ['default', 'compact'] },
      emphasis: { control: 'inline-radio', options: ['routine', 'prominent'] },
      severity: { control: 'inline-radio', options: ['routine', 'danger'] },
      inset: { control: 'boolean' },
      actionLabel: { control: 'text' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-[520px] rounded-(--radius-large) border border-border bg-card">
      <EmptyState {...args}>
        {#snippet icon()}<TargetIcon class="size-8" aria-hidden="true" />{/snippet}
        {#snippet title()}No saved opportunities yet{/snippet}
        {#snippet description()}
          Save scholarships and grants you want to apply for and they will show up here.
        {/snippet}
      </EmptyState>
    </div>
  {/snippet}
</Story>

<Story name="Prominent with actions">
  {#snippet template()}
    <div class="w-[560px] rounded-(--radius-large) border border-border bg-card">
      <EmptyState emphasis="prominent">
        {#snippet icon()}<FileTextIcon class="size-10" aria-hidden="true" />{/snippet}
        {#snippet title()}Start your first application{/snippet}
        {#snippet description()}
          Pick an opportunity and Arpli will draft answers from your profile — essays, references
          and deadlines in one place.
        {/snippet}
        {#snippet actions()}
          <Button variant="primary">New application</Button>
          <Button variant="ghost">Import from a PDF</Button>
        {/snippet}
      </EmptyState>
    </div>
  {/snippet}
</Story>

<Story name="Compact (search results)">
  {#snippet template()}
    <div class="w-[360px] rounded-(--radius-large) border border-border bg-card">
      <EmptyState density="compact" actionLabel="Clear filters" onAction={() => {}}>
        {#snippet icon()}<MagnifyingGlassIcon class="size-5" aria-hidden="true" />{/snippet}
        {#snippet title()}No fellowships match “marine biology, 2027”{/snippet}
      </EmptyState>
    </div>
  {/snippet}
</Story>

<Story name="Danger severity, inset in card">
  {#snippet template()}
    <Card.Root class="w-[480px]">
      <Card.Header>
        <Card.Title>Archived applications</Card.Title>
      </Card.Header>
      <EmptyState severity="danger" inset>
        {#snippet icon()}<TrashIcon class="size-8" aria-hidden="true" />{/snippet}
        {#snippet title()}Archive was cleared{/snippet}
        {#snippet description()}Applications archived more than 90 days ago are removed permanently.{/snippet}
      </EmptyState>
    </Card.Root>
  {/snippet}
</Story>
