<!-- Story helper: a Dialog whose `open` state starts true so it renders open on load. -->
<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';

  let { size = 'default' }: { size?: 'sm' | 'default' | 'lg' | 'wide' } = $props();
  let open = $state(true);
</script>

<Button variant="secondary" onclick={() => (open = true)}>Reopen dialog</Button>

<Dialog.Root bind:open>
  <Dialog.Content {size}>
    <Dialog.Header>
      <Dialog.Title>Submit your application?</Dialog.Title>
      <Dialog.Description>
        Your application to the Rhodes Scholarship will be sent to the selection committee. You
        won't be able to edit your essays after submitting.
      </Dialog.Description>
    </Dialog.Header>
    <ul class="type-body flex flex-col gap-1 text-muted-foreground">
      <li>Personal statement · 998 / 1,000 words</li>
      <li>Two letters of recommendation received</li>
      <li>Official transcript uploaded</li>
    </ul>
    <Dialog.Footer>
      <Dialog.Close>
        {#snippet child({ props })}
          <Button {...props} variant="ghost">Keep editing</Button>
        {/snippet}
      </Dialog.Close>
      <Button variant="primary" onclick={() => (open = false)}>Submit application</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
