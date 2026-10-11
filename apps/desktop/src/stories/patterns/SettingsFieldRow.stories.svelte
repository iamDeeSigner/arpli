<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { SettingsFieldRow } from '$lib/components/patterns/settings';
  import { Switch } from '$lib/components/ui/switch';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import BellIcon from 'phosphor-svelte/lib/BellIcon';

  const { Story } = defineMeta({
    title: 'Patterns/SettingsFieldRow',
    component: SettingsFieldRow,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: {
      id: 'deadline-reminders',
      label: 'Deadline reminders',
      description: 'Get a desktop notification before an application is due.',
      compact: false,
      disabled: false,
      busy: false,
      danger: false,
      experimental: false,
    },
    argTypes: {
      label: { control: 'text' },
      description: { control: 'text' },
      error: { control: 'text' },
      status: { control: 'text' },
      statusTone: { control: 'inline-radio', options: ['info', 'subtle'] },
      compact: { control: 'boolean' },
      disabled: { control: 'boolean' },
      busy: { control: 'boolean' },
      danger: { control: 'boolean' },
      experimental: { control: 'boolean' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-[640px] rounded-(--radius-medium) bg-card px-4">
      <SettingsFieldRow {...args}>
        {#snippet control({ labelId, descriptionId, disabled })}
          <Switch
            checked
            {disabled}
            ariaLabelledby={labelId}
            ariaDescribedby={descriptionId}
          />
        {/snippet}
      </SettingsFieldRow>
    </div>
  {/snippet}
</Story>

<Story name="States">
  {#snippet template()}
    <div class="w-[640px] divide-y divide-border rounded-(--radius-medium) bg-card px-4">
      <SettingsFieldRow
        id="row-leading"
        label="Weekly opportunity digest"
        description="A Monday summary of new scholarships that match your profile."
      >
        {#snippet leading()}<BellIcon aria-hidden="true" />{/snippet}
        {#snippet control({ labelId })}<Switch ariaLabelledby={labelId} />{/snippet}
      </SettingsFieldRow>
      <SettingsFieldRow
        id="row-input"
        label="Field of study"
        htmlFor="row-input-control"
        status="Used to rank 142 matching opportunities."
      >
        {#snippet control({ labelId })}
          <Input id="row-input-control" value="Environmental engineering" aria-labelledby={labelId} class="w-64" />
        {/snippet}
      </SettingsFieldRow>
      <SettingsFieldRow
        id="row-error"
        label="Contact email"
        htmlFor="row-error-control"
        error="Enter a valid email address."
      >
        {#snippet control({ labelId, errorId })}
          <Input
            id="row-error-control"
            value="maya.okafor@"
            aria-labelledby={labelId}
            aria-describedby={errorId}
            aria-invalid="true"
            class="w-64"
          />
        {/snippet}
      </SettingsFieldRow>
      <SettingsFieldRow
        id="row-disabled"
        label="Sync with university portal"
        description="Available once your institution connects to Arpli."
        disabled
      >
        {#snippet control({ labelId, disabled })}<Switch {disabled} ariaLabelledby={labelId} />{/snippet}
      </SettingsFieldRow>
      <SettingsFieldRow
        id="row-danger"
        label="Reset profile"
        description="Removes your profile and all drafts from this device."
        danger
      >
        {#snippet control()}<Button variant="destructive">Reset…</Button>{/snippet}
      </SettingsFieldRow>
    </div>
  {/snippet}
</Story>

<Story name="Compact (stacked)">
  {#snippet template()}
    <div class="w-[360px] divide-y divide-border rounded-(--radius-medium) bg-card px-4">
      <SettingsFieldRow
        id="compact-a"
        compact
        label="Deadline reminders"
        description="Notify me before an application is due."
      >
        {#snippet control({ labelId })}<Switch checked ariaLabelledby={labelId} />{/snippet}
      </SettingsFieldRow>
      <SettingsFieldRow id="compact-b" compact label="Field of study" htmlFor="compact-b-control">
        {#snippet control({ labelId })}
          <Input id="compact-b-control" value="Marine biology" aria-labelledby={labelId} />
        {/snippet}
      </SettingsFieldRow>
    </div>
  {/snippet}
</Story>
