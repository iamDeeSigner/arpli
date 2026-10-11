<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import { ActionMenu } from '$lib/components/patterns/action-menu';
  import { Button } from '$lib/components/ui/button';
  import DotsThreeIcon from 'phosphor-svelte/lib/DotsThreeIcon';
  import SlidersHorizontalIcon from 'phosphor-svelte/lib/SlidersHorizontalIcon';
  import { applicationActions, viewActions } from './action-fixtures';

  const { Story } = defineMeta({
    title: 'Patterns/ActionMenu',
    component: ActionMenu,
    tags: ['autodocs'],
    args: {
      actions: applicationActions,
      ariaLabel: 'Application actions',
      align: 'start',
      side: 'bottom',
      onAction: fn(),
    },
    argTypes: {
      actions: { control: false },
      align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
      side: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] },
      ariaLabel: { control: 'text' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <ActionMenu {...args}>
      {#snippet trigger({ props })}
        <Button {...props} variant="secondary">Actions</Button>
      {/snippet}
    </ActionMenu>
  {/snippet}
</Story>

<Story name="Icon trigger (row overflow)">
  {#snippet template()}
    <div class="flex w-[420px] items-center justify-between rounded-(--radius-medium) bg-card px-4 py-3">
      <div>
        <div class="type-body font-medium">Gates Cambridge Scholarship</div>
        <div class="type-caption text-muted-foreground">Due Oct 14, 2026 · Draft</div>
      </div>
      <ActionMenu actions={applicationActions} ariaLabel="More actions" align="end" onAction={() => {}}>
        {#snippet trigger({ props })}
          <Button {...props} variant="ghost-light" size="icon-sm" iconOnly aria-label="More actions">
            <DotsThreeIcon weight="bold" />
          </Button>
        {/snippet}
      </ActionMenu>
    </div>
  {/snippet}
</Story>

<Story name="Checkbox and radio groups">
  {#snippet template()}
    <ActionMenu actions={viewActions} ariaLabel="View options" onAction={() => {}}>
      {#snippet trigger({ props })}
        <Button {...props} variant="outline" size="sm">
          {#snippet leadingIcon()}<SlidersHorizontalIcon aria-hidden="true" />{/snippet}
          View
        </Button>
      {/snippet}
    </ActionMenu>
  {/snippet}
</Story>
