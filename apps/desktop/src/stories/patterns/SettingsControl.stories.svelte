<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { writable } from 'svelte/store';
  import {
    SettingsControl,
    SettingsFieldRow,
    type ActionSetting,
    type InputSetting,
    type NumberSetting,
    type SelectSetting,
    type SettingsControlContext,
    type SwitchSetting,
  } from '$lib/components/patterns/settings';

  const { Story } = defineMeta({
    title: 'Patterns/SettingsControl',
    component: SettingsControl,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
  });

  const reminders = writable(true);
  const level = writable('phd');
  const field = writable('Computational linguistics');
  const limit = writable(6);

  function ctx(id: string, entry: SettingsControlContext['entry']): SettingsControlContext {
    return {
      entry,
      controlId: `control-${id}`,
      labelId: `${id}-label`,
      disabled: false,
      busy: false,
    };
  }

  const switchEntry: SwitchSetting = {
    kind: 'switch',
    id: 'ctl-switch',
    label: 'Deadline reminders',
    store: reminders,
  };
  const selectEntry: SelectSetting = {
    kind: 'select',
    id: 'ctl-select',
    label: 'Level of study',
    options: [
      { value: 'undergraduate', label: 'Undergraduate' },
      { value: 'masters', label: 'Master’s' },
      { value: 'phd', label: 'PhD' },
    ],
    store: level,
  };
  const inputEntry: InputSetting = {
    kind: 'input',
    id: 'ctl-input',
    label: 'Field of study',
    placeholder: 'e.g. Molecular biology',
    store: field,
  };
  const numberEntry: NumberSetting = {
    kind: 'number',
    id: 'ctl-number',
    label: 'Active applications limit',
    min: 1,
    max: 30,
    store: limit,
  };
  const actionEntry: ActionSetting = {
    kind: 'action',
    id: 'ctl-action',
    label: 'Export applications',
    actionLabel: 'Export…',
    action: () => {},
  };
  const dangerEntry: ActionSetting = {
    kind: 'action',
    id: 'ctl-danger',
    label: 'Reset profile',
    actionLabel: 'Reset…',
    danger: true,
    action: () => {},
  };

  const entries: Exclude<SettingsControlContext['entry'], { kind: 'custom' }>[] = [switchEntry, selectEntry, inputEntry, numberEntry, actionEntry, dangerEntry];
</script>

<Story name="All kinds">
  {#snippet template()}
    <div class="w-[640px] divide-y divide-border rounded-(--radius-medium) bg-card px-4">
      {#each entries as entry (entry.id)}
        <SettingsFieldRow
          id={entry.id}
          label={entry.label}
          description={`kind: ${entry.kind}`}
          htmlFor={entry.kind === 'input' || entry.kind === 'number' || entry.kind === 'select'
            ? `control-${entry.id}`
            : undefined}
        >
          {#snippet control()}
            <SettingsControl {entry} context={ctx(entry.id, entry)} compact={false} />
          {/snippet}
        </SettingsFieldRow>
      {/each}
    </div>
  {/snippet}
</Story>

<Story name="Disabled">
  {#snippet template()}
    <div class="flex w-[640px] flex-col gap-3 rounded-(--radius-medium) bg-card p-4">
      <SettingsControl entry={switchEntry} context={{ ...ctx('d1', switchEntry), disabled: true }} />
      <SettingsControl entry={selectEntry} context={{ ...ctx('d2', selectEntry), disabled: true }} />
      <SettingsControl entry={inputEntry} context={{ ...ctx('d3', inputEntry), disabled: true }} />
    </div>
  {/snippet}
</Story>
