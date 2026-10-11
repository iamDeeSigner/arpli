<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CollapsiblePanel from '$lib/components/ui/CollapsiblePanel.svelte';
  import { Button } from '$lib/components/ui/button';
  import PlusIcon from 'phosphor-svelte/lib/PlusIcon';

  const { Story } = defineMeta({
    title: 'Layout/CollapsiblePanel',
    component: CollapsiblePanel,
    tags: ['autodocs'],
    args: {
      title: 'Education',
      defaultCollapsed: false,
      showChevronOnHover: true,
      showGradient: true,
    },
    argTypes: {
      title: { control: 'text' },
      defaultCollapsed: { control: 'boolean' },
      showChevronOnHover: { control: 'boolean' },
      showGradient: { control: 'boolean' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-96">
      <CollapsiblePanel {...args}>
        <ul class="type-body flex flex-col gap-2 p-3 text-foreground">
          <li>B.S. Biology · University of Michigan · 2026</li>
          <li>Study abroad · University of Edinburgh · 2025</li>
        </ul>
      </CollapsiblePanel>
    </div>
  {/snippet}
</Story>

<Story name="Collapsed with actions">
  <div class="w-96">
    <CollapsiblePanel title="Awards and honors" defaultCollapsed>
      {#snippet headerActions()}
        <Button variant="ghost" size="icon-xs" iconOnly aria-label="Add award">
          <PlusIcon aria-hidden="true" />
        </Button>
      {/snippet}
      <ul class="type-body flex flex-col gap-2 p-3 text-foreground">
        <li>Goldwater Scholar, 2025</li>
        <li>Dean's List, six semesters</li>
      </ul>
    </CollapsiblePanel>
  </div>
</Story>

<Story name="Stacked">
  <div class="flex w-96 flex-col gap-2">
    <CollapsiblePanel title="Personal details">
      <p class="type-body p-3 text-muted-foreground">Name, contact information, citizenship.</p>
    </CollapsiblePanel>
    <CollapsiblePanel title="Work experience" defaultCollapsed>
      <p class="type-body p-3 text-muted-foreground">Research assistant, Ecology Lab, 2024–2026.</p>
    </CollapsiblePanel>
    <CollapsiblePanel title="Activities" defaultCollapsed showGradient={false}>
      <p class="type-body p-3 text-muted-foreground">Debate team captain; peer tutor.</p>
    </CollapsiblePanel>
  </div>
</Story>
