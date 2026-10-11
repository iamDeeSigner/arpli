<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Dropdown, type DropdownGroup, type DropdownOption } from '$lib/components/ui/dropdown';
  import { fn } from 'storybook/test';

  const statusOptions: DropdownOption[] = [
    { value: 'draft', label: 'Draft', description: 'Still writing' },
    { value: 'ready', label: 'Ready to submit' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'awarded', label: 'Awarded' },
    { value: 'declined', label: 'Not selected', disabled: true },
  ];

  const fieldGroups: DropdownGroup[] = [
    {
      key: 'stem',
      label: 'STEM',
      options: [
        { value: 'cs', label: 'Computer science' },
        { value: 'bio', label: 'Biology' },
        { value: 'eng', label: 'Engineering' },
      ],
    },
    {
      key: 'humanities',
      label: 'Humanities',
      options: [
        { value: 'hist', label: 'History' },
        { value: 'phil', label: 'Philosophy' },
        { value: 'lit', label: 'Literature' },
      ],
    },
  ];

  const { Story } = defineMeta({
    title: 'Overlays/Dropdown',
    component: Dropdown,
    tags: ['autodocs'],
    args: {
      options: statusOptions,
      value: 'draft',
      variant: 'default',
      size: 'md',
      searchable: false,
      disabled: false,
      portal: true,
      onchange: fn(),
    },
    argTypes: {
      variant: { control: 'select', options: ['default', 'ghost', 'outline', 'inline'] },
      size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
      searchable: { control: 'boolean' },
      disabled: { control: 'boolean' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-64"><Dropdown {...args} /></div>
  {/snippet}
</Story>

<Story name="Searchable groups">
  {#snippet template()}
    <div class="w-64">
      <Dropdown groups={fieldGroups} searchable portal placeholder="Field of study" />
    </div>
  {/snippet}
</Story>

<Story name="Multiple">
  {#snippet template()}
    <div class="w-64">
      <Dropdown
        options={statusOptions.slice(0, 4)}
        value={['draft', 'ready']}
        multiple
        closeOnSelect={false}
        searchable={false}
        portal
      />
    </div>
  {/snippet}
</Story>

<Story name="Trigger variants">
  {#snippet template()}
    <div class="flex items-center gap-3">
      {#each ['default', 'ghost', 'outline', 'inline'] as const as variant (variant)}
        <Dropdown options={statusOptions} value="ready" {variant} searchable={false} portal />
      {/each}
    </div>
  {/snippet}
</Story>
