<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { SettingsFieldRow, SettingsSection } from '$lib/components/patterns/settings';
  import { Switch } from '$lib/components/ui/switch';
  import { Button } from '$lib/components/ui/button';

  const { Story } = defineMeta({
    title: 'Patterns/SettingsSection',
    component: SettingsSection,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: {
      id: 'notifications',
      title: 'Notifications',
      description: 'Decide when Arpli nudges you about upcoming deadlines.',
      busy: false,
    },
    argTypes: {
      title: { control: 'text' },
      description: { control: 'text' },
      error: { control: 'text' },
      busy: { control: 'boolean' },
    },
  });
</script>

{#snippet rows()}
  <div class="px-4">
    <SettingsFieldRow
      id="sec-reminders"
      label="Deadline reminders"
      description="Get a desktop notification before an application is due."
    >
      {#snippet control({ labelId })}<Switch checked ariaLabelledby={labelId} />{/snippet}
    </SettingsFieldRow>
  </div>
  <div class="px-4">
    <SettingsFieldRow
      id="sec-digest"
      label="Weekly opportunity digest"
      description="A Monday summary of new scholarships that match your profile."
    >
      {#snippet control({ labelId })}<Switch ariaLabelledby={labelId} />{/snippet}
    </SettingsFieldRow>
  </div>
{/snippet}

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-[640px]">
      <SettingsSection {...args}>
        {@render rows()}
      </SettingsSection>
    </div>
  {/snippet}
</Story>

<Story name="With actions">
  {#snippet template()}
    <div class="w-[640px]">
      <SettingsSection
        id="references"
        title="Referees"
        description="People Arpli can list on applications that ask for references."
      >
        {#snippet actions()}<Button size="sm" variant="secondary">Add referee</Button>{/snippet}
        <div class="px-4">
          <SettingsFieldRow id="ref-1" label="Dr. Amara Nwosu" description="Thesis supervisor · Imperial College London">
            {#snippet control()}<Button size="sm" variant="ghost">Edit</Button>{/snippet}
          </SettingsFieldRow>
        </div>
        <div class="px-4">
          <SettingsFieldRow id="ref-2" label="Prof. Lena Hartmann" description="Lab director · ETH Zürich">
            {#snippet control()}<Button size="sm" variant="ghost">Edit</Button>{/snippet}
          </SettingsFieldRow>
        </div>
      </SettingsSection>
    </div>
  {/snippet}
</Story>

<Story name="Error">
  {#snippet template()}
    <div class="w-[640px]">
      <SettingsSection
        id="sync"
        title="Calendar sync"
        description="Add application deadlines to your calendar."
        error="Couldn’t reach your calendar. Your deadlines are still saved locally."
      >
        {@render rows()}
      </SettingsSection>
    </div>
  {/snippet}
</Story>
