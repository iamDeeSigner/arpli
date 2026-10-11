<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TopBar from '$lib/components/layout/TopBar.svelte';
  import { Button } from '$lib/components/ui/button';
  import PlusIcon from 'phosphor-svelte/lib/PlusIcon';
  import FunnelIcon from 'phosphor-svelte/lib/FunnelIcon';

  const { Story } = defineMeta({
    title: 'Arpli/TopBar',
    component: TopBar,
    tags: ['autodocs'],
    parameters: { layout: 'fullscreen' },
    args: {
      title: 'Opportunities',
      subtitle: 'Scholarships, grants and fellowships matched to your profile.',
    },
    argTypes: {
      title: { control: 'text' },
      subtitle: { control: 'text' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="border-b border-border"><TopBar {...args} /></div>
  {/snippet}
</Story>

<Story name="With actions">
  {#snippet template()}
    <div class="border-b border-border">
      <TopBar title="Applications" subtitle="4 in progress · next deadline Oct 14">
        {#snippet actions()}
          <Button variant="ghost" size="sm">
            {#snippet leadingIcon()}<FunnelIcon aria-hidden="true" />{/snippet}
            Filter
          </Button>
          <Button variant="primary" size="sm">
            {#snippet leadingIcon()}<PlusIcon aria-hidden="true" />{/snippet}
            New application
          </Button>
        {/snippet}
      </TopBar>
    </div>
  {/snippet}
</Story>

<Story name="Title only">
  {#snippet template()}
    <div class="border-b border-border"><TopBar title="Profile" /></div>
  {/snippet}
</Story>
