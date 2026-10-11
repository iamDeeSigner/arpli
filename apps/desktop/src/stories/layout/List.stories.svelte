<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ListContainer, ListItem, ListEmpty } from '$lib/components/ui/list';
  import ListDemo from './ListDemo.svelte';
  import FileTextIcon from 'phosphor-svelte/lib/FileTextIcon';

  const { Story } = defineMeta({
    title: 'Layout/List',
    component: ListItem,
    tags: ['autodocs'],
    args: {
      title: 'Personal statement',
      subtitle: 'Rhodes Scholarship · 998 words',
      size: 'md',
      variant: 'default',
      active: false,
      selected: false,
      loading: false,
      disabled: false,
      badge: 3,
      badgeVariant: 'default',
    },
    argTypes: {
      size: { control: 'select', options: ['sm', 'md'] },
      variant: { control: 'select', options: ['default', 'ghost', 'subtle'] },
      badgeVariant: { control: 'select', options: ['default', 'success', 'warning', 'error', 'info'] },
      active: { control: 'boolean' },
      selected: { control: 'boolean' },
      loading: { control: 'boolean' },
      disabled: { control: 'boolean' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-72">
      <ListContainer>
        <ListItem {...args} iconComponent={FileTextIcon} />
      </ListContainer>
    </div>
  {/snippet}
</Story>

<Story name="Sections">
  {#snippet template()}
    <ListDemo />
  {/snippet}
</Story>

<Story name="Small ghost">
  {#snippet template()}
    <ListDemo size="sm" variant="ghost" />
  {/snippet}
</Story>

<Story name="Item states">
  {#snippet template()}
    <div class="w-72">
      <ListContainer spacing="relaxed">
        <ListItem title="Default" subtitle="Academic statement" iconComponent={FileTextIcon} />
        <ListItem title="Active" subtitle="Open in editor" iconComponent={FileTextIcon} active />
        <ListItem title="Selected" subtitle="Checked for export" iconComponent={FileTextIcon} selected />
        <ListItem title="Loading" subtitle="Syncing" iconComponent={FileTextIcon} loading />
        <ListItem title="Disabled" subtitle="Locked after submit" iconComponent={FileTextIcon} disabled />
        <ListItem title="Badges" badge="Due soon" badgeVariant="warning" iconComponent={FileTextIcon} />
      </ListContainer>
    </div>
  {/snippet}
</Story>

<Story name="Empty">
  {#snippet template()}
    <div class="w-72">
      <ListEmpty message="No saved opportunities. Browse Opportunities to add some." />
    </div>
  {/snippet}
</Story>
