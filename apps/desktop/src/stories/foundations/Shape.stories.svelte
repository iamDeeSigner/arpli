<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Foundations/Shape & size',
    parameters: { layout: 'padded' },
  });

  const radii = ['small', 'medium', 'large', 'pill'];
  const heights = ['compact', 'small', 'medium', 'large'];
</script>

<Story name="Radius">
  <div class="flex flex-wrap gap-4">
    {#each radii as radius (radius)}
      <div class="flex flex-col items-center gap-2">
        <div class="size-20 border border-border bg-muted" style="border-radius: var(--radius-{radius})"></div>
        <code class="type-code">--radius-{radius}</code>
      </div>
    {/each}
  </div>
</Story>

<Story name="Control heights">
  <div class="flex items-end gap-4">
    {#each heights as height (height)}
      <div class="flex flex-col items-center gap-2">
        <div
          class="w-24 rounded-(--radius-medium) border border-border bg-muted"
          style="height: var(--control-height-{height})"
        ></div>
        <code class="type-code">--control-height-{height}</code>
      </div>
    {/each}
  </div>
</Story>
