<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MicButton from '$lib/components/voice/MicButton.svelte';
  import { Input } from '$lib/components/ui/input';

  const { Story } = defineMeta({
    title: 'Arpli/MicButton',
    component: MicButton,
    tags: ['autodocs'],
    args: { disabled: false, appendToValue: false },
    argTypes: {
      disabled: { control: 'boolean' },
      appendToValue: { control: 'boolean' },
      value: { control: 'text' },
    },
    parameters: {
      docs: {
        description: {
          component:
            'Idle state only. Recording needs the Electron bridge (`window.arpli`) or the local daemon for Whisper, or Web Speech recognition and microphone permission, none of which are available in Storybook.',
        },
      },
    },
  });
</script>

<Story name="Idle">
  {#snippet template(args)}
    <MicButton {...args} />
  {/snippet}
</Story>

<Story name="Disabled">
  {#snippet template()}
    <MicButton disabled />
  {/snippet}
</Story>

<Story name="Next to a profile field">
  {#snippet template()}
    <div class="flex w-[420px] items-center gap-2">
      <Input aria-label="Describe your research" placeholder="Describe your research in a sentence…" />
      <MicButton appendToValue />
    </div>
  {/snippet}
</Story>
