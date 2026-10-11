<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Combobox, type ComboboxGroup, type ComboboxOption } from '$lib/components/ui/combobox';
  import { fn } from 'storybook/test';

  const universities: ComboboxOption[] = [
    { value: 'oxford', label: 'University of Oxford', description: 'Oxford, UK' },
    { value: 'cambridge', label: 'University of Cambridge', description: 'Cambridge, UK' },
    { value: 'stanford', label: 'Stanford University', description: 'Stanford, CA' },
    { value: 'tsinghua', label: 'Tsinghua University', description: 'Beijing, China' },
    { value: 'eth', label: 'ETH Zürich', description: 'Zürich, Switzerland' },
    { value: 'toronto', label: 'University of Toronto', description: 'Toronto, Canada', disabled: true },
  ];

  const countryGroups: ComboboxGroup[] = [
    {
      key: 'europe',
      label: 'Europe',
      options: [
        { value: 'uk', label: 'United Kingdom' },
        { value: 'de', label: 'Germany' },
        { value: 'fr', label: 'France' },
      ],
    },
    {
      key: 'asia',
      label: 'Asia',
      options: [
        { value: 'jp', label: 'Japan' },
        { value: 'kr', label: 'South Korea' },
        { value: 'sg', label: 'Singapore' },
      ],
    },
  ];

  const { Story } = defineMeta({
    title: 'Overlays/Combobox',
    component: Combobox,
    tags: ['autodocs'],
    args: {
      ariaLabel: 'Host university',
      options: universities,
      placeholder: 'Choose a university',
      searchPlaceholder: 'Search universities',
      disabled: false,
      invalid: false,
      loading: false,
      multiple: false,
      size: 'default',
      onchange: fn(),
    },
    argTypes: {
      size: { control: 'select', options: ['default', 'compact'] },
      disabled: { control: 'boolean' },
      invalid: { control: 'boolean' },
      loading: { control: 'boolean' },
      multiple: { control: 'boolean' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-72"><Combobox {...args} /></div>
  {/snippet}
</Story>

<Story name="Grouped">
  {#snippet template()}
    <div class="w-72">
      <Combobox
        ariaLabel="Study destination"
        groups={countryGroups}
        header="Study destination"
        placeholder="Choose a country"
      />
    </div>
  {/snippet}
</Story>

<Story name="Multiple">
  {#snippet template()}
    <div class="w-72">
      <Combobox
        ariaLabel="Universities to apply to"
        options={universities}
        multiple
        value={['oxford', 'stanford']}
      />
    </div>
  {/snippet}
</Story>

<Story name="States">
  {#snippet template()}
    <div class="flex w-72 flex-col gap-3">
      <Combobox ariaLabel="Disabled" options={universities} disabled placeholder="Disabled" />
      <Combobox ariaLabel="Invalid" options={universities} invalid placeholder="Required field" />
      <Combobox ariaLabel="Loading" options={[]} loading placeholder="Loading universities…" />
      <Combobox ariaLabel="Compact" options={universities} size="compact" value="eth" />
    </div>
  {/snippet}
</Story>
