<!--
  Primary navigation, built on the sidebar primitives from Intent's UI kit
  (same composition as cloudlands-fe's catalog shell).
-->
<script lang="ts">
  import { page } from '$app/state';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import { NAV_SECTIONS, SECTION_LABELS, type NavSection } from '$lib/stores/nav';
  import FileTextIcon from 'phosphor-svelte/lib/FileTextIcon';
  import GearSixIcon from 'phosphor-svelte/lib/GearSixIcon';
  import TargetIcon from 'phosphor-svelte/lib/TargetIcon';
  import UserCircleIcon from 'phosphor-svelte/lib/UserCircleIcon';
  import type { Component } from 'svelte';

  const ICONS: Record<NavSection, Component> = {
    profile: UserCircleIcon,
    opportunities: TargetIcon,
    applications: FileTextIcon,
    settings: GearSixIcon,
  };

  const PRIMARY: NavSection[] = NAV_SECTIONS.filter((section) => section !== 'settings');

  function isActive(path: string, section: NavSection): boolean {
    return path === `/${section}` || path.startsWith(`/${section}/`);
  }
</script>

{#snippet navItem(section: NavSection)}
  {@const Icon = ICONS[section]}
  <Sidebar.MenuItem>
    <Sidebar.MenuButton isActive={isActive(page.url.pathname, section)}>
      {#snippet child({ props })}
        <a {...props} href={`/${section}`}>
          <Icon weight="regular" aria-hidden="true" />
          <span>{SECTION_LABELS[section]}</span>
        </a>
      {/snippet}
    </Sidebar.MenuButton>
  </Sidebar.MenuItem>
{/snippet}

<Sidebar.Root collapsible="none" rail={false} aria-label="Primary">
  <Sidebar.Header class="app-drag-region px-3 pb-2 pt-4">
    <a href="/profile" class="app-no-drag flex items-center gap-2 px-2" aria-label="Arpli home">
      <span
        class="type-caption flex size-6 items-center justify-center rounded-(--radius-medium) bg-primary font-semibold text-primary-foreground"
        aria-hidden="true">A</span
      >
      <span class="type-body font-medium">Arpli</span>
    </a>
  </Sidebar.Header>

  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each PRIMARY as section (section)}
            {@render navItem(section)}
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>

  <Sidebar.Footer>
    <Sidebar.Menu>
      {@render navItem('settings')}
    </Sidebar.Menu>
    <p class="type-caption px-2 pt-1 text-muted-foreground">Local-first · v0.1.0</p>
  </Sidebar.Footer>
</Sidebar.Root>
