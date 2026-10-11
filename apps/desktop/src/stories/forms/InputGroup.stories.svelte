<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { InputGroup } from '$lib/components/ui/input-group';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import MagnifyingGlassIcon from 'phosphor-svelte/lib/MagnifyingGlassIcon';
  import CurrencyDollarIcon from 'phosphor-svelte/lib/CurrencyDollarIcon';
  import XIcon from 'phosphor-svelte/lib/XIcon';

  const { Story } = defineMeta({
    title: 'Forms/InputGroup',
    component: InputGroup,
    tags: ['autodocs'],
    args: { size: 'default', disabled: false, invalid: false },
    argTypes: {
      size: { control: 'inline-radio', options: ['default', 'compact'] },
      disabled: { control: 'boolean' },
      invalid: { control: 'boolean' },
      message: { control: 'text' },
      error: { control: 'text' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template({ children: _children, ...args })}
    <div class="w-80">
      <InputGroup {...args}>
        {#snippet leading()}<MagnifyingGlassIcon class="size-4" />{/snippet}
        <Input placeholder="Search scholarships" aria-label="Search scholarships" disabled={args.disabled} />
      </InputGroup>
    </div>
  {/snippet}
</Story>

<Story name="Addons">
  {#snippet template()}
    <div class="flex w-80 flex-col gap-4">
      <InputGroup>
        {#snippet leading()}<CurrencyDollarIcon class="size-4" />{/snippet}
        <Input type="number" placeholder="10,000" aria-label="Award amount" />
        {#snippet trailing()}<span class="type-caption">USD</span>{/snippet}
      </InputGroup>
      <InputGroup>
        {#snippet leading()}<span class="type-caption">https://</span>{/snippet}
        <Input placeholder="apply.fulbright.org" aria-label="Application portal" />
      </InputGroup>
      <InputGroup>
        {#snippet leading()}<MagnifyingGlassIcon class="size-4" />{/snippet}
        <Input value="Rhodes" aria-label="Search" />
        {#snippet trailing()}
          <Button variant="ghost" size="icon" aria-label="Clear search"><XIcon /></Button>
        {/snippet}
      </InputGroup>
    </div>
  {/snippet}
</Story>

<Story name="Message and error">
  {#snippet template()}
    <div class="flex w-80 flex-col gap-4">
      <InputGroup message="Most undergraduate awards are under $20,000.">
        {#snippet leading()}<CurrencyDollarIcon class="size-4" />{/snippet}
        <Input type="number" placeholder="Award amount" aria-label="Award amount" />
      </InputGroup>
      <InputGroup error="Amount must be a positive number.">
        {#snippet leading()}<CurrencyDollarIcon class="size-4" />{/snippet}
        <Input value="-250" aria-label="Award amount" aria-invalid="true" />
      </InputGroup>
      <InputGroup disabled>
        {#snippet leading()}<CurrencyDollarIcon class="size-4" />{/snippet}
        <Input value="7500" disabled aria-label="Award amount" />
      </InputGroup>
    </div>
  {/snippet}
</Story>
