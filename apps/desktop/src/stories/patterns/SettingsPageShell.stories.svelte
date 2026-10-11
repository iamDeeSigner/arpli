<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import { SettingsPageShell } from '$lib/components/ui/settings-page-shell';
  import { SettingsForm } from '$lib/components/patterns/settings';
  import { Button } from '$lib/components/ui/button';
  import * as Tabs from '$lib/components/ui/tabs';
  import { arpliSettings } from './settings-fixtures';

  const { Story } = defineMeta({
    title: 'Patterns/SettingsPageShell',
    component: SettingsPageShell,
    tags: ['autodocs'],
    parameters: { layout: 'fullscreen' },
    args: {
      title: 'Settings',
      description: 'Notifications, profile defaults and your data on this device.',
      backLabel: 'Back to opportunities',
      backShortcut: 'Esc',
      onBack: fn(),
      busy: false,
      measure: 'standard',
    },
    argTypes: {
      title: { control: 'text' },
      description: { control: 'text' },
      backLabel: { control: 'text' },
      backShortcut: { control: 'text' },
      busy: { control: 'boolean' },
      measure: { control: 'inline-radio', options: ['standard', 'wide'] },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="h-[720px]">
      <SettingsPageShell {...args}>
        <SettingsForm schema={arpliSettings} />
      </SettingsPageShell>
    </div>
  {/snippet}
</Story>

<Story name="With navigation and footer">
  {#snippet template()}
    <div class="h-[720px]">
      <SettingsPageShell
        title="Settings"
        description="Notifications, profile defaults and your data on this device."
        navigationValue="general"
        navigationLabel="Settings sections"
      >
        {#snippet navigation()}
          <Tabs.Trigger value="general">General</Tabs.Trigger>
          <Tabs.Trigger value="voice">Voice input</Tabs.Trigger>
          <Tabs.Trigger value="ai">AI drafting</Tabs.Trigger>
          <Tabs.Trigger value="data">Data &amp; privacy</Tabs.Trigger>
        {/snippet}
        <SettingsForm schema={arpliSettings} />
        {#snippet footer()}
          <div class="flex items-center justify-between gap-3">
            <span>Changes are saved automatically.</span>
            <Button size="sm" variant="ghost">Restore defaults</Button>
          </div>
        {/snippet}
      </SettingsPageShell>
    </div>
  {/snippet}
</Story>
