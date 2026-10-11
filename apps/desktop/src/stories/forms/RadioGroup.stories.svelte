<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';

  const { Story } = defineMeta({
    title: 'Forms/RadioGroup',
    component: RadioGroup,
    tags: ['autodocs'],
    args: { value: 'undergrad', layout: 'stacked', disabled: false, onValueChange: fn() },
    argTypes: {
      layout: { control: 'inline-radio', options: ['stacked', 'inline'] },
      disabled: { control: 'boolean' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-80">
      <RadioGroup {...args} aria-label="Education level">
        <RadioGroupItem value="highschool" title="High school senior" />
        <RadioGroupItem value="undergrad" title="Undergraduate" />
        <RadioGroupItem value="graduate" title="Graduate student" />
        <RadioGroupItem value="postdoc" title="Postdoctoral" disabled />
      </RadioGroup>
    </div>
  {/snippet}
</Story>

<Story name="With descriptions">
  <div class="w-96">
    <RadioGroup value="need" aria-label="Award basis">
      <RadioGroupItem value="merit" title="Merit-based" description="Awarded on academic or extracurricular achievement." />
      <RadioGroupItem value="need" title="Need-based" description="Awarded on demonstrated financial need." />
      <RadioGroupItem value="both" title="Both" description="Considers merit and financial need together." />
    </RadioGroup>
  </div>
</Story>

<Story name="Inline">
  <RadioGroup layout="inline" value="fall" aria-label="Start term">
    <RadioGroupItem value="fall" title="Fall 2027" />
    <RadioGroupItem value="spring" title="Spring 2028" />
    <RadioGroupItem value="summer" title="Summer 2028" />
  </RadioGroup>
</Story>
