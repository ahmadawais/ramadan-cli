import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/cli.ts', 'src/index.ts'],
	format: ['esm'],
	dts: true,
	clean: true,
	shims: true,
	banner: {
		js: '#!/usr/bin/env node',
	},
});
