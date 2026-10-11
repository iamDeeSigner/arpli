<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Root as TableRoot } from '$lib/components/ui/table';
  import * as Table from '$lib/components/ui/table';
  import { Badge } from '$lib/components/ui/badge';

  const rows = [
    { name: 'Rhodes Scholarship', deadline: 'Oct 1, 2026', award: '£75,000', status: 'Submitted', color: 'green' },
    { name: 'Fulbright U.S. Student', deadline: 'Oct 14, 2026', award: '$40,000', status: 'Draft', color: 'gray' },
    { name: 'Marshall Scholarship', deadline: 'Oct 28, 2026', award: '£60,000', status: 'In review', color: 'blue' },
    { name: 'Truman Scholarship', deadline: 'Feb 3, 2027', award: '$30,000', status: 'Not started', color: 'amber' },
  ] as const;

  // Table.Cell's props type omits td-only attributes; spread to set colspan.
  const span3 = { colspan: 3 };

  const { Story } = defineMeta({
    title: 'Layout/Table',
    component: TableRoot,
    tags: ['autodocs'],
  });
</script>

<Story name="Applications">
  <div class="w-[40rem]">
    <Table.Root>
      <Table.Caption>Your applications for the 2026–27 cycle.</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Opportunity</Table.Head>
          <Table.Head>Deadline</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head class="text-right">Award</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each rows as row (row.name)}
          <Table.Row>
            <Table.Cell class="font-medium">{row.name}</Table.Cell>
            <Table.Cell>{row.deadline}</Table.Cell>
            <Table.Cell><Badge color={row.color}>{row.status}</Badge></Table.Cell>
            <Table.Cell class="text-right tabular-nums">{row.award}</Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell {...span3}>Potential funding</Table.Cell>
          <Table.Cell class="text-right tabular-nums">$270,000</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table.Root>
  </div>
</Story>

<Story name="Empty">
  <div class="w-[40rem]">
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head>Opportunity</Table.Head>
          <Table.Head>Deadline</Table.Head>
          <Table.Head>Status</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell {...span3} class="h-24 text-center text-muted-foreground">
            No applications yet. Save an opportunity to get started.
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  </div>
</Story>
