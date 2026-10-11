<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import { FileInput } from '$lib/components/ui/file-input';
  import { Label } from '$lib/components/ui/label';

  const { Story } = defineMeta({
    title: 'Forms/FileInput',
    component: FileInput,
    tags: ['autodocs'],
    args: {
      id: 'file-playground',
      accept: '.pdf',
      multiple: false,
      disabled: false,
      busy: false,
      invalid: false,
      variant: 'default',
      size: 'default',
      onFilesChange: fn(),
    },
    argTypes: {
      variant: { control: 'inline-radio', options: ['default', 'flat'] },
      size: { control: 'inline-radio', options: ['default', 'compact'] },
      multiple: { control: 'boolean' },
      disabled: { control: 'boolean' },
      busy: { control: 'boolean' },
      invalid: { control: 'boolean' },
      message: { control: 'text' },
      error: { control: 'text' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-96">
      <FileInput {...args} />
    </div>
  {/snippet}
</Story>

<Story name="States">
  <div class="flex w-96 flex-col gap-4">
    <div class="flex flex-col gap-1.5">
      <Label for="file-transcript">Official transcript</Label>
      <FileInput id="file-transcript" accept=".pdf" message="PDF, up to 10 MB." />
    </div>
    <div class="flex flex-col gap-1.5">
      <Label for="file-samples">Writing samples</Label>
      <FileInput id="file-samples" multiple accept=".pdf,.docx" label="Choose files" emptyText="No samples added" />
    </div>
    <div class="flex flex-col gap-1.5">
      <Label for="file-resume" invalid>Résumé</Label>
      <FileInput id="file-resume" error="Résumé must be a PDF." />
    </div>
    <FileInput id="file-busy" busy />
    <FileInput id="file-flat" variant="flat" />
    <FileInput id="file-disabled" disabled />
  </div>
</Story>
