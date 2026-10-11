<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import { AskUserQuestions, type AskUserQuestion } from '$lib/components/ui/ask-user-questions';

  const onboarding: AskUserQuestion[] = [
    {
      id: 'level',
      header: 'Study level',
      title: 'What level of study are you funding?',
      description: 'Arpli uses this to filter scholarships and fellowships.',
      options: [
        { id: 'undergraduate', title: 'Undergraduate', description: 'Bachelor’s degree or equivalent' },
        { id: 'masters', title: 'Master’s', description: 'Taught or research master’s' },
        { id: 'phd', title: 'PhD', description: 'Doctoral research' },
      ],
    },
    {
      id: 'types',
      header: 'Funding',
      title: 'Which kinds of funding should we look for?',
      multiSelect: true,
      options: [
        { id: 'scholarships', title: 'Scholarships' },
        { id: 'grants', title: 'Research grants' },
        { id: 'fellowships', title: 'Fellowships' },
        { id: 'travel', title: 'Travel and conference awards' },
      ],
      allowOther: true,
      otherPlaceholder: 'Something else…',
    },
    {
      id: 'field',
      header: 'Field',
      title: 'What’s your field of study?',
      freeText: true,
      freeTextPlaceholder: 'e.g. Environmental engineering',
      skippable: true,
    },
  ];

  const { Story } = defineMeta({
    title: 'Patterns/AskUserQuestions',
    component: AskUserQuestions,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: {
      questions: onboarding,
      showCounter: true,
      centered: false,
      disabled: false,
      size: 'default',
      onComplete: fn(),
      onAnswersChange: fn(),
    },
    argTypes: {
      questions: { control: 'object' },
      showCounter: { control: 'boolean' },
      centered: { control: 'boolean' },
      disabled: { control: 'boolean' },
      size: { control: 'inline-radio', options: ['compact', 'default'] },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-[560px]"><AskUserQuestions {...args} /></div>
  {/snippet}
</Story>

<Story name="Single question, centered">
  {#snippet template()}
    <div class="w-[560px]">
      <AskUserQuestions centered questions={[onboarding[0]]} onComplete={() => {}} />
    </div>
  {/snippet}
</Story>

<Story name="Multi-select with other">
  {#snippet template()}
    <div class="w-[560px]">
      <AskUserQuestions questions={[onboarding[1]]} onComplete={() => {}} />
    </div>
  {/snippet}
</Story>
