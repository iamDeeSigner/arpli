<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { GroupedCombobox, type OptionGroup } from '$lib/components/ui/grouped-combobox';
  import { fn } from 'storybook/test';

  const essayGroups: OptionGroup[] = [
    {
      key: 'rhodes',
      label: 'Rhodes Scholarship',
      options: [
        { value: 'rhodes-ps', label: 'Personal statement', description: '1,000 words' },
        { value: 'rhodes-ac', label: 'Academic statement', description: '750 words' },
      ],
    },
    {
      key: 'fulbright',
      label: 'Fulbright Program',
      options: [
        { value: 'fb-sop', label: 'Statement of grant purpose', description: '2 pages' },
        { value: 'fb-pers', label: 'Personal statement', description: '1 page' },
      ],
    },
    {
      key: 'marshall',
      label: 'Marshall Scholarship',
      options: [{ value: 'marshall-lead', label: 'Leadership essay', description: '500 words' }],
    },
  ];

  const { Story } = defineMeta({
    title: 'Overlays/GroupedCombobox',
    component: GroupedCombobox,
    tags: ['autodocs'],
    args: {
      ariaLabel: 'Essay',
      groups: essayGroups,
      placeholder: 'Choose an essay',
      header: 'Essays by application',
      defaultCollapsed: false,
      disabled: false,
      onChange: fn(),
    },
    argTypes: {
      defaultCollapsed: { control: 'boolean' },
      disabled: { control: 'boolean' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-80"><GroupedCombobox {...args} /></div>
  {/snippet}
</Story>

<Story name="Collapsed groups">
  {#snippet template()}
    <div class="w-80">
      <GroupedCombobox ariaLabel="Essay" groups={essayGroups} value="fb-sop" defaultCollapsed />
    </div>
  {/snippet}
</Story>

<Story name="Open (static)">
  {#snippet template()}
    <div class="w-80">
      <GroupedCombobox
        ariaLabel="Essay"
        groups={essayGroups}
        value="rhodes-ps"
        open
        staticPosition
        defaultCollapsed={false}
      />
    </div>
  {/snippet}
</Story>
