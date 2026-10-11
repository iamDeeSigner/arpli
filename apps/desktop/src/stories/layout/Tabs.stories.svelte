<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Root as TabsRoot } from '$lib/components/ui/tabs';
  import * as Tabs from '$lib/components/ui/tabs';

  const variants = ['default', 'subtle', 'underline'] as const;

  const { Story } = defineMeta({
    title: 'Layout/Tabs',
    component: TabsRoot,
    tags: ['autodocs'],
    args: { value: 'overview', variant: 'default', size: 'default', orientation: 'horizontal' },
    argTypes: {
      variant: { control: 'select', options: variants },
      size: { control: 'select', options: ['default', 'compact'] },
      orientation: { control: 'select', options: ['horizontal', 'vertical'] },
      disabled: { control: 'boolean' },
    },
  });
</script>

{#snippet panels()}
  <Tabs.Content value="overview" class="type-body pt-4 text-foreground">
    Fully funded postgraduate study at Oxford for two to three years.
  </Tabs.Content>
  <Tabs.Content value="eligibility" class="type-body pt-4 text-foreground">
    Ages 18–24, bachelor's degree completed before October 2027.
  </Tabs.Content>
  <Tabs.Content value="documents" class="type-body pt-4 text-foreground">
    Personal statement, academic statement, CV, transcript and 5–8 references.
  </Tabs.Content>
{/snippet}

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-[28rem]">
      <Tabs.Root {...args}>
        <Tabs.List>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="eligibility">Eligibility</Tabs.Trigger>
          <Tabs.Trigger value="documents">Documents</Tabs.Trigger>
          <Tabs.Trigger value="results" disabled>Results</Tabs.Trigger>
        </Tabs.List>
        {@render panels()}
      </Tabs.Root>
    </div>
  {/snippet}
</Story>

<Story name="Variants">
  <div class="flex w-[28rem] flex-col gap-8">
    {#each variants as variant (variant)}
      <div class="flex flex-col gap-2">
        <span class="type-caption text-muted-foreground">{variant}</span>
        <Tabs.Root value="overview" {variant}>
          <Tabs.List>
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="eligibility">Eligibility</Tabs.Trigger>
            <Tabs.Trigger value="documents">Documents</Tabs.Trigger>
          </Tabs.List>
          {@render panels()}
        </Tabs.Root>
      </div>
    {/each}
  </div>
</Story>

<Story name="Compact">
  <div class="w-[28rem]">
    <Tabs.Root value="eligibility" size="compact" variant="subtle">
      <Tabs.List>
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="eligibility">Eligibility</Tabs.Trigger>
        <Tabs.Trigger value="documents">Documents</Tabs.Trigger>
      </Tabs.List>
      {@render panels()}
    </Tabs.Root>
  </div>
</Story>
