<script lang="ts">
  import { cn } from '$lib/utils';

  let {
    type = 'text' as 'text' | 'password' | 'email' | 'url',
    value = $bindable(''),
    placeholder = null as string | null,
    name = null as string | null,
    id = null as string | null,
    disabled = false,
    autocomplete = null as HTMLInputElement['autocomplete'] | null,
    class: className = '',
    oninput = undefined as ((e: Event) => void) | undefined,
    onchange = undefined as ((e: Event) => void) | undefined,
    onblur = undefined as ((e: FocusEvent) => void) | undefined,
    onfocus = undefined as ((e: FocusEvent) => void) | undefined,
  } = $props();

  const baseClass = $derived(
    cn(
      'w-full rounded-md border border-border bg-background px-3 py-2 text-sm',
      'placeholder:text-muted-foreground',
      'focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className,
    ),
  );
</script>

<!--
  Svelte does not allow a dynamic `type` attribute when bind:value is present.
  We branch on `type` so each branch has a static attribute.
-->
{#if type === 'password'}
  <input
    type="password"
    {placeholder}
    {name}
    {id}
    {disabled}
    autocomplete={autocomplete ?? undefined}
    bind:value
    class={baseClass}
    {oninput}
    {onchange}
    {onblur}
    {onfocus}
  />
{:else if type === 'email'}
  <input
    type="email"
    {placeholder}
    {name}
    {id}
    {disabled}
    autocomplete={autocomplete ?? undefined}
    bind:value
    class={baseClass}
    {oninput}
    {onchange}
    {onblur}
    {onfocus}
  />
{:else if type === 'url'}
  <input
    type="url"
    {placeholder}
    {name}
    {id}
    {disabled}
    autocomplete={autocomplete ?? undefined}
    bind:value
    class={baseClass}
    {oninput}
    {onchange}
    {onblur}
    {onfocus}
  />
{:else}
  <input
    type="text"
    {placeholder}
    {name}
    {id}
    {disabled}
    autocomplete={autocomplete ?? undefined}
    bind:value
    class={baseClass}
    {oninput}
    {onchange}
    {onblur}
    {onfocus}
  />
{/if}
