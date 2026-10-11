<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { SettingsDisclosure, SettingsFieldRow } from '$lib/components/patterns/settings';
  import { Switch } from '$lib/components/ui/switch';

  const { Story } = defineMeta({
    title: 'Patterns/SettingsDisclosure',
    component: SettingsDisclosure,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: { label: 'Advanced matching options', flush: false, muted: false },
    argTypes: {
      label: { control: 'text' },
      flush: { control: 'boolean' },
      muted: { control: 'boolean' },
    },
  });
</script>

{#snippet advancedRows()}
  <div class="divide-y divide-border px-2">
    <SettingsFieldRow
      id="disc-international"
      label="Include international opportunities"
      description="Show scholarships open to applicants outside your country of residence."
    >
      {#snippet control({ labelId })}<Switch checked ariaLabelledby={labelId} />{/snippet}
    </SettingsFieldRow>
    <SettingsFieldRow
      id="disc-closed"
      label="Show recently closed calls"
      description="Useful for planning next year’s applications."
    >
      {#snippet control({ labelId })}<Switch ariaLabelledby={labelId} />{/snippet}
    </SettingsFieldRow>
  </div>
{/snippet}

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-[600px] rounded-(--radius-medium) bg-card p-4">
      <SettingsDisclosure {...args}>
        {@render advancedRows()}
      </SettingsDisclosure>
    </div>
  {/snippet}
</Story>

<Story name="Muted and flush">
  {#snippet template()}
    <div class="w-[600px] rounded-(--radius-medium) bg-card p-4">
      <SettingsDisclosure label="More options" muted flush>
        {@render advancedRows()}
      </SettingsDisclosure>
    </div>
  {/snippet}
</Story>
