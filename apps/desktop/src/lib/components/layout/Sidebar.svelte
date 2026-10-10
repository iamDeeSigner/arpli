<script lang="ts">
  import { page } from '$app/state';
  import { NAV_SECTIONS, SECTION_LABELS, type NavSection } from '$lib/stores/nav';
  import { cn } from '$lib/utils';

  function isActive(path: string, section: NavSection): boolean {
    return path === `/${section}` || path.startsWith(`/${section}/`);
  }
</script>

<nav
  class="flex h-full w-sidebar flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
  aria-label="Primary"
>
  <!-- Brand mark -->
  <div class="flex items-center gap-2 border-b border-sidebar-border px-6 py-5">
    <div
      class="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-semibold text-primary-foreground"
      aria-hidden="true"
    >
      A
    </div>
    <span class="text-lg font-semibold tracking-tight">Arpli</span>
  </div>

  <!-- Nav links -->
  <ul class="flex flex-1 flex-col gap-1 p-4">
    {#each NAV_SECTIONS as section}
      {@const active = isActive(page.url.pathname, section)}
      <li>
        <a
          href={`/${section}`}
          class={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            active
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          )}
          aria-current={active ? 'page' : undefined}
        >
          <span
            aria-hidden="true"
            class={cn('h-1.5 w-1.5 rounded-full', active ? 'bg-primary' : 'bg-transparent')}
          ></span>
          {SECTION_LABELS[section]}
        </a>
      </li>
    {/each}
  </ul>

  <div class="border-t border-sidebar-border p-4 text-xs text-muted-foreground">
    <p>Local-first · v0.1.0</p>
  </div>
</nav>
