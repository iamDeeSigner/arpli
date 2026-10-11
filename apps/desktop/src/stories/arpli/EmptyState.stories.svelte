<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EmptyState from '$lib/components/layout/EmptyState.svelte';
  import { Button } from '$lib/components/ui/button';
  import TargetIcon from 'phosphor-svelte/lib/TargetIcon';
  import FileTextIcon from 'phosphor-svelte/lib/FileTextIcon';

  const { Story } = defineMeta({
    title: 'Arpli/EmptyState',
    component: EmptyState,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: {
      title: 'Your profile is empty',
      description: 'Add your education, experience and achievements so Arpli can match opportunities.',
    },
    argTypes: {
      title: { control: 'text' },
      description: { control: 'text' },
      icon: { control: false },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-[560px]"><EmptyState {...args} /></div>
  {/snippet}
</Story>

<Story name="Opportunities">
  {#snippet template()}
    <div class="w-[560px]">
      <EmptyState
        icon={TargetIcon}
        title="No opportunities yet"
        description="Complete your profile and Arpli will find scholarships, grants and fellowships for you."
      >
        {#snippet actions()}<Button variant="primary">Complete profile</Button>{/snippet}
      </EmptyState>
    </div>
  {/snippet}
</Story>

<Story name="Applications">
  {#snippet template()}
    <div class="w-[560px]">
      <EmptyState icon={FileTextIcon} title="No applications in progress">
        {#snippet actions()}
          <Button variant="primary">Browse opportunities</Button>
          <Button variant="ghost">Import an application</Button>
        {/snippet}
      </EmptyState>
    </div>
  {/snippet}
</Story>
