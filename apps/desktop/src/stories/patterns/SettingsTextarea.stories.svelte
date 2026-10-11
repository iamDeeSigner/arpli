<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SettingsTextarea from '$lib/components/patterns/settings/SettingsTextarea.svelte';
  import { SettingsFieldRow } from '$lib/components/patterns/settings';

  const { Story } = defineMeta({
    title: 'Patterns/SettingsTextarea',
    component: SettingsTextarea,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: {
      placeholder: 'Write a short bio for your applications…',
      disabled: false,
      autoResize: false,
      'aria-label': 'Short bio',
    },
    argTypes: {
      placeholder: { control: 'text' },
      disabled: { control: 'boolean' },
      autoResize: { control: 'boolean' },
      message: { control: 'text' },
      error: { control: 'text' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-[520px] rounded-(--radius-medium) bg-background p-4">
      <SettingsTextarea {...args} />
    </div>
  {/snippet}
</Story>

<Story name="In a settings row">
  {#snippet template()}
    <div class="w-[600px] rounded-(--radius-medium) bg-card px-4">
      <SettingsFieldRow
        id="bio-row"
        compact
        label="Short bio"
        htmlFor="bio-row-control"
        description="Two or three sentences, written in the first person."
      >
        {#snippet control({ labelId, descriptionId })}
          <SettingsTextarea
            id="bio-row-control"
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
            value="I’m a first-generation PhD candidate in computational linguistics, building speech tools for under-resourced West African languages."
          />
        {/snippet}
      </SettingsFieldRow>
    </div>
  {/snippet}
</Story>

<Story name="With message and error">
  {#snippet template()}
    <div class="flex w-[520px] flex-col gap-4 rounded-(--radius-medium) bg-card p-4">
      <SettingsTextarea aria-label="Personal statement" message="812 / 1,000 words" value="Growing up near the Niger Delta, I saw first-hand…" />
      <SettingsTextarea aria-label="Research summary" error="Research summary is required for fellowship applications." />
      <SettingsTextarea aria-label="Disabled" disabled value="Locked while the application is under review." />
    </div>
  {/snippet}
</Story>
