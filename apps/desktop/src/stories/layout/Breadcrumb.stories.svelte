<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Root as BreadcrumbRoot } from '$lib/components/ui/breadcrumb';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';

  const { Story } = defineMeta({
    title: 'Layout/Breadcrumb',
    component: BreadcrumbRoot,
    tags: ['autodocs'],
  });
</script>

<Story name="Default">
  {#snippet template()}
    <Breadcrumb.Root>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#applications">Applications</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#rhodes">Rhodes Scholarship</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Page>Personal statement</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  {/snippet}
</Story>

<Story name="Collapsed">
  {#snippet template()}
    <Breadcrumb.Root>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#opportunities">Opportunities</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Ellipsis />
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#fellowships">Fellowships</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Page>Knight-Hennessy Scholars</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  {/snippet}
</Story>

<Story name="Custom separator">
  {#snippet template()}
    <Breadcrumb.Root>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#profile">Profile</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator>/</Breadcrumb.Separator>
        <Breadcrumb.Item>
          <Breadcrumb.Page>Education</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  {/snippet}
</Story>
