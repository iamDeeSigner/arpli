<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import { Provider as SidebarProvider } from '$lib/components/ui/sidebar';
  import UserCircleIcon from 'phosphor-svelte/lib/UserCircleIcon';
  import TargetIcon from 'phosphor-svelte/lib/TargetIcon';
  import FileTextIcon from 'phosphor-svelte/lib/FileTextIcon';
  import GearSixIcon from 'phosphor-svelte/lib/GearSixIcon';
  import CalendarIcon from 'phosphor-svelte/lib/CalendarIcon';
  import BookmarkSimpleIcon from 'phosphor-svelte/lib/BookmarkSimpleIcon';
  import PlusIcon from 'phosphor-svelte/lib/PlusIcon';

  const primary = [
    { id: 'profile', label: 'Profile', icon: UserCircleIcon },
    { id: 'opportunities', label: 'Opportunities', icon: TargetIcon },
    { id: 'applications', label: 'Applications', icon: FileTextIcon, badge: '4' },
    { id: 'deadlines', label: 'Deadlines', icon: CalendarIcon },
  ];
  const saved = ['Rhodes Scholarship', 'Fulbright Program', 'Marshall Scholarship'];

  const { Story } = defineMeta({
    title: 'Layout/Sidebar',
    component: SidebarProvider,
    tags: ['autodocs'],
    parameters: { layout: 'fullscreen' },
  });
</script>

{#snippet brand()}
  <div class="flex items-center gap-2 px-2">
    <span
      class="type-caption flex size-6 items-center justify-center rounded-(--radius-medium) bg-primary font-semibold text-primary-foreground"
      aria-hidden="true">A</span
    >
    <span class="type-body font-medium">Arpli</span>
  </div>
{/snippet}

{#snippet navigation(active: string)}
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each primary as item (item.id)}
            {@const Icon = item.icon}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton isActive={item.id === active}>
                <Icon weight="regular" aria-hidden="true" />
                <span>{item.label}</span>
              </Sidebar.MenuButton>
              {#if item.badge}
                <Sidebar.MenuBadge>{item.badge}</Sidebar.MenuBadge>
              {/if}
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Saved</Sidebar.GroupLabel>
      <Sidebar.GroupAction aria-label="Save an opportunity">
        <PlusIcon aria-hidden="true" />
      </Sidebar.GroupAction>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each saved as name (name)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <BookmarkSimpleIcon aria-hidden="true" />
                <span>{name}</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
  <Sidebar.Footer>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton isActive={active === 'settings'}>
          <GearSixIcon aria-hidden="true" />
          <span>Settings</span>
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
    <p class="type-caption px-2 pt-1 text-muted-foreground">Local-first · v0.1.0</p>
  </Sidebar.Footer>
{/snippet}

<Story name="App sidebar">
  {#snippet template()}
    <div class="h-[36rem] overflow-hidden border-b border-border bg-background">
      <Sidebar.Provider persist={false} shortcut={null} class="h-full min-h-0">
        <Sidebar.Root collapsible="none" rail={false} aria-label="Primary">
          <Sidebar.Header class="px-3 pb-2 pt-4">
            {@render brand()}
          </Sidebar.Header>
          {@render navigation('applications')}
        </Sidebar.Root>
        <div class="type-body flex flex-1 flex-col gap-2 p-8 text-foreground">
          <h1 class="type-title font-bold">Applications</h1>
          <p class="text-muted-foreground">4 in progress · next deadline Oct 1</p>
        </div>
      </Sidebar.Provider>
    </div>
  {/snippet}
</Story>

<Story name="Collapsible with inset">
  {#snippet template()}
    <Sidebar.Provider persist={false} shortcut={null}>
      <Sidebar.Root collapsible="offcanvas" aria-label="Primary">
        <Sidebar.Header class="px-3 pb-2 pt-4">
          {@render brand()}
        </Sidebar.Header>
        {@render navigation('opportunities')}
      </Sidebar.Root>
      <Sidebar.Inset as="div">
        <header class="flex items-center gap-2 border-b border-border p-3">
          <Sidebar.Trigger />
          <span class="type-body font-medium text-foreground">Opportunities</span>
        </header>
        <div class="type-body p-8 text-muted-foreground">
          Use the toggle to collapse the sidebar off-canvas.
        </div>
      </Sidebar.Inset>
    </Sidebar.Provider>
  {/snippet}
</Story>
