import type { Preview } from '@storybook/sveltekit';
import { withThemeByClassName } from '@storybook/addon-themes';
import StoryFrame from './StoryFrame.svelte';
import '../src/app.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: { expanded: true, sort: 'requiredFirst' },
    backgrounds: { disable: true },
    a11y: { test: 'todo' },
    options: {
      storySort: {
        order: ['Introduction', 'Foundations', 'Primitives', 'Forms', 'Overlays', 'Layout', 'Patterns', 'Arpli'],
      },
    },
  },
  decorators: [
    // Theme toggle in the toolbar flips the same `.light` / `.dark` root class the app uses.
    withThemeByClassName({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
      parentSelector: 'html',
    }),
    // Same providers as the app root (tooltips + toast host).
    () => ({ Component: StoryFrame }),
  ],
};

export default preview;
