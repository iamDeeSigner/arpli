<script lang="ts">
  import { cn } from '$lib/utils';

  let {
    value = $bindable(''),
    placeholder = null as string | null,
    name = null as string | null,
    id = null as string | null,
    disabled = false,
    rows = 4,
    class: className = '',
    oninput,
    onchange,
    onblur,
    onfocus,
  }: {
    value?: string;
    placeholder?: string | null;
    name?: string | null;
    id?: string | null;
    disabled?: boolean;
    rows?: number;
    class?: string;
    oninput?: (e: Event) => void;
    onchange?: (e: Event) => void;
    onblur?: (e: FocusEvent) => void;
    onfocus?: (e: FocusEvent) => void;
  } = $props();
</script>

<textarea
  {placeholder}
  {name}
  {id}
  {disabled}
  {rows}
  bind:value
  class={cn(
    'w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm',
    'placeholder:text-muted-foreground',
    'focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30',
    'disabled:cursor-not-allowed disabled:opacity-50',
    className,
  )}
  {oninput}
  {onchange}
  {onblur}
  {onfocus}
></textarea>
