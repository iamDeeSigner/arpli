<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Root as AccordionRoot } from '$lib/components/ui/accordion';
  import * as Accordion from '$lib/components/ui/accordion';

  const faqs = [
    {
      value: 'eligibility',
      q: 'Who is eligible to apply?',
      a: 'Undergraduate seniors and recent graduates with U.S. citizenship.',
    },
    {
      value: 'references',
      q: 'How many letters of recommendation do I need?',
      a: 'Three letters, at least two from faculty who taught you in a classroom setting.',
    },
    {
      value: 'interview',
      q: 'Is there an interview?',
      a: 'Finalists are invited to a 30-minute virtual interview in late November.',
    },
  ];

  const { Story } = defineMeta({
    title: 'Layout/Accordion',
    component: AccordionRoot,
    tags: ['autodocs'],
    args: { type: 'single', disabled: false },
    argTypes: {
      type: { control: 'select', options: ['single', 'multiple'] },
      disabled: { control: 'boolean' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-[28rem]">
      <Accordion.Root {...args}>
        {#each faqs as faq (faq.value)}
          <Accordion.Item value={faq.value}>
            <Accordion.Header>
              <Accordion.Trigger>{faq.q}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <p class="type-body text-muted-foreground">{faq.a}</p>
            </Accordion.Content>
          </Accordion.Item>
        {/each}
      </Accordion.Root>
    </div>
  {/snippet}
</Story>

<Story name="Multiple open">
  {#snippet template()}
    <div class="w-[28rem]">
      <Accordion.Root type="multiple" value={['eligibility', 'interview']}>
        {#each faqs as faq (faq.value)}
          <Accordion.Item value={faq.value}>
            <Accordion.Header>
              <Accordion.Trigger>{faq.q}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <p class="type-body text-muted-foreground">{faq.a}</p>
            </Accordion.Content>
          </Accordion.Item>
        {/each}
      </Accordion.Root>
    </div>
  {/snippet}
</Story>

<Story name="Disabled item">
  {#snippet template()}
    <div class="w-[28rem]">
      <Accordion.Root type="single" value="eligibility">
        {#each faqs as faq, i (faq.value)}
          <Accordion.Item value={faq.value} disabled={i === 2}>
            <Accordion.Header>
              <Accordion.Trigger>{faq.q}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <p class="type-body text-muted-foreground">{faq.a}</p>
            </Accordion.Content>
          </Accordion.Item>
        {/each}
      </Accordion.Root>
    </div>
  {/snippet}
</Story>
