<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import { MessageComposer } from '$lib/components/ui/message-composer';
  import { Button } from '$lib/components/ui/button';
  import PaperclipIcon from 'phosphor-svelte/lib/PaperclipIcon';

  const { Story } = defineMeta({
    title: 'Patterns/MessageComposer',
    component: MessageComposer,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: {
      placeholder: 'Ask Arpli to draft, shorten or tailor an answer…',
      size: 'default',
      disabled: false,
      minRows: 1,
      maxRows: 8,
      sendLabel: 'Send',
      onSend: fn(),
    },
    argTypes: {
      size: { control: 'inline-radio', options: ['compact', 'default'] },
      placeholder: { control: 'text' },
      disabled: { control: 'boolean' },
      minRows: { control: { type: 'number', min: 1, max: 6 } },
      maxRows: { control: { type: 'number', min: 1, max: 16 } },
      sendLabel: { control: 'text' },
      placeholderSuggestion: { control: 'text' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-[560px]"><MessageComposer {...args} /></div>
  {/snippet}
</Story>

<Story name="With suggestions">
  {#snippet template()}
    <div class="w-[560px]">
      <MessageComposer
        placeholder="What should Arpli help with?"
        suggestions={[
          'Draft a 250-word answer to “Describe a challenge you overcame”',
          'Tailor my personal statement for the Rhodes Scholarship',
          'Which opportunities close in the next two weeks?',
        ]}
        onSend={() => {}}
      />
    </div>
  {/snippet}
</Story>

<Story name="Ghost suggestion and history">
  {#snippet template()}
    <div class="w-[560px]">
      <MessageComposer
        placeholderSuggestion="Shorten my leadership essay to 300 words"
        history={['Summarise the DAAD eligibility rules', 'List documents I still need for Fulbright']}
        onSend={() => {}}
      />
    </div>
  {/snippet}
</Story>

<Story name="Attachments slot">
  {#snippet template()}
    <div class="w-[560px]">
      <MessageComposer
        placeholder="Attach a transcript or CV and ask a question about it…"
        files={[]}
        onFilesChange={() => {}}
        onSend={() => {}}
      >
        {#snippet leftSlot({ openFilePicker })}
          <Button variant="ghost-light" size="icon-sm" iconOnly aria-label="Attach file" tooltip="Attach file" onclick={() => openFilePicker()}>
            <PaperclipIcon />
          </Button>
        {/snippet}
      </MessageComposer>
    </div>
  {/snippet}
</Story>

<Story name="Streaming and disabled">
  {#snippet template()}
    <div class="flex w-[560px] flex-col gap-4">
      <MessageComposer value="Tailor this for the NSF GRFP" status="streaming" onStop={() => {}} onSend={() => {}} />
      <MessageComposer disabled placeholder="Connect an AI provider in Settings to draft answers" />
    </div>
  {/snippet}
</Story>
