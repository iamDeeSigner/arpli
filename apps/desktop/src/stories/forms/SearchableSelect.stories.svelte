<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import { SearchableSelect } from '$lib/components/ui/searchable-select';

  const schools = [
    { value: 'ucla', label: 'University of California, Los Angeles', description: 'Los Angeles, CA' },
    { value: 'umich', label: 'University of Michigan', description: 'Ann Arbor, MI' },
    { value: 'gatech', label: 'Georgia Institute of Technology', description: 'Atlanta, GA' },
    { value: 'utexas', label: 'University of Texas at Austin', description: 'Austin, TX' },
    { value: 'howard', label: 'Howard University', description: 'Washington, DC' },
    { value: 'cuny', label: 'City University of New York', description: 'New York, NY' },
    { value: 'asu', label: 'Arizona State University', description: 'Tempe, AZ' },
  ];

  const { Story } = defineMeta({
    title: 'Forms/SearchableSelect',
    component: SearchableSelect,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: {
      value: '',
      options: schools,
      placeholder: 'Select your school',
      searchPlaceholder: 'Search schools…',
      ariaLabel: 'School',
      emptyText: 'No schools match that search.',
      disabled: false,
      loading: false,
      allowCustom: false,
      onChange: fn(),
    },
    argTypes: {
      disabled: { control: 'boolean' },
      loading: { control: 'boolean' },
      allowCustom: { control: 'boolean' },
    },
  });

  async function searchSchools(query: string) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const q = query.toLowerCase();
    return schools.filter((school) => school.label.toLowerCase().includes(q));
  }
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-80">
      <SearchableSelect {...args} />
    </div>
  {/snippet}
</Story>

<Story name="Preselected">
  <div class="w-80">
    <SearchableSelect options={schools} value="gatech" ariaLabel="School" />
  </div>
</Story>

<Story name="Async search">
  <div class="w-80">
    <SearchableSelect
      onSearch={searchSchools}
      placeholder="Find your school"
      searchPlaceholder="Type at least one letter…"
      ariaLabel="School (async)"
      allowCustom
    />
  </div>
</Story>

<Story name="Disabled and loading">
  <div class="flex w-80 flex-col gap-3">
    <SearchableSelect options={schools} value="howard" disabled ariaLabel="Disabled school" />
    <SearchableSelect options={[]} loading ariaLabel="Loading schools" placeholder="Loading schools…" />
  </div>
</Story>
