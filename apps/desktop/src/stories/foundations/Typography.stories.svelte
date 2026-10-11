<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Foundations/Typography',
    parameters: { layout: 'padded' },
  });

  const roles = [
    { cls: 'type-display', token: 'display', sample: 'Apply with confidence' },
    { cls: 'type-title', token: 'title', sample: 'Opportunities this month' },
    { cls: 'type-body', token: 'body', sample: 'Arpli keeps your profile, opportunities and drafts on this machine.' },
    { cls: 'type-caption', token: 'caption', sample: 'Updated 2 minutes ago' },
    { cls: 'type-code', token: 'code', sample: 'ARPLI_DB_PATH=~/.arpli/arpli.db' },
  ];
</script>

<Story name="Type roles">
  <div class="flex max-w-3xl flex-col divide-y divide-border">
    {#each roles as role (role.cls)}
      <div class="grid grid-cols-[10rem_1fr] items-baseline gap-6 py-4">
        <div class="type-caption text-muted-foreground">
          <code class="type-code">.{role.cls}</code>
          <div>--text-{role.token}-size</div>
        </div>
        <p class={role.cls}>{role.sample}</p>
      </div>
    {/each}
  </div>
</Story>

<Story name="Font families">
  <div class="flex flex-col gap-4">
    <p class="type-title" style="font-family: var(--font-ui)">Inter — interface (--font-ui)</p>
    <p class="type-title" style="font-family: 'Source Serif 4 Variable', serif">
      Source Serif 4 — long-form reading
    </p>
    <p class="type-title" style="font-family: var(--font-code)">JetBrains Mono — code (--font-code)</p>
  </div>
</Story>
