<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Content as MenuContent } from '$lib/components/ui/menu';
  import * as Menu from '$lib/components/ui/menu';
  import { faCopy, faPen, faTrash, faArchive } from '$lib/icons/phosphor-icons';
  import DotsThreeIcon from 'phosphor-svelte/lib/DotsThreeIcon';
  import PencilSimpleIcon from 'phosphor-svelte/lib/PencilSimpleIcon';
  import CopyIcon from 'phosphor-svelte/lib/CopyIcon';
  import ShareNetworkIcon from 'phosphor-svelte/lib/ShareNetworkIcon';
  import TrashIcon from 'phosphor-svelte/lib/TrashIcon';
  import FunnelIcon from 'phosphor-svelte/lib/FunnelIcon';
  import ExportIcon from 'phosphor-svelte/lib/ExportIcon';

  const { Story } = defineMeta({
    title: 'Overlays/Menu',
    component: MenuContent,
    tags: ['autodocs'],
    args: { side: 'bottom', align: 'start' },
    argTypes: {
      side: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
      align: { control: 'select', options: ['start', 'center', 'end'] },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <Menu.Root>
      <Menu.Trigger aria-label="Application actions">
        <DotsThreeIcon aria-hidden="true" />
        Actions
      </Menu.Trigger>
      <Menu.Content side={args.side} align={args.align}>
        <Menu.Item>
          {#snippet leading()}<PencilSimpleIcon aria-hidden="true" />{/snippet}
          Edit application
        </Menu.Item>
        <Menu.Item>
          {#snippet leading()}<CopyIcon aria-hidden="true" />{/snippet}
          Duplicate as new draft
        </Menu.Item>
        <Menu.Item>
          {#snippet leading()}<ShareNetworkIcon aria-hidden="true" />{/snippet}
          Share with recommender
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item destructive>
          {#snippet leading()}<TrashIcon aria-hidden="true" />{/snippet}
          Delete draft
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  {/snippet}
</Story>

<Story name="Command items">
  <Menu.Root>
    <Menu.Trigger>Draft actions</Menu.Trigger>
    <Menu.Content class="min-w-56">
      <Menu.CommandItem icon={faPen} label="Rename" shortcut="F2" />
      <Menu.CommandItem icon={faCopy} label="Duplicate" shortcut="Mod+D" />
      <Menu.CommandItem
        icon={faArchive}
        label="Archive"
        disabled
        disabledReason="Submitted applications can't be archived"
      />
      <Menu.Separator />
      <Menu.CommandItem icon={faTrash} label="Delete" shortcut="Mod+Backspace" destructive />
    </Menu.Content>
  </Menu.Root>
</Story>

<Story name="Checkbox and radio">
  <Menu.Root>
    <Menu.Trigger>
      <FunnelIcon aria-hidden="true" />
      Filter
    </Menu.Trigger>
    <Menu.Content class="min-w-56">
      <Menu.Group>
        <Menu.Label>Type</Menu.Label>
        <Menu.CheckboxItem checked>Scholarships</Menu.CheckboxItem>
        <Menu.CheckboxItem checked>Fellowships</Menu.CheckboxItem>
        <Menu.CheckboxItem>Grants</Menu.CheckboxItem>
      </Menu.Group>
      <Menu.Separator />
      <Menu.RadioGroup value="deadline">
        <Menu.Label>Sort by</Menu.Label>
        <Menu.RadioItem value="deadline">Deadline</Menu.RadioItem>
        <Menu.RadioItem value="award">Award amount</Menu.RadioItem>
        <Menu.RadioItem value="match">Best match</Menu.RadioItem>
      </Menu.RadioGroup>
    </Menu.Content>
  </Menu.Root>
</Story>

<Story name="Submenu">
  <Menu.Root>
    <Menu.Trigger>Application</Menu.Trigger>
    <Menu.Content class="min-w-52">
      <Menu.Item>Open</Menu.Item>
      <Menu.Sub>
        <Menu.SubTrigger>
          {#snippet leading()}<ExportIcon aria-hidden="true" />{/snippet}
          Export as
        </Menu.SubTrigger>
        <Menu.SubContent>
          <Menu.Item>PDF</Menu.Item>
          <Menu.Item>Word document</Menu.Item>
          <Menu.Item>Plain text</Menu.Item>
        </Menu.SubContent>
      </Menu.Sub>
      <Menu.Separator />
      <Menu.Item disabled>Submit (2 sections incomplete)</Menu.Item>
    </Menu.Content>
  </Menu.Root>
</Story>
