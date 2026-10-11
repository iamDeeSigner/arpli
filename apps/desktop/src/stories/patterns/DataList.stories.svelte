<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { DataList, type DataListItem } from '$lib/components/patterns/collection';
  import { Badge } from '$lib/components/ui/badge';

  const items: DataListItem[] = [
    { key: 'funder', label: 'Funder', value: 'Gates Cambridge Trust' },
    { key: 'amount', label: 'Award', value: 'Full cost of study + £21,000 / yr maintenance' },
    { key: 'deadline', label: 'Deadline', value: 'Oct 14, 2026', description: 'US applicants: Oct 8, 2026' },
    { key: 'eligibility', label: 'Eligibility', value: 'Citizens of any country outside the UK' },
    { key: 'status', label: 'Status', value: 'Draft' },
  ];

  const { Story } = defineMeta({
    title: 'Patterns/DataList',
    component: DataList,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: { items },
    argTypes: { items: { control: 'object' } },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-[520px]"><DataList {...args} /></div>
  {/snippet}
</Story>

<Story name="Custom value rendering">
  {#snippet template()}
    <div class="w-[520px]">
      <DataList {items}>
        {#snippet value(item)}
          {#if item.key === 'status'}
            <Badge variant="dot" color="amber" size="sm">{item.value}</Badge>
          {:else}
            {item.value}
          {/if}
        {/snippet}
      </DataList>
    </div>
  {/snippet}
</Story>
