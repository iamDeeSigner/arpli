<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MotionDemo from './MotionDemo.svelte';

  const { Story } = defineMeta({
    title: 'Foundations/Motion',
    component: MotionDemo,
    parameters: { layout: 'padded' },
  });
</script>

<Story name="Tiers" />
