// Dynamic [id] routes cannot be prerendered — SvelteKit can't crawl them to
// discover IDs. Override the layout-level `prerender = true` for this route.
export const prerender = false;
