<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  const { Story } = defineMeta({
    title: 'Forms/Input',
    component: Input,
    tags: ['autodocs'],
    args: {
      placeholder: 'e.g. Gates Millennium Scholars',
      size: 'default',
      disabled: false,
      message: '',
      error: '',
    },
    argTypes: {
      size: { control: 'inline-radio', options: ['default', 'compact'] },
      disabled: { control: 'boolean' },
      message: { control: 'text' },
      error: { control: 'text' },
      type: { control: 'select', options: ['text', 'email', 'url', 'number', 'date', 'password', 'search'] },
    },
  });
</script>

<Story name="Playground">
  {#snippet template({ message, error, ...args })}
    <div class="w-80">
      <Input {...args} message={message || undefined} error={error || undefined} aria-label="Opportunity name" />
    </div>
  {/snippet}
</Story>

<Story name="Sizes">
  <div class="flex w-80 flex-col gap-3">
    <Input size="default" placeholder="Default (36px)" aria-label="Default input" />
    <Input size="compact" placeholder="Compact (28px)" aria-label="Compact input" />
  </div>
</Story>

<Story name="Message and error">
  <div class="flex w-80 flex-col gap-4">
    <div class="flex flex-col gap-1.5">
      <Label for="input-award">Award amount</Label>
      <Input id="input-award" type="number" value="5000" message="Enter the amount in US dollars." />
    </div>
    <div class="flex flex-col gap-1.5">
      <Label for="input-deadline" invalid>Deadline</Label>
      <Input id="input-deadline" value="2026-02-30" error="That date doesn't exist. Use YYYY-MM-DD." />
    </div>
  </div>
</Story>

<Story name="Disabled">
  <div class="flex w-80 flex-col gap-3">
    <Input disabled placeholder="Locked after submission" aria-label="Disabled empty" />
    <Input disabled value="Coca-Cola Scholars Program" aria-label="Disabled filled" />
  </div>
</Story>

<Story name="Types">
  <div class="grid w-96 grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3">
    <Label for="t-email">Email</Label>
    <Input id="t-email" type="email" placeholder="you@university.edu" />
    <Label for="t-url">Portal URL</Label>
    <Input id="t-url" type="url" placeholder="https://apply.example.org" />
    <Label for="t-number">Essay word limit</Label>
    <Input id="t-number" type="number" placeholder="650" />
    <Label for="t-date">Deadline</Label>
    <Input id="t-date" type="date" />
    <Label for="t-password">Portal password</Label>
    <Input id="t-password" type="password" value="hunter2hunter2" />
    <Label for="t-search">Search</Label>
    <Input id="t-search" type="search" placeholder="Search opportunities" />
  </div>
</Story>
