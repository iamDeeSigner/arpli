<!-- Story helper: keeps the saved value in local state so edits persist in the story. -->
<script lang="ts">
  import EditableName from '$lib/components/ui/EditableName.svelte';

  let {
    initial = 'Rhodes personal statement',
    disabled = false,
    textClass,
    maxWidth = 240,
  }: { initial?: string; disabled?: boolean; textClass?: string; maxWidth?: number } = $props();

  let name = $state('');
  $effect.pre(() => {
    name = initial;
  });
</script>

<div class="flex flex-col items-start gap-1">
  <EditableName value={name} onSave={(v) => (name = v)} {disabled} {textClass} {maxWidth} />
  <span class="type-caption text-muted-foreground">Saved value: {name || '—'}</span>
</div>
