<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Content as PopoverContent } from '$lib/components/ui/popover';
  import * as Popover from '$lib/components/ui/popover';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import InfoIcon from 'phosphor-svelte/lib/InfoIcon';

  const { Story } = defineMeta({
    title: 'Overlays/Popover',
    component: PopoverContent,
    tags: ['autodocs'],
    args: { side: 'bottom', align: 'center', sideOffset: 4 },
    argTypes: {
      side: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
      align: { control: 'select', options: ['start', 'center', 'end'] },
      sideOffset: { control: { type: 'number', min: 0, max: 24 } },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <Popover.Root>
      <Popover.Trigger>
        {#snippet child({ props })}
          <Button {...props} variant="secondary"><InfoIcon aria-hidden="true" />Eligibility</Button>
        {/snippet}
      </Popover.Trigger>
      <Popover.Content side={args.side} align={args.align} sideOffset={args.sideOffset} class="w-72 p-3">
        <p class="type-body font-medium text-foreground">Who can apply</p>
        <p class="type-caption mt-1 text-muted-foreground">
          U.S. citizens with a bachelor's degree by the start of the grant period. Graduating
          seniors may apply.
        </p>
      </Popover.Content>
    </Popover.Root>
  {/snippet}
</Story>

<Story name="With form">
  {#snippet template()}
    <Popover.Root>
      <Popover.Trigger>
        {#snippet child({ props })}
          <Button {...props} variant="primary">Set reminder</Button>
        {/snippet}
      </Popover.Trigger>
      <Popover.Content class="flex w-72 flex-col gap-3 p-3">
        <div class="flex flex-col gap-1.5">
          <Label for="pop-days">Remind me before the deadline</Label>
          <Input id="pop-days" type="number" value="7" />
        </div>
        <div class="flex justify-end gap-2">
          <Popover.Close>
            {#snippet child({ props })}
              <Button {...props} variant="ghost" size="sm">Cancel</Button>
            {/snippet}
          </Popover.Close>
          <Popover.Close>
            {#snippet child({ props })}
              <Button {...props} variant="primary" size="sm">Save</Button>
            {/snippet}
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover.Root>
  {/snippet}
</Story>
