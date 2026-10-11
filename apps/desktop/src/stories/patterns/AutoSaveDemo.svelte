<!-- Story helper: AutoSaveField around a profile headline input. -->
<script lang="ts">
  import { AutoSaveField, UnsavedIndicator } from '$lib/components/patterns/form';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  let { fail = false }: { fail?: boolean } = $props();
  let saved = $state('Environmental engineer working on rural water access');
</script>

<div class="w-[480px] space-y-1.5">
  <Label for="headline" class="type-body font-medium">Profile headline</Label>
  <AutoSaveField
    value={saved}
    debounceMs={800}
    onSave={async (next) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (fail) throw new Error('Save failed');
      saved = next;
    }}
    statusLabel={(status) => (status === 'idle' ? undefined : status)}
  >
    {#snippet children(control)}
      <div class="flex items-center gap-2">
        <Input
          id="headline"
          value={control.value}
          oninput={(event) => control.update(event.currentTarget.value)}
          onfocus={control.onfocus}
          onblur={control.onblur}
          onkeydown={control.onkeydown}
          disabled={control.disabled}
        />
        <UnsavedIndicator status={control.status} label={control.status} />
      </div>
    {/snippet}
  </AutoSaveField>
  <p class="type-caption text-muted-foreground">Saved value: {saved}</p>
</div>
