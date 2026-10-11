<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ButtonGroup } from '$lib/components/ui/button-group';
  import { Button } from '$lib/components/ui/button';
  import TextBIcon from 'phosphor-svelte/lib/TextBIcon';
  import TextItalicIcon from 'phosphor-svelte/lib/TextItalicIcon';
  import ListBulletsIcon from 'phosphor-svelte/lib/ListBulletsIcon';
  import LinkIcon from 'phosphor-svelte/lib/LinkIcon';

  const { Story } = defineMeta({
    title: 'Primitives/ButtonGroup',
    component: ButtonGroup,
    tags: ['autodocs'],
    args: { orientation: 'horizontal' },
    argTypes: {
      orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <ButtonGroup {...args}>
      <Button variant="ghost" size="sm" active>All</Button>
      <Button variant="ghost" size="sm">Scholarships</Button>
      <Button variant="ghost" size="sm">Grants</Button>
      <Button variant="ghost" size="sm">Fellowships</Button>
    </ButtonGroup>
  {/snippet}
</Story>

<Story name="Icon toolbar">
  <ButtonGroup aria-label="Essay formatting">
    <Button variant="ghost" size="icon-sm" aria-label="Bold"><TextBIcon /></Button>
    <Button variant="ghost" size="icon-sm" aria-label="Italic" active><TextItalicIcon /></Button>
    <Button variant="ghost" size="icon-sm" aria-label="Bulleted list"><ListBulletsIcon /></Button>
    <Button variant="ghost" size="icon-sm" aria-label="Insert link"><LinkIcon /></Button>
  </ButtonGroup>
</Story>

<Story name="Vertical">
  <ButtonGroup orientation="vertical" class="w-40">
    <Button variant="ghost" size="sm" active>Profile</Button>
    <Button variant="ghost" size="sm">Education</Button>
    <Button variant="ghost" size="sm">Activities</Button>
    <Button variant="ghost" size="sm">Essays</Button>
  </ButtonGroup>
</Story>
