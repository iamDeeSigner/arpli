<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import {
    EmptyState,
    LoadingState,
    Screen,
    ScreenBody,
    ScreenFooter,
    ScreenHeader,
  } from '$lib/components/patterns/screen';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import PlusIcon from 'phosphor-svelte/lib/PlusIcon';
  import FunnelIcon from 'phosphor-svelte/lib/FunnelIcon';
  import GraduationCapIcon from 'phosphor-svelte/lib/GraduationCapIcon';
  import TargetIcon from 'phosphor-svelte/lib/TargetIcon';

  const { Story } = defineMeta({
    title: 'Patterns/Screen',
    component: Screen,
    tags: ['autodocs'],
    parameters: { layout: 'fullscreen' },
  });

  const opportunities = [
    { name: 'Gates Cambridge Scholarship', amount: '£52,000 / yr', deadline: 'Oct 14, 2026', match: 'Strong match' },
    { name: 'Rhodes Scholarship', amount: 'Full funding', deadline: 'Oct 1, 2026', match: 'Good match' },
    { name: 'NSF Graduate Research Fellowship', amount: '$37,000 / yr', deadline: 'Oct 20, 2026', match: 'Strong match' },
    { name: 'Knight-Hennessy Scholars', amount: 'Full funding', deadline: 'Oct 9, 2026', match: 'Possible match' },
  ];
</script>

<Story name="Header + body">
  {#snippet template()}
    <div class="h-[560px] border border-border">
      <Screen class="h-full">
        <ScreenHeader>
          {#snippet leading()}<GraduationCapIcon class="size-5 text-muted-foreground" aria-hidden="true" />{/snippet}
          {#snippet title()}Opportunities{/snippet}
          {#snippet description()}Scholarships, grants and fellowships matched to your profile.{/snippet}
          {#snippet counter()}<Badge size="sm">{opportunities.length}</Badge>{/snippet}
          {#snippet actions()}
            <Button variant="ghost" size="sm">
              {#snippet leadingIcon()}<FunnelIcon aria-hidden="true" />{/snippet}
              Filter
            </Button>
            <Button variant="primary" size="sm">
              {#snippet leadingIcon()}<PlusIcon aria-hidden="true" />{/snippet}
              Add opportunity
            </Button>
          {/snippet}
        </ScreenHeader>
        <ScreenBody>
          <div class="grid grid-cols-2 gap-3">
            {#each opportunities as item (item.name)}
              <Card.Root>
                <Card.Header>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Description>{item.amount} · Due {item.deadline}</Card.Description>
                </Card.Header>
                <Card.Content>
                  <Badge variant="dot" color="green">{item.match}</Badge>
                </Card.Content>
              </Card.Root>
            {/each}
          </div>
        </ScreenBody>
      </Screen>
    </div>
  {/snippet}
</Story>

<Story name="With footer">
  {#snippet template()}
    <div class="h-[480px] border border-border">
      <Screen class="h-full">
        <ScreenHeader>
          {#snippet title()}Review application{/snippet}
          {#snippet description()}Gates Cambridge Scholarship · Due Oct 14, 2026{/snippet}
        </ScreenHeader>
        <ScreenBody>
          <div class="space-y-3 type-body text-muted-foreground">
            <p>Personal statement — 812 / 1,000 words</p>
            <p>Research proposal — attached</p>
            <p>Two references — 1 received, 1 pending</p>
          </div>
        </ScreenBody>
        <ScreenFooter hint="Drafts are saved on this device">
          {#snippet secondary()}<Button variant="ghost">Save draft</Button>{/snippet}
          {#snippet primary()}<Button variant="primary">Mark ready to submit</Button>{/snippet}
        </ScreenFooter>
      </Screen>
    </div>
  {/snippet}
</Story>

<Story name="Loading body">
  {#snippet template()}
    <div class="h-[420px] border border-border">
      <Screen class="h-full">
        <ScreenHeader>
          {#snippet title()}Applications{/snippet}
        </ScreenHeader>
        <ScreenBody>
          <LoadingState recipe="list" count={5} label="Loading applications" />
        </ScreenBody>
      </Screen>
    </div>
  {/snippet}
</Story>

<Story name="Empty body">
  {#snippet template()}
    <div class="h-[420px] border border-border">
      <Screen class="h-full">
        <ScreenHeader>
          {#snippet title()}Saved opportunities{/snippet}
        </ScreenHeader>
        <ScreenBody>
          <EmptyState emphasis="prominent" actionLabel="Browse opportunities" onAction={() => {}}>
            {#snippet icon()}<TargetIcon class="size-10" aria-hidden="true" />{/snippet}
            {#snippet title()}Nothing saved yet{/snippet}
            {#snippet description()}Bookmark a scholarship to keep it here.{/snippet}
          </EmptyState>
        </ScreenBody>
      </Screen>
    </div>
  {/snippet}
</Story>
