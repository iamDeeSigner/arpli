<!-- Story helper: a createForm()-driven application form (createForm uses runes, so it lives here). -->
<script lang="ts">
  import {
    Form,
    FormActions,
    FormField,
    FormRow,
    createForm,
  } from '$lib/components/patterns/form';
  import { notify } from '$lib/components/patterns/notify';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';

  let { busy = false }: { busy?: boolean } = $props();

  const form = createForm({
    initial: {
      fullName: 'Maya Okafor',
      email: 'maya.okafor@example.edu',
      institution: 'TU Delft',
      gpa: '',
      statement: '',
    },
    validate: (values) => {
      const errors: Partial<Record<keyof typeof values, string>> = {};
      if (!values.email.includes('@')) errors.email = 'Enter a valid email address.';
      if (!values.gpa.trim()) errors.gpa = 'GPA is required by this scholarship.';
      if (values.statement.trim().split(/\s+/).filter(Boolean).length < 5)
        errors.statement = 'Write at least a few sentences.';
      return errors;
    },
  });
</script>

<Form
  class="w-[560px] space-y-4"
  {busy}
  onSubmit={async () => {
    await form.submit(async () => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      notify.success('Application saved');
    });
  }}
>
  <FormRow>
    <FormField label="Full name" required error={form.errors.fullName}>
      {#snippet control(props)}<Input {...props} bind:value={form.values.fullName} />{/snippet}
    </FormField>
    <FormField label="Email" required error={form.errors.email}>
      {#snippet control(props)}<Input {...props} type="email" bind:value={form.values.email} />{/snippet}
    </FormField>
  </FormRow>
  <FormRow>
    <FormField label="Institution" description="Where you are currently enrolled.">
      {#snippet control(props)}<Input {...props} bind:value={form.values.institution} />{/snippet}
    </FormField>
    <FormField label="GPA" required error={form.errors.gpa}>
      {#snippet control(props)}<Input {...props} bind:value={form.values.gpa} placeholder="e.g. 3.8 / 4.0" />{/snippet}
    </FormField>
  </FormRow>
  <FormField
    label="Personal statement"
    description="Why are you applying for the Gates Cambridge Scholarship?"
    error={form.errors.statement}
  >
    {#snippet control(props)}
      <Textarea {...props} bind:value={form.values.statement} autoResize />
    {/snippet}
  </FormField>
  <FormActions hint={form.dirty ? 'Unsaved changes' : undefined}>
    {#snippet secondary()}
      <Button variant="ghost" type="button" onclick={() => form.reset()} disabled={!form.dirty}>Reset</Button>
    {/snippet}
    {#snippet primary()}
      <Button variant="primary" type="submit" loading={form.submitting}>Save application</Button>
    {/snippet}
  </FormActions>
</Form>
