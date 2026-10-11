<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Label } from '$lib/components/ui/label';

  const { Story } = defineMeta({
    title: 'Forms/Textarea',
    component: Textarea,
    tags: ['autodocs'],
    args: {
      placeholder: 'Describe a challenge you overcame and what you learned…',
      size: 'default',
      autoResize: false,
      disabled: false,
      message: '',
      error: '',
    },
    argTypes: {
      size: { control: 'inline-radio', options: ['default', 'compact'] },
      autoResize: { control: 'boolean' },
      disabled: { control: 'boolean' },
      minHeight: { control: 'number' },
      maxHeight: { control: 'number' },
      message: { control: 'text' },
      error: { control: 'text' },
    },
  });
</script>

<script lang="ts">
  let essay = $state(
    'Growing up in a town without a public library, I learned to treat every borrowed book as a small loan of possibility.',
  );
</script>

<Story name="Playground">
  {#snippet template({ message, error, ...args })}
    <div class="w-96">
      <Textarea {...args} message={message || undefined} error={error || undefined} aria-label="Essay" />
    </div>
  {/snippet}
</Story>

<Story name="Auto resize">
  <div class="flex w-96 flex-col gap-1.5">
    <Label for="ta-auto">Personal statement</Label>
    <Textarea
      id="ta-auto"
      bind:value={essay}
      autoResize
      minHeight={60}
      maxHeight={240}
      message="Keep typing — the field grows up to 240px, then scrolls."
    />
  </div>
</Story>

<Story name="Message and error">
  <div class="flex w-96 flex-col gap-4">
    <div class="flex flex-col gap-1.5">
      <Label for="ta-msg">Why this fellowship?</Label>
      <Textarea id="ta-msg" message="250 words maximum." />
    </div>
    <div class="flex flex-col gap-1.5">
      <Label for="ta-err" invalid>Community impact</Label>
      <Textarea id="ta-err" value="TBD" error="Please write at least 100 words." />
    </div>
    <Textarea disabled value="Submitted on Jan 12, 2026 — editing is locked." aria-label="Locked essay" />
  </div>
</Story>
