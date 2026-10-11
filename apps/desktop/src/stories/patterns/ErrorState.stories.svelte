<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import { ErrorState } from '$lib/components/patterns/screen';
  import CloudSlashIcon from 'phosphor-svelte/lib/CloudSlashIcon';
  import WarningCircleIcon from 'phosphor-svelte/lib/WarningCircleIcon';

  const { Story } = defineMeta({
    title: 'Patterns/ErrorState',
    component: ErrorState,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: {
      density: 'default',
      severity: 'routine',
      inset: false,
      retryLabel: 'Try again',
      onRetry: fn(),
    },
    argTypes: {
      density: { control: 'inline-radio', options: ['default', 'compact'] },
      severity: { control: 'inline-radio', options: ['routine', 'danger'] },
      inset: { control: 'boolean' },
      retryLabel: { control: 'text' },
      detailsLabel: { control: 'text' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-[520px] rounded-(--radius-large) border border-border bg-card">
      <ErrorState {...args}>
        {#snippet icon()}<CloudSlashIcon class="size-8" aria-hidden="true" />{/snippet}
        {#snippet message()}We couldn’t load new opportunities. Check your connection and try again.{/snippet}
      </ErrorState>
    </div>
  {/snippet}
</Story>

<Story name="With technical details">
  {#snippet template()}
    <div class="w-[520px] rounded-(--radius-large) border border-border bg-card">
      <ErrorState severity="danger" retryLabel="Retry sync" onRetry={() => {}} detailsLabel="Show details">
        {#snippet icon()}<WarningCircleIcon class="size-8" aria-hidden="true" />{/snippet}
        {#snippet message()}Your application to the Fulbright Research Grant could not be saved.{/snippet}
        {#snippet details()}
          <code class="type-code block whitespace-pre-wrap">
            SQLITE_BUSY: database is locked (applications.db)
          </code>
        {/snippet}
      </ErrorState>
    </div>
  {/snippet}
</Story>

<Story name="Compact">
  {#snippet template()}
    <div class="w-[360px] rounded-(--radius-large) border border-border bg-card">
      <ErrorState density="compact" retryLabel="Reload" onRetry={() => {}}>
        {#snippet message()}Deadlines failed to load.{/snippet}
      </ErrorState>
    </div>
  {/snippet}
</Story>
