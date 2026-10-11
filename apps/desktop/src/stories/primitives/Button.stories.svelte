<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import { Button } from '$lib/components/ui/button';
  import PlusIcon from 'phosphor-svelte/lib/PlusIcon';
  import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
  import PaperPlaneTiltIcon from 'phosphor-svelte/lib/PaperPlaneTiltIcon';
  import TrashIcon from 'phosphor-svelte/lib/TrashIcon';
  import BookmarkSimpleIcon from 'phosphor-svelte/lib/BookmarkSimpleIcon';
  import DotsThreeIcon from 'phosphor-svelte/lib/DotsThreeIcon';
  import DownloadIcon from 'phosphor-svelte/lib/DownloadIcon';

  const variants = [
    'primary',
    'secondary',
    'outline',
    'ghost',
    'ghost-light',
    'destructive',
    'link',
    'underline',
    'plain',
  ] as const;
  const textSizes = ['compact', 'sm', 'default', 'lg', 'xl'] as const;
  const iconSizes = ['icon-compact', 'icon-sm', 'icon', 'icon-lg'] as const;

  const { Story } = defineMeta({
    title: 'Primitives/Button',
    component: Button,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: {
      variant: 'primary',
      size: 'default',
      loading: false,
      disabled: false,
      active: false,
      onclick: fn(),
    },
    argTypes: {
      variant: { control: 'select', options: variants },
      size: { control: 'select', options: textSizes },
      loading: { control: 'boolean' },
      disabled: { control: 'boolean' },
      active: { control: 'boolean' },
      tooltip: { control: 'text' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <Button {...args}>Submit application</Button>
  {/snippet}
</Story>

<Story name="Variants">
  {#snippet template()}
    <div class="flex flex-wrap items-center gap-3">
      {#each variants as variant (variant)}
        <Button {variant}>{variant}</Button>
      {/each}
    </div>
  {/snippet}
</Story>

<Story name="Sizes">
  {#snippet template()}
    <div class="flex flex-col gap-6">
      <div class="flex flex-wrap items-center gap-3">
        {#each textSizes as size (size)}
          <Button variant="secondary" {size}>Save draft ({size})</Button>
        {/each}
      </div>
      <div class="flex flex-wrap items-center gap-3">
        {#each iconSizes as size (size)}
          <Button variant="outline" {size} aria-label="Add opportunity ({size})">
            <PlusIcon />
          </Button>
        {/each}
        {#each iconSizes as size (size)}
          <Button variant="ghost" {size} aria-label="More actions ({size})">
            <DotsThreeIcon />
          </Button>
        {/each}
      </div>
    </div>
  {/snippet}
</Story>

<Story name="With icons">
  {#snippet template()}
    <div class="flex flex-wrap items-center gap-3">
      <Button variant="primary">
        {#snippet leadingIcon()}<PlusIcon />{/snippet}
        New opportunity
      </Button>
      <Button variant="secondary">
        Continue to essays
        {#snippet trailingIcon()}<ArrowRightIcon />{/snippet}
      </Button>
      <Button variant="outline">
        {#snippet leadingIcon()}<DownloadIcon />{/snippet}
        Export transcript
      </Button>
      <Button variant="destructive">
        {#snippet leadingIcon()}<TrashIcon />{/snippet}
        Withdraw application
      </Button>
      <Button variant="ghost" size="sm">
        {#snippet leadingIcon()}<BookmarkSimpleIcon />{/snippet}
        Save for later
      </Button>
    </div>
  {/snippet}
</Story>

<Story name="States">
  {#snippet template()}
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-3">
        <span class="type-caption w-20 text-muted-foreground">Loading</span>
        <Button variant="primary" loading>Submitting…</Button>
        <Button variant="secondary" loading>Saving</Button>
        <Button variant="outline" size="sm" loading>Uploading</Button>
        <Button variant="ghost" size="icon" loading aria-label="Sending">
          <PaperPlaneTiltIcon />
        </Button>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <span class="type-caption w-20 text-muted-foreground">Disabled</span>
        {#each ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const as variant (variant)}
          <Button {variant} disabled>Submit</Button>
        {/each}
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <span class="type-caption w-20 text-muted-foreground">Active</span>
        {#each ['primary', 'secondary', 'outline', 'ghost'] as const as variant (variant)}
          <Button {variant} active>Shortlisted</Button>
        {/each}
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <span class="type-caption w-20 text-muted-foreground">As link</span>
        <Button variant="link" href="#guidelines">View eligibility guidelines</Button>
      </div>
    </div>
  {/snippet}
</Story>

<Story name="With tooltip">
  {#snippet template()}
    <div class="flex items-center gap-3">
      <Button variant="outline" tooltip="Create a new opportunity" tooltipShortcut="⌘N">
        {#snippet leadingIcon()}<PlusIcon />{/snippet}
        New
      </Button>
      <Button variant="ghost" size="icon" tooltip="Bookmark this scholarship" tooltipSide="bottom">
        <BookmarkSimpleIcon />
      </Button>
      <Button variant="ghost" size="icon" tooltip="Delete draft" tooltipShortcut="⌫" tooltipSide="right">
        <TrashIcon />
      </Button>
    </div>
  {/snippet}
</Story>

<Story name="Long label">
  {#snippet template()}
    <div class="w-56">
      <Button variant="secondary" class="w-full">
        Submit application for the Rhodes Scholarship 2027 cycle
      </Button>
    </div>
  {/snippet}
</Story>
