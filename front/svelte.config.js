import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "@sveltejs/adapter-node";
import path from "path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			// this will match a file
			$node_modules: path.resolve("./node_modules"),
			$src: path.resolve("./src"),
			$lib: path.resolve("./src/lib"),
			$components: path.resolve("./src/lib/components"),
			
		},
	},

  preprocess: [vitePreprocess({})],
};

export default config;
