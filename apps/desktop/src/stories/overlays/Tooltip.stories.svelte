<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Tooltip, TooltipRich, TooltipShortcut } from '$lib/components/ui/tooltip';
  import { Button } from '$lib/components/ui/button';
  import BookmarkSimpleIcon from 'phosphor-svelte/lib/BookmarkSimpleIcon';
  import ShareNetworkIcon from 'phosphor-svelte/lib/ShareNetworkIcon';
  import TrashIcon from 'phosphor-svelte/lib/TrashIcon';

  const { Story } = defineMeta({
    title: 'Overlays/Tooltip',
    component: Tooltip,
    tags: ['autodocs'],
    args: {
      content: 'Save to your shortlist',
      side: 'top',
      align: 'center',
      variant: 'default',
      size: 'default',
      showArrow: false,
      disabled: false,
    },
    argTypes: {
      content: { control: 'text' },
      side: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
      align: { control: 'select', options: ['start', 'center', 'end'] },
      variant: { control: 'select', options: ['default', 'secondary', 'destructive', 'outline'] },
      size: { control: 'select', options: ['sm', 'default', 'lg'] },
      showArrow: { control: 'boolean' },
      disabled: { control: 'boolean' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <Tooltip {...args}>
      <Button variant="ghost" size="icon" iconOnly aria-label="Save to shortlist">
        <BookmarkSimpleIcon aria-hidden="true" />
      </Button>
    </Tooltip>
  {/snippet}
</Story>

<Story name="Variants">
  <div class="flex gap-6 p-10">
    {#each ['default', 'secondary', 'destructive', 'outline'] as const as variant (variant)}
      <Tooltip content="Deadline in 3 days" {variant}>
        <Button variant="secondary">{variant}</Button>
      </Tooltip>
    {/each}
  </div>
</Story>

<Story name="Sides">
  <div class="flex gap-6 p-16">
    {#each ['top', 'right', 'bottom', 'left'] as const as side (side)}
      <Tooltip content="Share opportunity" {side} showArrow>
        <Button variant="ghost" size="icon" iconOnly aria-label="Share ({side})">
          <ShareNetworkIcon aria-hidden="true" />
        </Button>
      </Tooltip>
    {/each}
  </div>
</Story>

<Story name="Rich">
  <div class="flex gap-6 p-16">
    <TooltipRich
      title="Recommendation letters"
      description="Two of three letters received. Dr. Patel's letter is still pending."
    >
      <Button variant="secondary">Default</Button>
    </TooltipRich>
    <TooltipRich
      variant="info"
      title="Rolling admissions"
      description="Applications are reviewed as they arrive — apply early."
    >
      <Button variant="secondary">Info</Button>
    </TooltipRich>
    <TooltipRich variant="success" title="Submitted" description="Received on Sep 30, 2026.">
      <Button variant="secondary">Success</Button>
    </TooltipRich>
    <TooltipRich
      variant="warning"
      title="Deadline soon"
      description="The Marshall Scholarship closes in 2 days."
    >
      <Button variant="secondary">Warning</Button>
    </TooltipRich>
    <TooltipRich variant="error" title="Upload failed" description="Transcript must be a PDF.">
      <Button variant="secondary">Error</Button>
    </TooltipRich>
  </div>
</Story>

<Story name="Shortcut">
  <div class="flex gap-6 p-16">
    <TooltipShortcut label="Search opportunities" shortcut={['Mod', 'K']}>
      <Button variant="secondary">Search</Button>
    </TooltipShortcut>
    <TooltipShortcut
      label="Delete draft"
      shortcut={['Mod', 'Backspace']}
      secondary={{ label: 'Archive instead', shortcut: ['Mod', 'E'] }}
    >
      <Button variant="ghost" size="icon" iconOnly aria-label="Delete draft">
        <TrashIcon aria-hidden="true" />
      </Button>
    </TooltipShortcut>
  </div>
</Story>
