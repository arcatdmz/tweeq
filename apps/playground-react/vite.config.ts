import path from 'node:path'

import react from '@vitejs/plugin-react'
import {defineConfig} from 'vite'
import glsl from 'vite-plugin-glsl'

const here = new URL('.', import.meta.url).pathname

// Exhaustive React behavior playground. Workspace source aliases provide HMR;
// clean packed-package coverage remains owned by examples/react-vite.
export default defineConfig({
	plugins: [glsl(), react()],
	resolve: {
		alias: [
			{
				find: '@tweeq/react/style.css',
				replacement: path.resolve(here, '../../packages/styles/src/style.styl'),
			},
			{
				find: '@tweeq/react',
				replacement: path.resolve(here, '../../packages/react/src'),
			},
			{
				find: '@tweeq/core',
				replacement: path.resolve(here, '../../packages/core/src'),
			},
			{
				find: '@tweeq/dom',
				replacement: path.resolve(here, '../../packages/dom/src'),
			},
		],
	},
})
