<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Separator } from '$lib/components/ui/separator';

  const { Story } = defineMeta({
    title: 'Primitives/Separator',
    component: Separator,
    tags: ['autodocs'],
    args: { orientation: 'horizontal' },
    argTypes: { orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] } },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="flex h-24 w-64 items-center justify-center">
      <Separator {...args} />
    </div>
  {/snippet}
</Story>

<Story name="Horizontal">
  {#snippet template()}
    <div class="flex w-72 flex-col gap-3">
      <div>
        <p class="type-body font-medium">Knight-Hennessy Scholars</p>
        <p class="type-caption text-muted-foreground">Graduate fellowship · Stanford</p>
      </div>
      <Separator />
      <p class="type-caption text-muted-foreground">Deadline: October 8, 2026</p>
    </div>
  {/snippet}
</Story>

<Story name="Vertical">
  {#snippet template()}
    <div class="type-caption flex h-5 items-center gap-3 text-muted-foreground">
      <span>Scholarships</span>
      <Separator orientation="vertical" />
      <span>Grants</span>
      <Separator orientation="vertical" />
      <span>Fellowships</span>
    </div>
  {/snippet}
</Story>
