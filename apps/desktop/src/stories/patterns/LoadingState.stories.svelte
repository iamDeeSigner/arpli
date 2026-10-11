<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { LoadingState } from '$lib/components/patterns/screen';

  const { Story } = defineMeta({
    title: 'Patterns/LoadingState',
    component: LoadingState,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: {
      recipe: 'list',
      count: 3,
      label: 'Loading opportunities',
      density: 'default',
      inset: false,
    },
    argTypes: {
      recipe: { control: 'inline-radio', options: ['list', 'card-grid', 'form'] },
      count: { control: { type: 'number', min: 1, max: 12 } },
      density: { control: 'inline-radio', options: ['default', 'compact'] },
      label: { control: 'text' },
      inset: { control: 'boolean' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-[560px] rounded-(--radius-large) border border-border bg-card">
      <LoadingState {...args} />
    </div>
  {/snippet}
</Story>

<Story name="List">
  {#snippet template()}
    <div class="w-[560px] rounded-(--radius-large) border border-border bg-card">
      <LoadingState recipe="list" count={5} label="Loading applications" />
    </div>
  {/snippet}
</Story>

<Story name="Card grid">
  {#snippet template()}
    <div class="w-[720px]">
      <LoadingState recipe="card-grid" count={6} label="Loading recommended scholarships" />
    </div>
  {/snippet}
</Story>

<Story name="Form">
  {#snippet template()}
    <div class="w-[560px] rounded-(--radius-large) border border-border bg-card">
      <LoadingState recipe="form" count={4} label="Loading profile section" />
    </div>
  {/snippet}
</Story>

<Story name="Compact list">
  {#snippet template()}
    <div class="w-[360px] rounded-(--radius-large) border border-border bg-card">
      <LoadingState recipe="list" density="compact" count={4} label="Loading deadlines" />
    </div>
  {/snippet}
</Story>
