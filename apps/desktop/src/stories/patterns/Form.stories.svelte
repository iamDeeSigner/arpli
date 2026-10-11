<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import {
    Form,
    FormActions,
    FormField,
    FormRow,
    UnsavedIndicator,
  } from '$lib/components/patterns/form';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import ApplicationFormDemo from './ApplicationFormDemo.svelte';
  import AutoSaveDemo from './AutoSaveDemo.svelte';

  const { Story } = defineMeta({
    title: 'Patterns/Form',
    component: Form,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
  });
</script>

<Story name="Application form (createForm)">
  {#snippet template()}
    <ApplicationFormDemo />
  {/snippet}
</Story>

<Story name="FormField states">
  {#snippet template()}
    <div class="w-[420px] space-y-4">
      <FormField label="Field of study" description="Used to match opportunities.">
        {#snippet control(props)}<Input {...props} value="Marine biology" />{/snippet}
      </FormField>
      <FormField label="Expected graduation" required error="Pick a date in the future.">
        {#snippet control(props)}<Input {...props} value="June 2019" />{/snippet}
      </FormField>
      <FormField label="Student ID" disabled description="Verified by your university.">
        {#snippet control(props)}<Input {...props} value="S-2048-771" />{/snippet}
      </FormField>
    </div>
  {/snippet}
</Story>

<Story name="FormRow + FormActions">
  {#snippet template()}
    <div class="w-[560px] space-y-4">
      <FormRow>
        <FormField label="Award amount">
          {#snippet control(props)}<Input {...props} value="$25,000" />{/snippet}
        </FormField>
        <FormField label="Deadline">
          {#snippet control(props)}<Input {...props} value="Oct 20, 2026" />{/snippet}
        </FormField>
      </FormRow>
      <FormActions hint="⌘↵ to save">
        {#snippet destructive()}<Button variant="destructive">Delete</Button>{/snippet}
        {#snippet secondary()}<Button variant="ghost">Cancel</Button>{/snippet}
        {#snippet primary()}<Button variant="primary">Save opportunity</Button>{/snippet}
      </FormActions>
    </div>
  {/snippet}
</Story>

<Story name="AutoSaveField">
  {#snippet template()}
    <AutoSaveDemo />
  {/snippet}
</Story>

<Story name="AutoSaveField (save fails)">
  {#snippet template()}
    <AutoSaveDemo fail />
  {/snippet}
</Story>

<Story name="UnsavedIndicator">
  {#snippet template()}
    <div class="type-body flex items-center gap-6">
      {#each ['unsaved', 'saving', 'saved', 'error'] as const as status (status)}
        <span class="flex items-center gap-2">
          <UnsavedIndicator {status} label={status} />
          <span class="text-muted-foreground">{status}</span>
        </span>
      {/each}
    </div>
  {/snippet}
</Story>
