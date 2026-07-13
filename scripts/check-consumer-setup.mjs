#!/usr/bin/env node
import {readFileSync, readdirSync} from 'node:fs'
import {extname, join, resolve} from 'node:path'

const root = resolve(new URL('..', import.meta.url).pathname)
const consumers = [
	['apps/docs', 'apps/docs', 'react'],
	['apps/playground-react', 'apps/playground-react/src', 'react'],
	['apps/playground-vue', 'apps/playground-vue/src', 'vue'],
	['examples/react-vite', 'examples/react-vite/src', 'react'],
	['examples/vue-vite', 'examples/vue-vite/src', 'vue'],
]
const failures = []

for (const [directory, sourcePath, renderer] of consumers) {
	const sourceDirectory = join(root, sourcePath)
	const source = sourceFiles(sourceDirectory)
		.map(file => readFileSync(file, 'utf8'))
		.join('\n')
	if (!source.includes(`@tweeq/${renderer}/style.css`)) {
		failures.push(`${directory} does not import @tweeq/${renderer}/style.css`)
	}
	if (!/<(?:App|Viewport)(?:\s|>)/.test(source)) {
		failures.push(`${directory} does not render an App or Viewport style root`)
	}
}

if (failures.length > 0) {
	throw new Error(`Invalid renderer consumer setup:\n${failures.join('\n')}`)
}

console.log(`✓ ${consumers.length} renderer consumers import CSS and render a viewport root`)

function sourceFiles(directory) {
	return readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
		const path = join(directory, entry.name)
		if (entry.isDirectory()) {
			return ['dist', 'node_modules'].includes(entry.name)
				? []
				: sourceFiles(path)
		}
		return ['.ts', '.tsx', '.vue'].includes(extname(path)) ? [path] : []
	})
}
