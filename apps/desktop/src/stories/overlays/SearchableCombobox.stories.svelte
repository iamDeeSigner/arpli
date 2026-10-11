<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { SearchableCombobox, type Option } from '$lib/components/ui/searchable-combobox';
  import { fn } from 'storybook/test';

  const recommenders: Option[] = [
    { value: 'patel', label: 'Dr. Anika Patel', description: 'Thesis advisor · Biology' },
    { value: 'nguyen', label: 'Prof. Minh Nguyen', description: 'Course instructor · Chemistry' },
    { value: 'okafor', label: 'Chidi Okafor', description: 'Internship supervisor' },
    { value: 'garcia', label: 'Prof. Lucía García', description: 'Research mentor · Ecology' },
  ];

  function search(query: string): Option[] {
    const q = query.trim().toLowerCase();
    return q ? recommenders.filter((o) => o.label.toLowerCase().includes(q)) : recommenders;
  }

  const { Story } = defineMeta({
    title: 'Overlays/SearchableCombobox',
    component: SearchableCombobox,
    tags: ['autodocs'],
    args: {
      ariaLabel: 'Recommender',
      options: recommenders,
      placeholder: 'Choose a recommender',
      header: 'Recommenders',
      disabled: false,
      dropdownPosition: 'bottom',
      onChange: fn(),
    },
    argTypes: {
      disabled: { control: 'boolean' },
      dropdownPosition: { control: 'select', options: ['top', 'bottom'] },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-72"><SearchableCombobox {...args} /></div>
  {/snippet}
</Story>

<Story name="Async search">
  {#snippet template()}
    <div class="w-72">
      <SearchableCombobox
        ariaLabel="Recommender"
        options={recommenders}
        onSearch={search}
        value="patel"
        tooltip="Who will write your letter"
      />
    </div>
  {/snippet}
</Story>

<Story name="Disabled">
  {#snippet template()}
    <div class="w-72">
      <SearchableCombobox ariaLabel="Recommender" options={recommenders} value="okafor" disabled />
    </div>
  {/snippet}
</Story>
