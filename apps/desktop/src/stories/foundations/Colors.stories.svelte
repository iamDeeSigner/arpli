<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Foundations/Color',
    parameters: { layout: 'padded' },
  });

  const roles: { group: string; tokens: [string, string?][] }[] = [
    {
      group: 'Base',
      tokens: [
        ['background', 'foreground'],
        ['card', 'card-foreground'],
        ['popover', 'popover-foreground'],
        ['muted', 'muted-foreground'],
        ['secondary', 'secondary-foreground'],
        ['accent', 'accent-foreground'],
      ],
    },
    {
      group: 'Brand & status',
      tokens: [
        ['primary', 'primary-foreground'],
        ['primary-ink'],
        ['danger', 'danger-background'],
        ['success', 'success-foreground'],
        ['warning', 'warning-foreground'],
        ['info', 'info-foreground'],
      ],
    },
    {
      group: 'Lines & interaction',
      tokens: [['border'], ['input'], ['ring'], ['hover'], ['active'], ['selected']],
    },
    {
      group: 'Sidebar',
      tokens: [
        ['sidebar', 'sidebar-foreground'],
        ['sidebar-accent', 'sidebar-accent-foreground'],
        ['sidebar-border'],
      ],
    },
  ];

  const surfaces = [1, 2, 3, 4, 5, 6, 7, 8];
</script>

<Story name="Roles">
  <div class="flex flex-col gap-8">
    {#each roles as section (section.group)}
      <section class="flex flex-col gap-3">
        <h2 class="type-title">{section.group}</h2>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-3">
          {#each section.tokens as [token, fg] (token)}
            <div class="overflow-hidden rounded-(--radius-large) border border-border">
              <div
                class="type-body flex h-16 items-end p-2"
                style="background: hsl(var(--{token})); color: {fg ? `hsl(var(--${fg}))` : 'inherit'}"
              >
                {fg ? 'Aa' : ''}
              </div>
              <div class="type-caption bg-card p-2">
                <code class="type-code">--{token}</code>
                {#if fg}<div class="text-muted-foreground">on --{fg}</div>{/if}
              </div>
            </div>
          {/each}
        </div>
      </section>
    {/each}
  </div>
</Story>

<Story name="Surfaces">
  <div class="flex flex-col gap-3">
    <p class="type-body text-muted-foreground">
      Surfaces 1–8 stack from the page up to the highest overlay; each level pairs with its shadow.
    </p>
    <div class="flex flex-wrap gap-4 bg-background p-6">
      {#each surfaces as level (level)}
        <div
          class="type-caption flex size-28 items-end rounded-(--radius-large) p-2"
          style="background: hsl(var(--surface-{level})); box-shadow: var(--surface-shadow-{level});"
        >
          surface-{level}
        </div>
      {/each}
    </div>
  </div>
</Story>
