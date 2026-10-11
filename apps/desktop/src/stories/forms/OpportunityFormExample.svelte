<script lang="ts">
  import { Label } from '$lib/components/ui/label';
  import { Input } from '$lib/components/ui/input';
  import { Select } from '$lib/components/ui/select';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { Button } from '$lib/components/ui/button';
  import PlusIcon from 'phosphor-svelte/lib/PlusIcon';

  const typeItems = [
    { value: 'scholarship', label: 'Scholarship' },
    { value: 'grant', label: 'Grant' },
    { value: 'fellowship', label: 'Fellowship' },
    { value: 'internship', label: 'Paid internship' },
  ];

  let title = $state('');
  let organization = $state('');
  let type = $state('scholarship');
  let deadline = $state('');
  let url = $state('');
  let notes = $state('');
  let remind = $state(true);
  let saving = $state(false);
  let submitted = $state(false);

  const titleError = $derived(submitted && !title.trim() ? 'Give the opportunity a name.' : undefined);
  const typeLabel = $derived(typeItems.find((item) => item.value === type)?.label ?? type);

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    submitted = true;
    if (titleError) return;
    saving = true;
    setTimeout(() => (saving = false), 1200);
  }
</script>

<form
  class="flex w-[28rem] max-w-full flex-col gap-4 rounded-(--radius-large) border border-border bg-card p-6"
  onsubmit={handleSubmit}
  novalidate
>
  <div class="flex flex-col gap-1">
    <h2 class="type-title">Add opportunity</h2>
    <p class="type-caption text-muted-foreground">Track a scholarship, grant or fellowship you plan to apply for.</p>
  </div>

  <div class="flex flex-col gap-1.5">
    <Label for="opp-title" invalid={Boolean(titleError)}>Name</Label>
    <Input id="opp-title" bind:value={title} placeholder="e.g. Thiel Fellowship 2027" error={titleError} />
  </div>

  <div class="grid grid-cols-2 gap-4">
    <div class="flex flex-col gap-1.5">
      <Label for="opp-type">Type</Label>
      <Select.Root bind:value={type} items={typeItems}>
        <Select.Trigger id="opp-type">
          <span class="truncate">{typeLabel}</span>
        </Select.Trigger>
        <Select.Content portal>
          {#each typeItems as item (item.value)}
            <Select.Item value={item.value} label={item.label}>{item.label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>
    <div class="flex flex-col gap-1.5">
      <Label for="opp-deadline">Deadline</Label>
      <Input id="opp-deadline" type="date" bind:value={deadline} />
    </div>
  </div>

  <div class="flex flex-col gap-1.5">
    <Label for="opp-org">Organization</Label>
    <Input id="opp-org" bind:value={organization} placeholder="e.g. Thiel Foundation" />
  </div>

  <div class="flex flex-col gap-1.5">
    <Label for="opp-url">Application URL</Label>
    <Input id="opp-url" type="url" bind:value={url} placeholder="https://…" />
  </div>

  <div class="flex flex-col gap-1.5">
    <Label for="opp-notes">Notes</Label>
    <Textarea
      id="opp-notes"
      bind:value={notes}
      autoResize
      minHeight={72}
      placeholder="Eligibility, required essays, recommenders…"
      message="Only you can see these notes."
    />
  </div>

  <div class="flex items-center gap-2">
    <Checkbox id="opp-remind" bind:checked={remind} />
    <Label for="opp-remind">Remind me a week before the deadline</Label>
  </div>

  <div class="flex justify-end gap-2 pt-2">
    <Button variant="ghost" type="reset">Cancel</Button>
    <Button variant="primary" type="submit" loading={saving}>
      {#snippet leadingIcon()}<PlusIcon />{/snippet}
      Add opportunity
    </Button>
  </div>
</form>
