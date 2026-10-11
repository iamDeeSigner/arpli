<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import { CopyInput } from '$lib/components/ui/copy-input';

  const { Story } = defineMeta({
    title: 'Forms/CopyInput',
    component: CopyInput,
    tags: ['autodocs'],
    args: {
      value: 'https://arpli.app/r/recommend/9f2c-jordan-lee',
      variant: 'icon',
      align: 'right',
      size: 'default',
      disabled: false,
      onCopy: fn(),
    },
    argTypes: {
      variant: { control: 'inline-radio', options: ['icon', 'button'] },
      align: { control: 'inline-radio', options: ['right', 'left'] },
      size: { control: 'inline-radio', options: ['default', 'compact'] },
      disabled: { control: 'boolean' },
      label: { control: 'text' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-96">
      <CopyInput {...args} />
    </div>
  {/snippet}
</Story>

<Story name="Variants">
  {#snippet template()}
    <div class="flex w-96 flex-col gap-3">
      <CopyInput value="GATES-26-0419" />
      <CopyInput value="GATES-26-0419" variant="button" />
      <CopyInput value="https://arpli.app/r/recommend/9f2c" label="Recommender link" variant="button" />
      <CopyInput value="GATES-26-0419" align="left" />
      <CopyInput value="GATES-26-0419" size="compact" />
      <CopyInput value="GATES-26-0419" disabled />
    </div>
  {/snippet}
</Story>
