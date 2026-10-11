<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Label } from '$lib/components/ui/label';
  import { Input } from '$lib/components/ui/input';

  const { Story } = defineMeta({
    title: 'Forms/Label',
    component: Label,
    tags: ['autodocs'],
    args: { size: 'default', invalid: false },
    argTypes: {
      size: { control: 'inline-radio', options: ['default', 'compact'] },
      invalid: { control: 'boolean' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <Label {...args}>Preferred name</Label>
  {/snippet}
</Story>

<Story name="With input">
  {#snippet template()}
    <div class="flex w-72 flex-col gap-1.5">
      <Label for="label-gpa">Cumulative GPA</Label>
      <Input id="label-gpa" placeholder="e.g. 3.85" inputmode="decimal" />
    </div>
  {/snippet}
</Story>

<Story name="Invalid">
  {#snippet template()}
    <div class="flex w-72 flex-col gap-1.5">
      <Label for="label-email" invalid>School email</Label>
      <Input id="label-email" value="jordan@" error="Enter a full .edu address." />
    </div>
  {/snippet}
</Story>
