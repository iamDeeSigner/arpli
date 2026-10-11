<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Header from '$lib/components/ui/Header.svelte';

  const { Story } = defineMeta({
    title: 'Layout/Header',
    component: Header,
    tags: ['autodocs'],
    args: { size: 1 },
    argTypes: { size: { control: 'select', options: [1, 2, 3, 4, 5, 6] } },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <Header {...args}>Your applications</Header>
  {/snippet}
</Story>

<Story name="Sizes">
  <div class="flex flex-col gap-3">
    {#each [1, 2, 3, 4, 5, 6] as const as size (size)}
      <Header {size}>h{size} · Scholarships closing this month</Header>
    {/each}
  </div>
</Story>
