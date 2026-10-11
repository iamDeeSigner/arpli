<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DropdownMenu from '$lib/components/ui/dropdown-menu.svelte';
  import * as Menu from '$lib/components/ui/menu';
  import { Button } from '$lib/components/ui/button';
  import PlusIcon from 'phosphor-svelte/lib/PlusIcon';
  import GraduationCapIcon from 'phosphor-svelte/lib/GraduationCapIcon';
  import TrophyIcon from 'phosphor-svelte/lib/TrophyIcon';
  import CalendarIcon from 'phosphor-svelte/lib/CalendarIcon';

  const { Story } = defineMeta({
    title: 'Overlays/DropdownMenu',
    component: DropdownMenu,
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
    <DropdownMenu side={args.side} align={args.align} alignIconColumn>
      {#snippet trigger({ props })}
        <Button {...props} variant="primary">
          <PlusIcon aria-hidden="true" />
          New
        </Button>
      {/snippet}
      {#snippet content({ close })}
        <Menu.Item onSelect={close}>
          {#snippet leading()}<GraduationCapIcon aria-hidden="true" />{/snippet}
          Scholarship application
        </Menu.Item>
        <Menu.Item onSelect={close}>
          {#snippet leading()}<TrophyIcon aria-hidden="true" />{/snippet}
          Fellowship application
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item onSelect={close}>
          {#snippet leading()}<CalendarIcon aria-hidden="true" />{/snippet}
          Custom deadline
        </Menu.Item>
      {/snippet}
    </DropdownMenu>
  {/snippet}
</Story>
