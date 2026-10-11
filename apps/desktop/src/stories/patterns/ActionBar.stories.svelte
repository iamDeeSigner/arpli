<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import { ActionBar, defineActions } from '$lib/components/patterns/action-menu';
  import { toolbarActions, applicationActions } from './action-fixtures';

  const { Story } = defineMeta({
    title: 'Patterns/ActionBar',
    component: ActionBar,
    tags: ['autodocs'],
    args: {
      actions: toolbarActions,
      visibleCount: 3,
      overflowLabel: 'More application actions',
      destructiveInline: true,
      onAction: fn(),
    },
    argTypes: {
      actions: { control: false },
      visibleCount: { control: { type: 'number', min: 0, max: 6 } },
      overflowLabel: { control: 'text' },
      destructiveInline: { control: 'boolean' },
    },
  });

  const textActions = defineActions([
    { kind: 'action', id: 'save', label: 'Save draft', shortcut: '⌘S' },
    { kind: 'action', id: 'preview', label: 'Preview' },
    { kind: 'checkbox', id: 'ready', label: 'Ready to submit', checked: true },
    { kind: 'action', id: 'discard', label: 'Discard changes', destructive: true },
  ]);
</script>

<Story name="Playground">
  {#snippet template(args)}
    <ActionBar {...args} />
  {/snippet}
</Story>

<Story name="All inline">
  {#snippet template()}
    <ActionBar actions={toolbarActions} overflowLabel="More" onAction={() => {}} />
  {/snippet}
</Story>

<Story name="Text actions">
  {#snippet template()}
    <ActionBar actions={textActions} overflowLabel="More" onAction={() => {}} />
  {/snippet}
</Story>

<Story name="Everything in overflow">
  {#snippet template()}
    <ActionBar actions={applicationActions} visibleCount={0} overflowLabel="Application actions" onAction={() => {}} />
  {/snippet}
</Story>
