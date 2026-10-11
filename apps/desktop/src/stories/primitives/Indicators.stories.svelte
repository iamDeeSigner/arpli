<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Spinner, UnsavedIndicator } from '$lib/components/ui/indicators';

  const { Story } = defineMeta({
    title: 'Primitives/Indicators',
    component: Spinner,
    tags: ['autodocs'],
    args: { size: 24, playing: true },
    argTypes: {
      size: { control: { type: 'range', min: 12, max: 48, step: 2 } },
      playing: { control: 'boolean' },
    },
  });
</script>

<Story name="Spinner playground">
  {#snippet template(args)}
    <Spinner {...args} />
  {/snippet}
</Story>

<Story name="Spinner sizes">
  <div class="flex items-center gap-4 text-muted-foreground">
    <Spinner size={12} />
    <Spinner size={16} />
    <Spinner size={18} />
    <Spinner size={24} />
    <Spinner size={32} class="text-primary" />
    <Spinner size={24} playing={false} />
  </div>
</Story>

<Story name="Unsaved indicator">
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <span class="type-body">Personal statement</span>
      <UnsavedIndicator visible />
    </div>
    <div class="flex items-center gap-2">
      <span class="type-body">Activities list</span>
      <UnsavedIndicator visible={false} />
    </div>
  </div>
</Story>
