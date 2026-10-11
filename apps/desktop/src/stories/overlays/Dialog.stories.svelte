<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Content as DialogContent } from '$lib/components/ui/dialog';
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import DialogOpenDemo from './DialogOpenDemo.svelte';

  const { Story } = defineMeta({
    title: 'Overlays/Dialog',
    component: DialogContent,
    tags: ['autodocs'],
    args: { size: 'default', showCloseButton: true },
    argTypes: {
      size: { control: 'select', options: ['sm', 'default', 'lg', 'wide'] },
      showCloseButton: { control: 'boolean' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <Dialog.Root>
      <Dialog.Trigger>
        {#snippet child({ props })}
          <Button {...props} variant="primary">Withdraw application</Button>
        {/snippet}
      </Dialog.Trigger>
      <Dialog.Content size={args.size} showCloseButton={args.showCloseButton}>
        <Dialog.Header>
          <Dialog.Title>Withdraw from the Fulbright Program?</Dialog.Title>
          <Dialog.Description>
            The committee will be notified and your draft essays will be kept in your profile.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.Close>
            {#snippet child({ props })}
              <Button {...props} variant="ghost">Cancel</Button>
            {/snippet}
          </Dialog.Close>
          <Dialog.Close>
            {#snippet child({ props })}
              <Button {...props} variant="destructive">Withdraw</Button>
            {/snippet}
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  {/snippet}
</Story>

<Story name="Open by default">
  <DialogOpenDemo />
</Story>

<Story name="With form">
  <Dialog.Root>
    <Dialog.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="secondary">Add deadline</Button>
      {/snippet}
    </Dialog.Trigger>
    <Dialog.Content size="lg">
      <Dialog.Header>
        <Dialog.Title>Add a deadline</Dialog.Title>
        <Dialog.Description>Track an opportunity you found outside Arpli.</Dialog.Description>
      </Dialog.Header>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <Label for="dlg-name">Opportunity</Label>
          <Input id="dlg-name" placeholder="e.g. Gates Cambridge Scholarship" />
        </div>
        <div class="flex flex-col gap-1.5">
          <Label for="dlg-date">Deadline</Label>
          <Input id="dlg-date" type="date" />
        </div>
      </div>
      <Dialog.Footer>
        <Dialog.Close>
          {#snippet child({ props })}
            <Button {...props} variant="ghost">Cancel</Button>
          {/snippet}
        </Dialog.Close>
        <Button variant="primary">Save deadline</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
</Story>

<Story name="Sizes">
  <div class="flex gap-2">
    {#each ['sm', 'default', 'lg', 'wide'] as const as size (size)}
      <Dialog.Root>
        <Dialog.Trigger>
          {#snippet child({ props })}
            <Button {...props} variant="secondary">{size}</Button>
          {/snippet}
        </Dialog.Trigger>
        <Dialog.Content {size}>
          <Dialog.Header>
            <Dialog.Title>Eligibility check</Dialog.Title>
            <Dialog.Description>
              This dialog uses the <code class="type-code">{size}</code> size. You meet 4 of 5 criteria
              for the Marshall Scholarship.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Dialog.Close>
              {#snippet child({ props })}
                <Button {...props} variant="primary">Got it</Button>
              {/snippet}
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    {/each}
  </div>
</Story>
