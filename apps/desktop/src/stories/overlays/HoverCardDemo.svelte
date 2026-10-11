<!-- Story helper: HoverCard has no trigger of its own; the caller shows it while the anchor is hovered or focused. -->
<script lang="ts">
  import HoverCard from '$lib/components/ui/HoverCard.svelte';

  let {
    position = 'right',
    anchor = '--story-hover-anchor',
  }: {
    position?: 'right' | 'bottom' | 'bottom-right' | 'bottom-left' | 'top';
    anchor?: string;
  } = $props();

  let visible = $state(false);
  let trigger: HTMLButtonElement | null = $state(null);
  let hideTimer: ReturnType<typeof setTimeout> | undefined;

  function show() {
    clearTimeout(hideTimer);
    visible = true;
  }
  function hide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => (visible = false), 120);
  }
</script>

<button
  bind:this={trigger}
  type="button"
  class="type-body rounded-(--radius-medium) px-2 py-1 text-primary-ink underline underline-offset-4"
  style:anchor-name={anchor}
  onmouseenter={show}
  onmouseleave={hide}
  onfocus={show}
  onblur={hide}
>
  Rhodes Scholarship
</button>

{#if visible}
  <HoverCard
    {anchor}
    {position}
    anchorElement={trigger}
    class="gap-2 rounded-(--radius-large) p-3"
    onmouseenter={show}
    onmouseleave={hide}
  >
    <p class="type-body font-medium text-foreground">Rhodes Scholarship</p>
    <p class="type-caption text-muted-foreground">
      Postgraduate study at the University of Oxford. Fully funded for two to three years.
    </p>
    <p class="type-caption text-foreground">Deadline · October 1, 2026</p>
  </HoverCard>
{/if}
