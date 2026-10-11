<!-- Story helper: a Sheet whose `open` state starts true so it renders open on load. -->
<script lang="ts">
  import * as Sheet from '$lib/components/ui/sheet';
  import { Button } from '$lib/components/ui/button';

  let { side = 'right' }: { side?: 'top' | 'right' | 'bottom' | 'left' } = $props();
  let open = $state(true);
</script>

<Button variant="secondary" onclick={() => (open = true)}>Reopen sheet</Button>

<Sheet.Root bind:open>
  <Sheet.Content {side}>
    <Sheet.Header>
      <Sheet.Title>Knight-Hennessy Scholars</Sheet.Title>
      <Sheet.Description>Stanford University · Graduate funding</Sheet.Description>
    </Sheet.Header>
    <div class="type-body flex flex-1 flex-col gap-3 py-4 text-foreground">
      <p>
        Full funding for any graduate degree at Stanford, plus leadership development and a
        multidisciplinary cohort.
      </p>
      <dl class="grid grid-cols-[8rem_1fr] gap-y-2">
        <dt class="text-muted-foreground">Deadline</dt>
        <dd>October 9, 2026</dd>
        <dt class="text-muted-foreground">Award</dt>
        <dd>Full tuition + stipend</dd>
        <dt class="text-muted-foreground">Status</dt>
        <dd>Draft · 3 of 5 sections done</dd>
      </dl>
    </div>
    <Sheet.Footer>
      <Sheet.Close>
        {#snippet child({ props })}
          <Button {...props} variant="ghost">Close</Button>
        {/snippet}
      </Sheet.Close>
      <Button variant="primary">Continue application</Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
