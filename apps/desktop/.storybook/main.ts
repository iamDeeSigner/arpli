import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import type { StorybookConfig } from '@storybook/sveltekit';

const require = createRequire(import.meta.url);

// npm workspaces hoist `storybook` to the repo root while the Vite-dependent packages
// stay in apps/desktop/node_modules next to Vite, so resolve each one from here.
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|svelte)'],
  addons: [
    getAbsolutePath('@storybook/addon-svelte-csf'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-themes'),
    getAbsolutePath('@storybook/addon-a11y'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/sveltekit') as '@storybook/sveltekit',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;
