<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { notify, NOTIFY_DURATION } from '$lib/components/patterns/notify';
  import { Button } from '$lib/components/ui/button';

  const { Story } = defineMeta({
    title: 'Patterns/Notify',
    parameters: {
      layout: 'centered',
      docs: {
        description: {
          component:
            '`notify` wraps the toast host with per-kind durations (success 2s, info 5s, warning 10s, error 15s, progress until settled, undoable 10s with countdown).',
        },
      },
    },
  });

  function runProgress() {
    const handle = notify.progress('Generating draft for the Gates Cambridge essay…');
    setTimeout(() => handle.update('Checking against the 1,000-word limit…'), 1200);
    setTimeout(() => handle.success('Draft ready — 948 words'), 2600);
  }

  function runFailingProgress() {
    const handle = notify.progress('Syncing deadlines to your calendar…');
    setTimeout(() => handle.error('Calendar sync failed. Your deadlines are still saved locally.'), 1800);
  }

  function archive() {
    notify.undoable('Archived “Erasmus Mundus Joint Master”', {
      undoLabel: 'Undo',
      onUndo: () => {
        notify.info('Restored to Applications');
      },
    });
  }
</script>

<Story name="Kinds">
  <div class="flex max-w-xl flex-wrap justify-center gap-2">
    <Button onclick={() => notify.success('Profile saved')}>Success</Button>
    <Button onclick={() => notify.info('3 new scholarships match your profile', { description: 'Open Opportunities to review them.' })}>
      Info
    </Button>
    <Button onclick={() => notify.warning('Rhodes Scholarship closes in 2 days')}>Warning</Button>
    <Button onclick={() => notify.error('Couldn’t upload transcript.pdf — file is larger than 10 MB')}>
      Error
    </Button>
    <Button
      onclick={() =>
        notify.error(new Error('Request to the scholarship index timed out after 30s'))}
    >
      Error with details
    </Button>
    <Button onclick={runProgress}>Progress → success</Button>
    <Button onclick={runFailingProgress}>Progress → error</Button>
    <Button variant="outline" onclick={archive}>Undoable</Button>
    <Button variant="ghost" onclick={() => notify.dismiss()}>Dismiss all</Button>
  </div>
</Story>

<Story name="Durations">
  <dl class="type-body grid grid-cols-[auto_auto] gap-x-6 gap-y-1">
    {#each Object.entries(NOTIFY_DURATION) as [kind, ms] (kind)}
      <dt class="text-muted-foreground">{kind}</dt>
      <dd class="type-code">{Number.isFinite(ms) ? `${ms / 1000}s` : 'until settled'}</dd>
    {/each}
  </dl>
</Story>
