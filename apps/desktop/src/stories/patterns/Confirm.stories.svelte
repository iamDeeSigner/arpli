<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { alert, confirm, prompt, ConfirmHost } from '$lib/components/patterns/confirm';
  import { notify } from '$lib/components/patterns/notify';
  import { Button } from '$lib/components/ui/button';
  import ConfirmDialogDemo from './ConfirmDialogDemo.svelte';

  const { Story } = defineMeta({
    title: 'Patterns/Confirm',
    component: ConfirmHost,
    tags: ['autodocs'],
    parameters: {
      layout: 'centered',
      docs: {
        description: {
          component:
            '`confirm()`, `alert()` and `prompt()` return promises and render through a single `<ConfirmHost />` (mounted in each story here). `DestructiveConfirm`, `FormDialog` and `ContentDialog` are the declarative building blocks.',
        },
      },
    },
  });

  async function deleteDraft() {
    const ok = await confirm({
      title: 'Delete this essay draft?',
      description: '“Why I want to study public health” will be removed from this device.',
      confirmLabel: 'Delete draft',
      cancelLabel: 'Cancel',
      destructive: true,
    });
    if (ok) notify.success('Draft deleted');
    else notify.info('Kept your draft');
  }

  async function submitApplication() {
    const ok = await confirm({
      title: 'Mark as submitted?',
      description: 'Arpli will stop reminding you about the NSF GRFP deadline.',
      confirmLabel: 'Mark submitted',
      onConfirm: () => new Promise((resolve) => setTimeout(resolve, 800)),
    });
    if (ok) notify.success('NSF GRFP marked as submitted');
  }

  async function showAlert() {
    await alert({
      title: 'This call has closed',
      description: 'The Knight-Hennessy deadline passed on Oct 9, 2026. We’ll let you know when the next round opens.',
      confirmLabel: 'Got it',
    });
  }

  async function renameApplication() {
    const name = await prompt({
      title: 'Rename application',
      confirmLabel: 'Rename',
      field: {
        label: 'Application name',
        initialValue: 'Fulbright 2027 — Germany',
        required: true,
      },
    });
    if (name) notify.success(`Renamed to “${name}”`);
  }
</script>

<Story name="Service: confirm, alert, prompt">
  {#snippet template()}
    <div class="flex flex-wrap gap-2">
      <Button variant="destructive" onclick={deleteDraft}>Delete draft…</Button>
      <Button variant="primary" onclick={submitApplication}>Mark submitted…</Button>
      <Button onclick={showAlert}>Show closed-call alert</Button>
      <Button variant="outline" onclick={renameApplication}>Rename…</Button>
    </div>
    <ConfirmHost />
  {/snippet}
</Story>

<Story name="DestructiveConfirm">
  {#snippet template()}
    <ConfirmDialogDemo kind="destructive" />
  {/snippet}
</Story>

<Story name="DestructiveConfirm (open)">
  {#snippet template()}
    <ConfirmDialogDemo kind="destructive" initialOpen />
  {/snippet}
</Story>

<Story name="FormDialog">
  {#snippet template()}
    <ConfirmDialogDemo kind="form" />
  {/snippet}
</Story>

<Story name="FormDialog (open)">
  {#snippet template()}
    <ConfirmDialogDemo kind="form" initialOpen />
  {/snippet}
</Story>

<Story name="ContentDialog">
  {#snippet template()}
    <ConfirmDialogDemo kind="content" />
  {/snippet}
</Story>

<Story name="ContentDialog (open)">
  {#snippet template()}
    <ConfirmDialogDemo kind="content" initialOpen />
  {/snippet}
</Story>
