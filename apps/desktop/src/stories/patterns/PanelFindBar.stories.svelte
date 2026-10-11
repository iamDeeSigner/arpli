<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import { PanelFindBar } from '$lib/components/ui/panel-find-bar';

  const { Story } = defineMeta({
    title: 'Patterns/PanelFindBar',
    component: PanelFindBar,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: {
      query: 'leadership',
      placeholder: 'Find in essay',
      currentMatchIndex: 1,
      totalMatches: 4,
      layout: 'inline',
      resultFormat: 'slash',
      disabled: false,
      onNext: fn(),
      onPrevious: fn(),
      onClose: fn(),
    },
    argTypes: {
      query: { control: 'text' },
      placeholder: { control: 'text' },
      currentMatchIndex: { control: { type: 'number', min: 0 } },
      totalMatches: { control: { type: 'number', min: 0 } },
      layout: { control: 'inline-radio', options: ['floating', 'inline'] },
      resultFormat: { control: 'inline-radio', options: ['slash', 'of'] },
      resultVariant: { control: 'inline-radio', options: ['muted', 'destructive'] },
      disabled: { control: 'boolean' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-[420px]"><PanelFindBar {...args} /></div>
  {/snippet}
</Story>

<Story name="Over an essay draft">
  {#snippet template()}
    <div class="relative w-[560px] rounded-(--radius-large) border border-border bg-card p-6 pt-16">
      <div class="absolute right-3 top-3 w-[340px]">
        <PanelFindBar query="community" placeholder="Find in essay" currentMatchIndex={0} totalMatches={3} resultFormat="of" />
      </div>
      <p class="type-body text-foreground">
        Growing up in a small farming community, I learned early that clean water is never a given.
        That community shaped my decision to study environmental engineering, and it is the community
        I hope to return to with the skills this scholarship would help me build.
      </p>
    </div>
  {/snippet}
</Story>

<Story name="No matches">
  {#snippet template()}
    <div class="w-[420px]">
      <PanelFindBar layout="inline" query="mitochondria" totalMatches={0} resultVariant="destructive" placeholder="Find in essay" />
    </div>
  {/snippet}
</Story>
