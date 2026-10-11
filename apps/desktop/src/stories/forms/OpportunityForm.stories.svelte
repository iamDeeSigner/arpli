<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import OpportunityFormExample from './OpportunityFormExample.svelte';

  const { Story } = defineMeta({
    title: 'Forms/Opportunity form',
    component: OpportunityFormExample,
    parameters: { layout: 'padded' },
  });
</script>

<Story name="Opportunity form" />
