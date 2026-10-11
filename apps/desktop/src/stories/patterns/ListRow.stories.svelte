<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ListRow, RowActions } from '$lib/components/patterns/collection';
  import { Badge } from '$lib/components/ui/badge';
  import * as Card from '$lib/components/ui/card';
  import FileTextIcon from 'phosphor-svelte/lib/FileTextIcon';
  import TrophyIcon from 'phosphor-svelte/lib/TrophyIcon';
  import { applicationActions } from './action-fixtures';

  const { Story } = defineMeta({
    title: 'Patterns/ListRow',
    component: ListRow,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: { inset: false },
    argTypes: { inset: { control: 'boolean' } },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-[520px] rounded-(--radius-medium) bg-card">
      <ListRow {...args}>
        {#snippet leading()}<FileTextIcon class="size-4 text-muted-foreground" aria-hidden="true" />{/snippet}
        {#snippet title()}Personal statement — Gates Cambridge{/snippet}
        {#snippet meta()}Edited 2h ago{/snippet}
        {#snippet description()}812 of 1,000 words · Draft{/snippet}
        {#snippet trailing()}<Badge variant="dot" color="amber" size="sm">Draft</Badge>{/snippet}
      </ListRow>
    </div>
  {/snippet}
</Story>

<Story name="Title only and long content">
  {#snippet template()}
    <div class="w-[420px] divide-y divide-border rounded-(--radius-medium) bg-card">
      <ListRow>
        {#snippet title()}Transcript.pdf{/snippet}
      </ListRow>
      <ListRow>
        {#snippet leading()}<TrophyIcon class="size-4 text-muted-foreground" aria-hidden="true" />{/snippet}
        {#snippet title()}Marshall Scholarship for postgraduate study in the United Kingdom, any discipline{/snippet}
        {#snippet meta()}Due Sep 30{/snippet}
        {#snippet description()}
          Funds up to two years of graduate study at any UK institution, including tuition, living
          expenses and travel. Requires university endorsement.
        {/snippet}
      </ListRow>
    </div>
  {/snippet}
</Story>

<Story name="With RowActions in a card">
  {#snippet template()}
    <Card.Root class="w-[560px]">
      <Card.Header>
        <Card.Title>Applications</Card.Title>
      </Card.Header>
      <div class="divide-y divide-border">
        {#each ['Gates Cambridge Scholarship', 'NSF Graduate Research Fellowship'] as name (name)}
          <ListRow inset>
            {#snippet title()}{name}{/snippet}
            {#snippet description()}In progress{/snippet}
            {#snippet trailing()}
              <RowActions actions={applicationActions} visibleCount={1} alwaysVisible overflowLabel={`Actions for ${name}`} onAction={() => {}} />
            {/snippet}
          </ListRow>
        {/each}
      </div>
    </Card.Root>
  {/snippet}
</Story>
