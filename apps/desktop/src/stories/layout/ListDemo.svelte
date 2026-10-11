<!-- Story helper: a List with selection and a collapsible section driven by local state. -->
<script lang="ts">
  import { ListContainer, ListItem, ListSection, ListEmpty } from '$lib/components/ui/list';
  import { Button } from '$lib/components/ui/button';
  import GraduationCapIcon from 'phosphor-svelte/lib/GraduationCapIcon';
  import TrophyIcon from 'phosphor-svelte/lib/TrophyIcon';
  import PlusIcon from 'phosphor-svelte/lib/PlusIcon';

  let { size = 'md', variant = 'default' }: { size?: 'sm' | 'md'; variant?: 'default' | 'ghost' | 'subtle' } =
    $props();

  const scholarships = [
    { id: 'rhodes', title: 'Rhodes Scholarship', subtitle: 'Due Oct 1', badge: 2 },
    { id: 'marshall', title: 'Marshall Scholarship', subtitle: 'Due Oct 28' },
    { id: 'gates', title: 'Gates Cambridge', subtitle: 'Due Dec 3' },
  ];
  const fellowships = [
    { id: 'kh', title: 'Knight-Hennessy Scholars', subtitle: 'Due Oct 9' },
    { id: 'schwarzman', title: 'Schwarzman Scholars', subtitle: 'Due Sep 20', badge: 'New' },
  ];

  let activeId = $state('rhodes');
  let fellowshipsCollapsed = $state(false);
</script>

<div class="w-72">
  <ListSection title="Scholarships">
    {#snippet actions()}
      <Button variant="ghost" size="icon-xs" iconOnly aria-label="Add scholarship">
        <PlusIcon aria-hidden="true" />
      </Button>
    {/snippet}
    <ListContainer interactive>
      {#each scholarships as item (item.id)}
        <ListItem
          {size}
          {variant}
          title={item.title}
          subtitle={item.subtitle}
          badge={item.badge}
          iconComponent={GraduationCapIcon}
          active={activeId === item.id}
          onclick={() => (activeId = item.id)}
        />
      {/each}
    </ListContainer>
  </ListSection>
  <ListSection
    title="Fellowships"
    collapsible
    collapsed={fellowshipsCollapsed}
    onToggleCollapse={() => (fellowshipsCollapsed = !fellowshipsCollapsed)}
  >
    <ListContainer interactive>
      {#each fellowships as item (item.id)}
        <ListItem
          {size}
          {variant}
          title={item.title}
          subtitle={item.subtitle}
          badge={item.badge}
          badgeVariant="info"
          iconComponent={TrophyIcon}
          active={activeId === item.id}
          onclick={() => (activeId = item.id)}
        />
      {/each}
    </ListContainer>
  </ListSection>
  <ListSection title="Grants">
    <ListEmpty message="No grants saved yet." />
  </ListSection>
</div>
