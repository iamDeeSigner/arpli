<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import { ListRow, ListView, RowActions } from '$lib/components/patterns/collection';
  import { EmptyState } from '$lib/components/patterns/screen';
  import { Badge } from '$lib/components/ui/badge';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import GraduationCapIcon from 'phosphor-svelte/lib/GraduationCapIcon';
  import { opportunities, type OpportunityRow } from './collection-fixtures';
  import { applicationActions } from './action-fixtures';

  const { Story } = defineMeta({
    title: 'Patterns/ListView',
    component: ListView,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: {
      selectable: 'single',
      status: 'ready',
      ariaLabel: 'Opportunities',
      onActivate: fn(),
    },
    argTypes: {
      selectable: { control: 'inline-radio', options: [false, 'single', 'multi'] },
      status: { control: 'inline-radio', options: ['ready', 'loading', 'error'] },
      stateDensity: { control: 'inline-radio', options: ['default', 'compact'] },
      ariaLabel: { control: 'text' },
    },
  });

  const statusColor = {
    Draft: 'amber',
    'In progress': 'blue',
    Submitted: 'green',
    'Not started': 'gray',
  } as const;

  const getKey = (item: OpportunityRow) => item.id;
  const getText = (item: OpportunityRow) => item.name;
  const none: OpportunityRow[] = [];
</script>

{#snippet opportunityRow(item: OpportunityRow)}
  <ListRow>
    {#snippet leading()}<GraduationCapIcon class="size-4 text-muted-foreground" aria-hidden="true" />{/snippet}
    {#snippet title()}{item.name}{/snippet}
    {#snippet meta()}Due {item.deadline}{/snippet}
    {#snippet description()}{item.funder} · {item.amount}{/snippet}
    {#snippet trailing()}<Badge variant="dot" color={statusColor[item.status]} size="sm">{item.status}</Badge>{/snippet}
  </ListRow>
{/snippet}

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-[560px] rounded-(--radius-large) border border-border bg-card py-1">
      <ListView {...args} items={opportunities} {getKey} {getText}>
        {#snippet row({ item })}{@render opportunityRow(item)}{/snippet}
      </ListView>
    </div>
  {/snippet}
</Story>

<Story name="Multi-select with checkboxes">
  {#snippet template()}
    <div class="w-[560px] rounded-(--radius-large) border border-border bg-card py-1">
      <ListView
        items={opportunities}
        {getKey}
        {getText}
        selectable="multi"
        selectionAppearance="indicator"
        selectedKeys={['gates', 'nsf']}
        ariaLabel="Opportunities to compare"
      >
        {#snippet row({ item, selected })}
          <ListRow>
            {#snippet leading()}<Checkbox checked={selected} tabindex={-1} aria-hidden="true" />{/snippet}
            {#snippet title()}{item.name}{/snippet}
            {#snippet description()}{item.kind} · {item.amount}{/snippet}
          </ListRow>
        {/snippet}
      </ListView>
    </div>
  {/snippet}
</Story>

<Story name="With row actions">
  {#snippet template()}
    <div class="w-[600px] rounded-(--radius-large) border border-border bg-card py-1">
      <ListView items={opportunities.slice(0, 4)} {getKey} {getText} ariaLabel="Applications">
        {#snippet row({ item })}
          <ListRow>
            {#snippet title()}{item.name}{/snippet}
            {#snippet description()}Due {item.deadline} · {item.status}{/snippet}
            {#snippet trailing()}
              <RowActions actions={applicationActions} visibleCount={2} overflowLabel={`Actions for ${item.name}`} onAction={() => {}} />
            {/snippet}
          </ListRow>
        {/snippet}
      </ListView>
    </div>
  {/snippet}
</Story>

<Story name="Loading, error and empty">
  {#snippet template()}
    <div class="grid w-[560px] gap-4">
      <div class="rounded-(--radius-large) border border-border bg-card">
        <ListView items={opportunities} {getKey} status="loading" ariaLabel="Loading opportunities">
          {#snippet row({ item })}{@render opportunityRow(item)}{/snippet}
        </ListView>
      </div>
      <div class="rounded-(--radius-large) border border-border bg-card">
        <ListView items={none} {getKey} status="error" ariaLabel="Opportunities">
          {#snippet row({ item })}{@render opportunityRow(item)}{/snippet}
          {#snippet error()}
            <p class="type-caption p-4 text-danger">Couldn’t load opportunities. Check your connection.</p>
          {/snippet}
        </ListView>
      </div>
      <div class="rounded-(--radius-large) border border-border bg-card">
        <ListView items={none} {getKey} ariaLabel="Saved opportunities">
          {#snippet row({ item })}{@render opportunityRow(item)}{/snippet}
          {#snippet empty()}
            <EmptyState density="compact">
              {#snippet title()}No saved opportunities yet{/snippet}
            </EmptyState>
          {/snippet}
        </ListView>
      </div>
    </div>
  {/snippet}
</Story>
