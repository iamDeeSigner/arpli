<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SidebarFrame from './SidebarFrame.svelte';

  const pageAt = (path: string) => ({
    sveltekit_experimental: {
      state: { page: { url: new URL(`http://localhost${path}`) } },
    },
  });

  const { Story } = defineMeta({
    title: 'Arpli/Sidebar',
    component: SidebarFrame,
    parameters: { layout: 'fullscreen' },
  });
</script>

<Story name="Opportunities active" parameters={pageAt('/opportunities')} />

<Story name="Profile active" parameters={pageAt('/profile')} />

<Story name="Applications detail active" parameters={pageAt('/applications/gates-cambridge')} />

<Story name="Settings active" parameters={pageAt('/settings')} />
