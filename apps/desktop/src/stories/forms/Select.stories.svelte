<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Select } from '$lib/components/ui/select';
  import { Label } from '$lib/components/ui/label';

  const { Story } = defineMeta({
    title: 'Forms/Select',
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
  });

  const typeItems = [
    { value: 'scholarship', label: 'Scholarship' },
    { value: 'grant', label: 'Grant' },
    { value: 'fellowship', label: 'Fellowship' },
    { value: 'internship', label: 'Paid internship' },
    { value: 'loan', label: 'Loan (not supported)', disabled: true },
  ];

  const labelFor = (value: string) => typeItems.find((item) => item.value === value)?.label;
</script>

<script lang="ts">
  let type = $state('scholarship');
  let empty = $state('');
  let variantValues = $state<Record<string, string>>({
    default: 'grant',
    secondary: 'grant',
    ghost: 'grant',
    underline: 'grant',
  });
</script>

<Story name="Basic">
  <div class="flex w-64 flex-col gap-1.5">
    <Label for="select-type">Opportunity type</Label>
    <Select.Root bind:value={type} items={typeItems}>
      <Select.Trigger id="select-type">
        <span class="truncate">{labelFor(type)}</span>
      </Select.Trigger>
      <Select.Content portal>
        {#each typeItems as item (item.value)}
          <Select.Item value={item.value} label={item.label} disabled={item.disabled}>{item.label}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>
</Story>

<Story name="Placeholder">
  <div class="w-64">
    <Select.Root bind:value={empty} items={typeItems}>
      <Select.Trigger aria-label="Opportunity type">
        <span class="truncate" class:text-muted-foreground={!empty}>{labelFor(empty) ?? 'Choose a type…'}</span>
      </Select.Trigger>
      <Select.Content portal>
        {#each typeItems as item (item.value)}
          <Select.Item value={item.value} label={item.label} disabled={item.disabled}>{item.label}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>
</Story>

<Story name="Trigger variants">
  <div class="flex w-64 flex-col gap-3">
    {#each ['default', 'secondary', 'ghost', 'underline'] as const as variant (variant)}
      <Select.Root bind:value={variantValues[variant]} items={typeItems}>
        <Select.Trigger {variant} aria-label="Type ({variant})">
          <span class="truncate">{labelFor(variantValues[variant])} · {variant}</span>
        </Select.Trigger>
        <Select.Content portal>
          {#each typeItems as item (item.value)}
            <Select.Item value={item.value} label={item.label} disabled={item.disabled}>{item.label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    {/each}
  </div>
</Story>

<Story name="Invalid and disabled">
  <div class="flex w-64 flex-col gap-3">
    <Select.Root value="" items={typeItems} invalid>
      <Select.Trigger aria-label="Required type">
        <span class="truncate text-muted-foreground">Type is required</span>
      </Select.Trigger>
      <Select.Content portal>
        {#each typeItems as item (item.value)}
          <Select.Item value={item.value} label={item.label}>{item.label}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
    <Select.Root value="fellowship" items={typeItems} disabled>
      <Select.Trigger aria-label="Locked type">
        <span class="truncate">Fellowship</span>
      </Select.Trigger>
      <Select.Content portal>
        {#each typeItems as item (item.value)}
          <Select.Item value={item.value} label={item.label}>{item.label}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>
</Story>
