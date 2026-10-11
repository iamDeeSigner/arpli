import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false,
      strict: true,
    }),
    files: {
      lib: 'src/lib',
      routes: 'src/routes',
    },
    alias: {
      // Shared modules used by the UI kit ported from Intent (cloudlands-fe).
      $shared: 'src/shared',
      // Intent's kit still imports Font Awesome identifiers; like upstream, they
      // resolve to Phosphor icons so there is one icon set.
      '@fortawesome/free-solid-svg-icons': 'src/lib/icons/phosphor-icons.ts',
      '@fortawesome/fontawesome-common-types': 'src/lib/icons/phosphor-icons.ts',
      'svelte-fa': 'src/lib/components/shared/icons/fa-proxy.ts',
    },
  },
};

export default config;
