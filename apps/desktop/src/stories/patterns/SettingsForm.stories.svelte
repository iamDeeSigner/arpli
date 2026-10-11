<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { SettingsForm, defineSettings, defineSettingsCustomControls } from '$lib/components/patterns/settings';
  import SettingsTextarea from '$lib/components/patterns/settings/SettingsTextarea.svelte';
  import { arpliSettings } from './settings-fixtures';

  const { Story } = defineMeta({
    title: 'Patterns/SettingsForm',
    component: SettingsForm,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: {
      schema: arpliSettings,
      searchQuery: '',
      embedded: false,
      compact: true,
    },
    argTypes: {
      schema: { control: false },
      searchQuery: { control: 'text' },
      embedded: { control: 'boolean' },
      compact: { control: 'boolean' },
    },
  });

  const bioSchema = defineSettings({
    sections: [
      {
        id: 'about',
        title: 'About you',
        description: 'Arpli reuses this text when an application asks for a short bio.',
        entries: [
          {
            kind: 'custom',
            id: 'short-bio',
            label: 'Short bio',
            description: 'Two or three sentences, written in the first person.',
          },
          {
            kind: 'custom',
            id: 'research-summary',
            label: 'Research summary',
            layout: 'full-width',
          },
        ],
      },
    ],
  });
</script>

{#snippet bioControl(context: import('$lib/components/patterns/settings').SettingsControlContext)}
  <SettingsTextarea
    id={context.controlId}
    aria-labelledby={context.labelId}
    aria-describedby={context.descriptionId}
    disabled={context.disabled}
    value="I’m a master’s student in environmental engineering at TU Delft, researching low-cost water filtration for rural communities."
  />
{/snippet}

{#snippet researchControl(context: import('$lib/components/patterns/settings').SettingsControlContext)}
  <SettingsTextarea
    id={context.controlId}
    aria-label="Research summary"
    disabled={context.disabled}
    autoResize
    placeholder="Summarise your research focus for fellowship applications…"
  />
{/snippet}

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-[640px]">
      <SettingsForm {...args} />
    </div>
  {/snippet}
</Story>

<Story name="Wide rows (not compact)">
  {#snippet template()}
    <div class="w-[760px]">
      <SettingsForm schema={arpliSettings} compact={false} />
    </div>
  {/snippet}
</Story>

<Story name="Filtered by search">
  {#snippet template()}
    <div class="w-[640px]">
      <SettingsForm schema={arpliSettings} searchQuery="deadline" />
    </div>
  {/snippet}
</Story>

<Story name="Custom controls">
  {#snippet template()}
    <div class="w-[640px]">
      <SettingsForm
        schema={bioSchema}
        custom={defineSettingsCustomControls({
          'short-bio': bioControl,
          'research-summary': researchControl,
        })}
      />
    </div>
  {/snippet}
</Story>
