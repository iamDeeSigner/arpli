<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import { Switch } from '$lib/components/ui/switch';
  import { Label } from '$lib/components/ui/label';

  const { Story } = defineMeta({
    title: 'Forms/Switch',
    component: Switch,
    tags: ['autodocs'],
    args: {
      checked: true,
      disabled: false,
      invalid: false,
      size: 'md',
      ariaLabel: 'Deadline reminders',
      onCheckedChange: fn(),
    },
    argTypes: {
      size: { control: 'select', options: ['xs', 'sm', 'compact', 'md', 'default', 'lg'] },
      checked: { control: 'boolean' },
      disabled: { control: 'boolean' },
      invalid: { control: 'boolean' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <Switch {...args} />
  {/snippet}
</Story>

<Story name="States">
  <div class="flex w-80 flex-col gap-3">
    <div class="flex items-center justify-between">
      <Label for="sw-1">Email deadline reminders</Label>
      <Switch id="sw-1" checked />
    </div>
    <div class="flex items-center justify-between">
      <Label for="sw-2">Show expired opportunities</Label>
      <Switch id="sw-2" />
    </div>
    <div class="flex items-center justify-between">
      <Label for="sw-3">Share profile with counselors</Label>
      <Switch id="sw-3" disabled />
    </div>
    <div class="flex items-center justify-between">
      <Label for="sw-4">Sync with school portal</Label>
      <Switch id="sw-4" checked disabled />
    </div>
  </div>
</Story>

<Story name="Sizes">
  <div class="flex items-center gap-4">
    {#each ['xs', 'sm', 'md', 'lg'] as const as size (size)}
      <Switch {size} checked ariaLabel="Switch {size}" />
    {/each}
  </div>
</Story>
