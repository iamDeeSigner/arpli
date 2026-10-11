<!--
  Onboarding Step 1: Welcome.
  Introduces Arpli with a one-paragraph pitch, then routes to the Connect AI step.
-->
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { fly } from '$lib/motion';
  import LockIcon from 'phosphor-svelte/lib/LockIcon';
  import RobotIcon from 'phosphor-svelte/lib/RobotIcon';
  import TrendUpIcon from 'phosphor-svelte/lib/TrendUpIcon';

  const features = [
    { icon: LockIcon, title: 'Private by default', desc: 'Everything stays on your machine.' },
    { icon: RobotIcon, title: 'AI you control', desc: 'Use your own Ollama or bring an API key.' },
    {
      icon: TrendUpIcon,
      title: 'Grows with you',
      desc: 'Your profile compounds across every application.',
    },
  ];
</script>

<div class="flex flex-col gap-6 text-center" in:fly={{ tier: 'moderate' }}>
  <!-- Arpli brand mark -->
  <div
    class="mx-auto flex size-16 items-center justify-center rounded-(--radius-large) bg-primary text-primary-foreground"
    aria-hidden="true"
  >
    <span class="type-display font-bold">A</span>
  </div>

  <div class="flex flex-col gap-2">
    <h1 class="type-display">Welcome to Arpli</h1>
    <p class="type-body text-muted-foreground">
      Your local-first application intelligence hub. Arpli keeps your career profile,
      opportunities, and drafts on this machine — no cloud account required.
    </p>
  </div>

  <ul class="flex flex-col gap-3 text-left">
    {#each features as item (item.title)}
      {@const Icon = item.icon}
      <li>
        <Card.Root class="flex-row items-start">
          {#snippet media()}
            <Icon class="size-5 text-muted-foreground" aria-hidden="true" />
          {/snippet}
          <Card.Header class="flex-1 pb-4 pl-0">
            <Card.Title class="type-body">{item.title}</Card.Title>
            <Card.Description>{item.desc}</Card.Description>
          </Card.Header>
        </Card.Root>
      </li>
    {/each}
  </ul>

  <Button variant="primary" href="/onboarding/connect" size="lg" class="w-full">
    Get started
  </Button>
</div>
