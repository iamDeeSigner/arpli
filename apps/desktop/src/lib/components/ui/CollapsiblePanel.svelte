<!-- @catalog-exempt: product-category wrapper tracked by CollapsiblePanel.meta.ts and slated for Accordion; not in the canonical manifest -->

<script lang="ts">
  import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
  import { untrack } from 'svelte';
  import { slide } from '$lib/motion';
  import Fa from 'svelte-fa';
  import { Button } from '$lib/components/ui/button';

  interface Props {
    title: string;
    icon?: any;
    defaultCollapsed?: boolean;
    storageKey?: string;
    class?: string;
    headerClass?: string;
    contentClass?: string;
    showChevronOnHover?: boolean;
    showGradient?: boolean;
    headerActions?: any;
    children?: any;
  }

  let {
    title,
    icon = undefined,
    defaultCollapsed = false,
    storageKey = undefined,
    class: className = '',
    headerClass = '',
    contentClass = '',
    showChevronOnHover = true,
    showGradient = true,
    headerActions = undefined,
    children,
  }: Props = $props();

  // Intent persists this through its Redux store; Arpli keeps it in localStorage.
  const STORAGE_PREFIX = 'arpli:collapsible-panel:';

  function readPersisted(key: string | undefined): boolean | undefined {
    if (!key) return undefined;
    try {
      const value = localStorage.getItem(STORAGE_PREFIX + key);
      return value === null ? undefined : value === 'true';
    } catch {
      return undefined;
    }
  }

  let collapsed = $state(untrack(() => readPersisted(storageKey) ?? defaultCollapsed));

  function toggleCollapsed() {
    collapsed = !collapsed;
    if (storageKey) {
      try {
        localStorage.setItem(STORAGE_PREFIX + storageKey, String(collapsed));
      } catch {
        // Persistence is best-effort.
      }
    }
  }

  let hovering = $state(false);
</script>

<div class="w-full flex flex-col h-full {className}">
  <Button
    variant="plain"
    class="relative w-full px-3.5 pt-[0.9rem] z-10 text-left cursor-pointer {headerClass}"
    onclick={toggleCollapsed}
    onmouseenter={() => (hovering = true)}
    onmouseleave={() => (hovering = false)}
    type="button"
  >
    <div class="relative flex items-center gap-2 flex-1">
      <div class="flex-1 flex items-center gap-2">
        {#if icon}
          <Fa {icon} size="sm" class="text-ghost opacity-30" />
        {/if}
        <h3 class="m-0 text-sm font-medium">{title}</h3>
        <div
          class="transition-[opacity,transform] mt-[2px] duration-spring-moderate ease-spring-moderate motion-reduce:transition-none text-subtle {!hovering &&
          showChevronOnHover
            ? 'opacity-0'
            : 'opacity-100'} {collapsed ? 'rotate-90' : ''}"
        >
          <Fa icon={faChevronDown} size="xs" />
        </div>
      </div>
      {@render headerActions?.()}
    </div>
  </Button>

  {#if !collapsed}
    <div
      class="relative z-0 w-full flex flex-col flex-1 min-h-0 overflow-hidden {contentClass}"
      transition:slide={{ tier: 'moderate' }}
    >
      {#if showGradient}
        <!-- Gradient fade-out at top -->
        <div
          class="absolute -top-2 left-0 right-0 h-2 bg-gradient-to-b from-sidebar to-transparent pointer-events-none z-10"
          aria-hidden="true"
        ></div>
      {/if}

      {@render children()}

      {#if showGradient}
        <!-- Gradient fade-out at bottom -->
        <div
          class="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-t from-sidebar to-transparent pointer-events-none z-10"
          aria-hidden="true"
        ></div>
      {/if}
    </div>
  {/if}
</div>
