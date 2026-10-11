<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EditableName from '$lib/components/ui/EditableName.svelte';
  import EditableNameDemo from './EditableNameDemo.svelte';
  import { fn } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Layout/EditableName',
    component: EditableName,
    tags: ['autodocs'],
    args: {
      value: 'Fulbright statement of purpose',
      placeholder: 'Untitled draft',
      disabled: false,
      maxWidth: 240,
      onSave: fn(),
    },
    argTypes: {
      disabled: { control: 'boolean' },
      maxWidth: { control: { type: 'number', min: 80, max: 480 } },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <EditableName {...args} />
  {/snippet}
</Story>

<Story name="Click to rename">
  <EditableNameDemo />
</Story>

<Story name="Title size">
  <EditableNameDemo initial="Gates Cambridge application" textClass="type-title font-bold" maxWidth={400} />
</Story>

<Story name="Empty and disabled">
  <div class="flex flex-col gap-4">
    <EditableNameDemo initial="" />
    <EditableNameDemo initial="Submitted — locked" disabled />
  </div>
</Story>
