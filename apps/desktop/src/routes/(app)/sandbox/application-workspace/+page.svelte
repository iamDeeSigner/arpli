<script lang="ts">
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { Select } from '$lib/components/ui/select';
  import { Separator } from '$lib/components/ui/separator';
  import { Textarea } from '$lib/components/ui/textarea';
  import * as ToggleGroup from '$lib/components/ui/toggle-group';
  import { Tooltip } from '$lib/components/ui/tooltip';
  import { toast } from '$lib/components/ui/toast';
  import ArrowClockwiseIcon from 'phosphor-svelte/lib/ArrowClockwiseIcon';
  import BuildingsIcon from 'phosphor-svelte/lib/BuildingsIcon';
  import CalendarIcon from 'phosphor-svelte/lib/CalendarIcon';
  import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
  import ClockCounterClockwiseIcon from 'phosphor-svelte/lib/ClockCounterClockwiseIcon';
  import CopyIcon from 'phosphor-svelte/lib/CopyIcon';
  import FloppyDiskIcon from 'phosphor-svelte/lib/FloppyDiskIcon';
  import LinkSimpleIcon from 'phosphor-svelte/lib/LinkSimpleIcon';
  import PlusIcon from 'phosphor-svelte/lib/PlusIcon';
  import SparkleIcon from 'phosphor-svelte/lib/SparkleIcon';

  interface MockQuestion {
    id: string;
    text: string;
    wordLimit?: number;
  }

  interface MockDraftVersion {
    version: number;
    content: string;
    wordCount: number;
    createdAt: string;
  }

  interface QuestionState {
    content: string;
    tone: string;
    instruction: string;
    dirty: boolean;
    busy: boolean;
    versions: MockDraftVersion[];
  }

  const MOCK_OPP = {
    title: 'Schwarzman Scholars 2025',
    organization: 'Stephen A. Schwarzman Education Foundation',
    type: 'Fellowship',
    url: 'https://www.schwarzmanscholars.org',
    deadline: '2025-09-18',
  };

  const MOCK_QUESTIONS: MockQuestion[] = [
    { id: 'q1', text: 'Describe your most meaningful leadership experience and what you learned from it.', wordLimit: 750 },
    { id: 'q2', text: "How has your understanding of China or the Asia-Pacific region shaped your thinking about the world's most pressing challenges?", wordLimit: 500 },
    { id: 'q3', text: 'What is the most important problem or challenge in your field? How do you plan to address it?', wordLimit: 500 },
    { id: 'q4', text: 'Describe a time you failed at something significant. What did you learn, and how did you apply those lessons?', wordLimit: 250 },
    { id: 'q5', text: 'Why Schwarzman Scholars? How will this program help you achieve your long-term goals?', wordLimit: 250 },
  ];

  const MOCK_PROFILE_FOCUS_OPTIONS = [
    { id: 'researcher', label: 'Researcher', description: 'Academic publications & lab work' },
    { id: 'founder', label: 'Founder', description: 'Startup & product experience' },
    { id: 'policy', label: 'Policy', description: 'Government & civic work' },
    { id: 'community', label: 'Community', description: 'Service & social impact' },
  ];

  const TONE_OPTIONS = [
    { value: 'professional', label: 'Professional' },
    { value: 'warm', label: 'Warm' },
    { value: 'concise', label: 'Concise' },
    { value: 'academic', label: 'Academic' },
    { value: 'ambitious', label: 'Ambitious' },
  ];

  const STATUS_OPTIONS = [
    { value: 'discovered', label: 'Discovered' },
    { value: 'qualifying', label: 'Qualifying' },
    { value: 'drafting', label: 'Drafting' },
    { value: 'reviewing', label: 'Reviewing' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'awaiting', label: 'Awaiting' },
    { value: 'won', label: 'Won' },
    { value: 'rejected', label: 'Rejected' },
  ];

  let activeId = $state('q1');
  let status = $state('drafting');
  let profileFocus = $state('researcher');

  let qs = $state<Record<string, QuestionState>>(
    Object.fromEntries(
      MOCK_QUESTIONS.map((q) => [
        q.id,
        { content: '', tone: '', instruction: '', dirty: false, busy: false, versions: [] },
      ]),
    ),
  );

  const activeQuestion = $derived(MOCK_QUESTIONS.find((q) => q.id === activeId)!);
  const activeState = $derived(qs[activeId]);
  const wordCount = $derived(
    activeState.content.trim() === '' ? 0 : activeState.content.trim().split(/\s+/u).length,
  );
  const isOverLimit = $derived(activeQuestion.wordLimit != null && wordCount > activeQuestion.wordLimit);
  const draftedCount = $derived(MOCK_QUESTIONS.filter((q) => qs[q.id].content.trim() !== '').length);
  const canSave = $derived(activeState.content.trim() !== '' && activeState.dirty);

  let _lastContent = $state('');

  $effect(() => {
    const content = qs[activeId].content;
    if (content !== _lastContent) {
      if (_lastContent !== '') qs[activeId].dirty = true;
      _lastContent = content;
    }
  });

  $effect(() => {
    activeId; // eslint-disable-line @typescript-eslint/no-unused-expressions
    _lastContent = qs[activeId].content;
  });

  const SAMPLE_WORDS = [
    'Throughout', 'my', 'research', 'at', 'MIT', 'I', 'led', 'a', 'team', 'of', 'six',
    'engineers', 'developing', 'novel', 'carbon-capture', 'membranes', 'that', 'achieved',
    'a', '40%', 'efficiency', 'improvement.', 'This', 'experience', 'taught', 'me', 'that',
    'leadership', 'means', 'creating', 'conditions', 'for', 'others', 'to', 'do', 'their',
    'best', 'work', 'across', 'disciplines',
  ];

  async function fakeRegenerate() {
    qs[activeId].busy = true;
    await new Promise<void>((r) => setTimeout(r, 1400));
    const target = Math.min(activeQuestion.wordLimit ?? 300, 80);
    const content = Array.from({ length: target }, (_, i) => SAMPLE_WORDS[i % SAMPLE_WORDS.length]).join(' ') + '.';
    qs[activeId].content = content;
    qs[activeId].busy = false;
    qs[activeId].dirty = true;
    const v: MockDraftVersion = {
      version: qs[activeId].versions.length + 1,
      content,
      wordCount: content.split(/\s+/u).length,
      createdAt: new Date().toISOString(),
    };
    qs[activeId].versions = [v, ...qs[activeId].versions];
  }

  async function copyAnswer() {
    const content = activeState.content;
    if (!content.trim()) return;
    try {
      await navigator.clipboard.writeText(content);
      toast('Copied to clipboard');
    } catch {
      toast('Copy failed — select and copy manually');
    }
  }

  function restoreVersion(v: MockDraftVersion) {
    qs[activeId].content = v.content;
    qs[activeId].dirty = true;
    toast(`Restored v${v.version}`);
  }

  function formatDeadline(d: string) {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(d));
  }

  function daysUntil(d: string) {
    return Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  }
</script>

<div class="flex min-h-0 flex-1 flex-col overflow-hidden">

  <header class="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
    <div class="flex min-w-0 flex-1 items-center gap-2">
      <Badge color="blue" size="compact">{MOCK_OPP.type}</Badge>
      <h1 class="truncate text-sm font-semibold">{MOCK_OPP.title}</h1>
      <span class="hidden shrink-0 text-xs text-muted-foreground xl:block">{MOCK_OPP.organization}</span>
    </div>
    <div class="flex shrink-0 items-center gap-2">
      <Badge variant="dot" color={daysUntil(MOCK_OPP.deadline) <= 14 ? 'red' : 'amber'} size="compact">
        Due {formatDeadline(MOCK_OPP.deadline)}
      </Badge>
      <div class="w-32">
        <Select.Root bind:value={status} items={STATUS_OPTIONS}>
          <Select.Trigger aria-label="Application status">
            <Select.Value placeholder="Status" />
          </Select.Trigger>
          <Select.Content portal class="w-32">
            {#each STATUS_OPTIONS as item (item.value)}
              <Select.Item value={item.value} label={item.label}>{item.label}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>
      <Tooltip content="Open source form">
        <Button size="icon-sm" variant="ghost" aria-label="Open source form">
          <LinkSimpleIcon />
        </Button>
      </Tooltip>
    </div>
  </header>

  <div class="flex min-h-0 flex-1 overflow-hidden">

    <aside class="flex w-64 shrink-0 flex-col border-r border-border">
      <div class="flex h-10 shrink-0 items-center gap-2 px-3">
        <span class="flex-1 text-xs font-medium text-muted-foreground">Questions</span>
        <Badge size="compact" color="lime">{draftedCount}/{MOCK_QUESTIONS.length}</Badge>
      </div>
      <Separator />
      <ScrollArea class="h-full">
        <div class="flex flex-col gap-0.5 p-2">
          {#each MOCK_QUESTIONS as q, i (q.id)}
            {@const qst = qs[q.id]}
            {@const wc = qst.content.trim() === '' ? 0 : qst.content.trim().split(/\s+/u).length}
            {@const over = q.wordLimit != null && wc > q.wordLimit}
            <button
              onclick={() => (activeId = q.id)}
              class="flex w-full flex-col gap-1 rounded-md px-2.5 py-2 text-left transition-colors {activeId === q.id
                ? 'bg-selected'
                : 'hover:bg-hover'}"
            >
              <div class="flex items-center gap-2">
                <span class="text-xs font-medium text-muted-foreground">Q{i + 1}</span>
                {#if qst.content.trim() !== ''}
                  <Badge color={over ? 'red' : 'lime'} size="compact" variant="dot">
                    {wc}{q.wordLimit ? `/${q.wordLimit}` : ''} w
                  </Badge>
                {:else if q.wordLimit}
                  <span class="text-xs text-muted-foreground">{q.wordLimit}w</span>
                {/if}
              </div>
              <p class="line-clamp-2 text-xs text-foreground/80">{q.text}</p>
            </button>
          {/each}
        </div>
        <div class="px-2 pb-2">
          <Button variant="ghost" size="sm" class="w-full justify-start text-muted-foreground">
            {#snippet leadingIcon()}<PlusIcon />{/snippet}
            Add question
          </Button>
        </div>
      </ScrollArea>
    </aside>

    <main class="flex min-w-0 flex-1 flex-col overflow-hidden">
      {#key activeId}
        <div class="flex min-h-0 flex-1 flex-col">
          <div class="shrink-0 px-5 pb-3 pt-4">
            <p class="text-sm leading-relaxed">{activeQuestion.text}</p>
            <div class="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {#if activeQuestion.wordLimit}<span>Limit: {activeQuestion.wordLimit} words</span>{/if}
              <span class={isOverLimit ? 'font-medium text-destructive' : ''}>
                {wordCount} words{isOverLimit && activeQuestion.wordLimit
                  ? ` (over by ${wordCount - activeQuestion.wordLimit})`
                  : ''}
              </span>
              {#if activeState.dirty}
                <Badge variant="dot" color="amber" size="compact">Unsaved</Badge>
              {/if}
            </div>
          </div>
          <Separator />
          <div class="flex shrink-0 items-center gap-2 px-5 py-2">
            <span class="shrink-0 text-xs text-muted-foreground">Tone:</span>
            <ToggleGroup.Root bind:value={qs[activeId].tone} type="single" variant="flat" size="sm">
              {#each TONE_OPTIONS as t (t.value)}
                <ToggleGroup.Item value={t.value}>{t.label}</ToggleGroup.Item>
              {/each}
            </ToggleGroup.Root>
          </div>
          <div class="flex shrink-0 items-center gap-2 px-5 pb-2">
            <span class="shrink-0 text-xs text-muted-foreground">Instruction:</span>
            <Input
              bind:value={qs[activeId].instruction}
              placeholder="e.g. shorter, lead with MIT, avoid jargon…"
              class="flex-1"
            />
          </div>
          <div class="min-h-0 flex-1 overflow-y-auto px-5 pb-3 pt-1">
            <Textarea
              autoResize
              minHeight={200}
              maxHeight={99999}
              bind:value={qs[activeId].content}
              placeholder="Click 'Draft' to generate an answer grounded in your profile…"
              aria-label="Answer editor"
            />
          </div>
          <Separator />
          <div class="flex shrink-0 items-center gap-2 px-5 py-2.5">
            {#if activeState.content.trim() === ''}
              <Button variant="primary" onclick={fakeRegenerate} loading={activeState.busy}>
                {#snippet leadingIcon()}<SparkleIcon />{/snippet}
                Draft with AI
              </Button>
            {:else}
              <Button variant="primary" onclick={fakeRegenerate} loading={activeState.busy}>
                {#snippet leadingIcon()}<ArrowClockwiseIcon />{/snippet}
                Regenerate
              </Button>
              <Button variant="secondary" disabled={!canSave}>
                {#snippet leadingIcon()}<FloppyDiskIcon />{/snippet}
                Save
              </Button>
              <Tooltip content="Copy answer to clipboard">
                <Button variant="ghost" onclick={copyAnswer}>
                  {#snippet leadingIcon()}<CopyIcon />{/snippet}
                  Copy
                </Button>
              </Tooltip>
            {/if}
            <div class="flex-1"></div>
            {#if isOverLimit && activeQuestion.wordLimit}
              <span class="text-xs text-destructive">
                {wordCount - activeQuestion.wordLimit} words over
              </span>
            {/if}
          </div>
        </div>
      {/key}
    </main>

    <aside class="flex w-80 shrink-0 flex-col border-l border-border">
      <ScrollArea class="h-full">
        <div class="flex flex-col">
          <div class="px-4 pb-3 pt-4">
            <p class="mb-2 text-xs font-medium text-muted-foreground">Opportunity</p>
            <Card.Root border="outlined">
              <Card.Content class="flex flex-col gap-1.5 py-3!">
                <p class="text-sm font-medium leading-tight">{MOCK_OPP.title}</p>
                <div class="flex flex-col gap-1 text-xs text-muted-foreground">
                  <span class="flex items-center gap-1.5">
                    <BuildingsIcon class="size-3 shrink-0" />{MOCK_OPP.organization}
                  </span>
                  <span class="flex items-center gap-1.5">
                    <CalendarIcon class="size-3 shrink-0" />Due {formatDeadline(MOCK_OPP.deadline)} · {daysUntil(MOCK_OPP.deadline)} days
                  </span>
                </div>
              </Card.Content>
            </Card.Root>
          </div>
          <Separator />
          <div class="px-4 py-3">
            <p class="mb-2 text-xs font-medium text-muted-foreground">Profile emphasis</p>
            <div class="flex flex-wrap gap-1.5">
              {#each MOCK_PROFILE_FOCUS_OPTIONS as opt (opt.id)}
                <button
                  onclick={() => (profileFocus = opt.id)}
                  class="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors {profileFocus === opt.id
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border text-muted-foreground hover:border-input hover:text-foreground'}"
                >
                  {#if profileFocus === opt.id}<CheckIcon class="size-3" />{/if}
                  {opt.label}
                </button>
              {/each}
            </div>
            <p class="mt-1.5 text-xs text-muted-foreground">
              {MOCK_PROFILE_FOCUS_OPTIONS.find((o) => o.id === profileFocus)?.description ?? ''}
            </p>
          </div>
          <Separator />
          <div class="px-4 py-3">
            <div class="mb-2 flex items-center gap-2">
              <p class="flex-1 text-xs font-medium text-muted-foreground">Version history</p>
              <ClockCounterClockwiseIcon class="size-3.5 text-muted-foreground" />
            </div>
            {#if activeState.versions.length === 0}
              <p class="text-xs text-muted-foreground">
                No drafts yet — click Draft to generate the first version.
              </p>
            {:else}
              <div class="flex flex-col gap-1">
                {#each activeState.versions as v (v.version)}
                  <div class="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-hover">
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-1.5 text-xs">
                        <span class="font-medium">v{v.version}</span>
                        <span class="text-muted-foreground">{v.wordCount} words</span>
                      </div>
                      <p class="line-clamp-1 text-xs text-muted-foreground">{v.content.substring(0, 60)}…</p>
                    </div>
                    <Tooltip content="Restore this version">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label="Restore version {v.version}"
                        onclick={() => restoreVersion(v)}
                      >
                        <ArrowClockwiseIcon />
                      </Button>
                    </Tooltip>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
          <Separator />
          <div class="px-4 py-3">
            <p class="mb-2 text-xs font-medium text-muted-foreground">Strategic notes</p>
            <Textarea
              placeholder="e.g. highlight Silk Road connection, avoid repeating thesis topic…"
              minHeight={72}
              maxHeight={200}
            />
          </div>
        </div>
      </ScrollArea>
    </aside>

  </div>
</div>
