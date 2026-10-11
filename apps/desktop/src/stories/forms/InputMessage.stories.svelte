<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { InputMessage } from '$lib/components/ui/input-message';

  const { Story } = defineMeta({
    title: 'Forms/InputMessage',
    component: InputMessage,
    tags: ['autodocs'],
    args: { tone: 'helper' },
    argTypes: { tone: { control: 'inline-radio', options: ['helper', 'error'] } },
  });
</script>

<Story name="Playground">
  {#snippet template({ children: _children, ...args })}
    <div class="w-80">
      <InputMessage {...args}>Recommenders receive a link by email once you submit.</InputMessage>
    </div>
  {/snippet}
</Story>

<Story name="Tones">
  {#snippet template()}
    <div class="flex w-80 flex-col">
      <InputMessage tone="helper">Use the name that appears on your transcript.</InputMessage>
      <InputMessage tone="error">Your essay is 712 words; the limit is 650.</InputMessage>
    </div>
  {/snippet}
</Story>
