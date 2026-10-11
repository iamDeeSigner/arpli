<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { Label } from '$lib/components/ui/label';

  const { Story } = defineMeta({
    title: 'Forms/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
    args: {
      checked: false,
      indeterminate: false,
      disabled: false,
      invalid: false,
      size: 'md',
      ariaLabel: 'I meet the eligibility requirements',
      onCheckedChange: fn(),
    },
    argTypes: {
      size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
      checked: { control: 'boolean' },
      indeterminate: { control: 'boolean' },
      disabled: { control: 'boolean' },
      invalid: { control: 'boolean' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <Checkbox {...args} />
  {/snippet}
</Story>

<Story name="States">
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-2">
      <Checkbox id="cb-1" />
      <Label for="cb-1">Unchecked</Label>
    </div>
    <div class="flex items-center gap-2">
      <Checkbox id="cb-2" checked />
      <Label for="cb-2">Checked</Label>
    </div>
    <div class="flex items-center gap-2">
      <Checkbox id="cb-3" indeterminate />
      <Label for="cb-3">Indeterminate</Label>
    </div>
    <div class="flex items-center gap-2">
      <Checkbox id="cb-4" invalid required />
      <Label for="cb-4" invalid>I certify this information is accurate (required)</Label>
    </div>
    <div class="flex items-center gap-2">
      <Checkbox id="cb-5" disabled />
      <Label for="cb-5">Disabled</Label>
    </div>
    <div class="flex items-center gap-2">
      <Checkbox id="cb-6" disabled checked />
      <Label for="cb-6">Disabled checked</Label>
    </div>
  </div>
</Story>

<Story name="Sizes">
  <div class="flex items-center gap-4">
    <Checkbox size="sm" checked ariaLabel="Small" />
    <Checkbox size="md" checked ariaLabel="Medium" />
    <Checkbox size="lg" checked ariaLabel="Large" />
  </div>
</Story>
