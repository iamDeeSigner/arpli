<!-- Story helper: owns `open` state for the confirm-pattern dialog components. -->
<script lang="ts">
  import { ContentDialog, DestructiveConfirm, FormDialog } from '$lib/components/patterns/confirm';
  import { FormField } from '$lib/components/patterns/form';
  import { notify } from '$lib/components/patterns/notify';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';

  let {
    kind,
    initialOpen = false,
  }: { kind: 'destructive' | 'form' | 'content'; initialOpen?: boolean } = $props();

  // svelte-ignore state_referenced_locally - initial value only
  let open = $state(initialOpen);
  let referee = $state('');
</script>

{#if kind === 'destructive'}
  <Button variant="destructive" onclick={() => (open = true)}>Withdraw application…</Button>
  <DestructiveConfirm
    bind:open
    title="Withdraw your Rhodes Scholarship application?"
    description="Your answers and uploaded documents stay in Arpli, but the application will be marked as withdrawn."
    confirmLabel="Withdraw"
    cancelLabel="Keep application"
    onConfirm={async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      open = false;
      notify.success('Application withdrawn');
    }}
  >
    {#snippet details()}
      <p class="type-body text-muted-foreground">Deadline: Oct 1, 2026 · 2 of 3 references received</p>
    {/snippet}
  </DestructiveConfirm>
{:else if kind === 'form'}
  <Button onclick={() => (open = true)}>Add referee…</Button>
  <FormDialog
    bind:open
    title="Add a referee"
    description="Arpli will list them on applications that ask for references."
    submitLabel="Add referee"
    cancelLabel="Cancel"
    canSubmit={referee.trim().length > 0}
    onSubmit={() => {
      open = false;
      notify.success(`${referee} added as a referee`);
      referee = '';
    }}
  >
    <FormField label="Full name" required>
      {#snippet control(props)}
        <Input {...props} bind:value={referee} placeholder="Dr. Amara Nwosu" />
      {/snippet}
    </FormField>
  </FormDialog>
{:else}
  <Button variant="outline" onclick={() => (open = true)}>View eligibility…</Button>
  <ContentDialog
    bind:open
    title="Gates Cambridge eligibility"
    description="Summarised from the official call for applications."
  >
    <ul class="type-body list-disc space-y-1 pl-5 text-foreground">
      <li>Citizen of any country outside the United Kingdom</li>
      <li>Applying for a full-time postgraduate degree at Cambridge</li>
      <li>Outstanding intellectual ability and leadership potential</li>
      <li>Commitment to improving the lives of others</li>
    </ul>
  </ContentDialog>
{/if}
