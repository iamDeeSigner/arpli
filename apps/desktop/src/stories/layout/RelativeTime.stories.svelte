<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import RelativeTime from '$lib/components/ui/RelativeTime.svelte';

  const now = Date.now();
  const minute = 60_000;
  const examples = [
    { label: 'Draft saved', date: now - 20_000 },
    { label: 'Essay edited', date: now - 12 * minute },
    { label: 'Letter received', date: now - 5 * 60 * minute },
    { label: 'Application submitted', date: now - 3 * 24 * 60 * minute },
    { label: 'Profile created', date: now - 120 * 24 * 60 * minute },
  ];

  const { Story } = defineMeta({
    title: 'Layout/RelativeTime',
    component: RelativeTime,
    tags: ['autodocs'],
    args: { date: now - 45 * minute, compact: false },
    argTypes: {
      date: { control: 'date' },
      compact: { control: 'boolean' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <span class="type-body text-foreground">Last edited <RelativeTime {...args} /></span>
  {/snippet}
</Story>

<Story name="Ranges">
  {#snippet template()}
    <dl class="type-body grid grid-cols-[12rem_8rem_6rem] gap-y-2">
      <dt class="text-muted-foreground">Event</dt>
      <dd class="text-muted-foreground">Default</dd>
      <dd class="text-muted-foreground">Compact</dd>
      {#each examples as ex (ex.label)}
        <dt class="text-foreground">{ex.label}</dt>
        <dd><RelativeTime date={ex.date} /></dd>
        <dd><RelativeTime date={ex.date} compact /></dd>
      {/each}
    </dl>
  {/snippet}
</Story>
