<!--
  shadcn/ui style scaffold. Replaceable in Phase 2 by the designer's system.
-->
<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let disabled = false;
</script>

<button
  {type}
  {disabled}
  class="rounded-token px-md py-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  class:bg-accent={variant === 'primary'}
  class:text-white={variant === 'primary'}
  class:bg-surface={variant === 'secondary'}
  class:border={variant === 'secondary'}
  class:border-border={variant === 'secondary'}
  on:click
>
  <slot />
</button>
