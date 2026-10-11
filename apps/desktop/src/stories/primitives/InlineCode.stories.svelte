<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { InlineCode } from '$lib/components/ui/inline-code';

  const { Story } = defineMeta({
    title: 'Primitives/InlineCode',
    component: InlineCode,
    tags: ['autodocs'],
  });
</script>

<Story name="Playground">
  <InlineCode>FAFSA-2027</InlineCode>
</Story>

<Story name="In a sentence">
  <p class="type-body max-w-md text-foreground">
    Paste your application ID <InlineCode>GATES-26-0419</InlineCode> into the portal, and name your
    transcript file <InlineCode>lastname_transcript.pdf</InlineCode> before uploading.
  </p>
</Story>
