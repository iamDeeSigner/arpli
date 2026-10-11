<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import { CheckboxGroup, CheckboxGroupItem } from '$lib/components/ui/checkbox-group';

  const { Story } = defineMeta({
    title: 'Forms/CheckboxGroup',
    component: CheckboxGroup,
    tags: ['autodocs'],
    args: {
      value: ['scholarship', 'grant'],
      layout: 'stacked',
      disabled: false,
      onValueChange: fn(),
    },
    argTypes: {
      layout: { control: 'inline-radio', options: ['stacked', 'inline'] },
      disabled: { control: 'boolean' },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="w-80">
      <CheckboxGroup {...args} aria-label="Opportunity types">
        <CheckboxGroupItem value="scholarship" title="Scholarships" />
        <CheckboxGroupItem value="grant" title="Grants" />
        <CheckboxGroupItem value="fellowship" title="Fellowships" />
        <CheckboxGroupItem value="internship" title="Paid internships" disabled />
      </CheckboxGroup>
    </div>
  {/snippet}
</Story>

<Story name="With descriptions">
  <div class="w-96">
    <CheckboxGroup value={['email']} aria-label="Deadline reminders">
      <CheckboxGroupItem value="email" title="Email" description="A digest 7 days and 1 day before each deadline." />
      <CheckboxGroupItem value="desktop" title="Desktop notifications" description="A banner on the morning a deadline is due." />
      <CheckboxGroupItem value="calendar" title="Calendar export" description="Add deadlines to your calendar feed." />
    </CheckboxGroup>
  </div>
</Story>

<Story name="Inline">
  <CheckboxGroup layout="inline" value={['stem']} aria-label="Fields of study">
    <CheckboxGroupItem value="stem" title="STEM" />
    <CheckboxGroupItem value="arts" title="Arts" />
    <CheckboxGroupItem value="humanities" title="Humanities" />
    <CheckboxGroupItem value="business" title="Business" />
  </CheckboxGroup>
</Story>
