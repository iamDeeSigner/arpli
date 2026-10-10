<!--
  Onboarding Step 1: Welcome.
  Introduces Arpli with a one-paragraph pitch, then routes to the Connect AI step.
-->
<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
</script>

<div class="flex flex-col gap-6 text-center">
  <!-- Brand mark -->
  <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
    <span class="text-3xl font-bold text-primary-foreground">A</span>
  </div>

  <div class="flex flex-col gap-2">
    <h1 class="text-3xl font-semibold tracking-tight">Welcome to Arpli</h1>
    <p class="text-muted-foreground">
      Your local-first application intelligence hub. Arpli keeps your career profile,
      opportunities, and drafts on this machine — no cloud account required.
    </p>
  </div>

  <ul class="flex flex-col gap-3 text-left text-sm">
    {#each [
      { icon: '🔒', title: 'Private by default', desc: 'Everything stays on your machine.' },
      { icon: '🤖', title: 'AI you control', desc: 'Use your own Ollama or bring an API key.' },
      { icon: '📂', title: 'Grows with you', desc: 'Your profile compounds across every application.' },
    ] as item}
      <li class="flex items-start gap-3 rounded-md border border-border bg-card p-4">
        <span class="text-lg leading-none" aria-hidden="true">{item.icon}</span>
        <div>
          <p class="font-medium">{item.title}</p>
          <p class="text-muted-foreground">{item.desc}</p>
        </div>
      </li>
    {/each}
  </ul>

  <Button href="/onboarding/connect" size="lg" class="w-full">Get started</Button>
</div>
