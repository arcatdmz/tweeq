import {type ComponentType, type ReactNode, useEffect, useState} from 'react'

import {ColorsPage} from './pages/ColorsPage'
import {ExamplesPage} from './pages/ExamplesPage'
import {FeaturesPage} from './pages/FeaturesPage'
import {IntroPage} from './pages/IntroPage'

/**
 * Demo playground for the React port.
 *
 * Batch agents add sections WITHOUT editing this file: drop
 * `demo/sections/<Name>Section.tsx` exporting a default React component
 * (wrap it in <section data-testid="<Name>"> yourself). Files are
 * auto-discovered via import.meta.glob and rendered in filename order,
 * so Playwright tests in e2e/ can target them right away.
 */
const sectionModules = import.meta.glob<{default: ComponentType}>(
	'./sections/*Section.tsx',
	{eager: true}
)

const sections: [name: string, Component: ComponentType][] = Object.entries(
	sectionModules
)
	.sort(([a], [b]) => a.localeCompare(b))
	.map(([path, mod]) => [
		path.replace('./sections/', '').replace('Section.tsx', ''),
		mod.default,
	])

type Page = 'colors' | 'components' | 'examples' | 'features' | 'intro'

function pageFromHash(): Page {
	const page = window.location.hash.replace(/^#\/?/, '')
	return ['colors', 'examples', 'features', 'intro'].includes(page)
		? (page as Page)
		: 'components'
}

function ComponentsPage() {
	return (
		<article className="docs-page" data-testid="components-page">
			<h1>Components</h1>
			<p>Interactive gallery of every component in the React port.</p>
			{sections.length === 0 && (
				<p data-testid="placeholder">
					No components ported yet — sections appear here per batch.
				</p>
			)}
			{sections.map(([name, Section]) => (
				<Section key={name} />
			))}
		</article>
	)
}

export function DemoApp(): ReactNode {
	const [page, setPage] = useState<Page>(pageFromHash)
	useEffect(() => {
		const updatePage = () => setPage(pageFromHash())
		window.addEventListener('hashchange', updatePage)
		return () => window.removeEventListener('hashchange', updatePage)
	}, [])

	return (
		<>
			<header className="demo-header">
				<h1 className="demo-brand"><a href="#/components">Tweeq React Demo</a></h1>
				<nav aria-label="Documentation pages">
					{(['components', 'examples', 'colors', 'features', 'intro'] as const).map(name => (
						<a aria-current={page === name ? 'page' : undefined} href={`#/${name}`} key={name}>{name[0].toUpperCase() + name.slice(1)}</a>
					))}
				</nav>
			</header>
			<main>
				{page === 'components' && <ComponentsPage />}
				{page === 'examples' && <ExamplesPage />}
				{page === 'colors' && <ColorsPage />}
				{page === 'features' && <FeaturesPage />}
				{page === 'intro' && <IntroPage />}
		</main>
		</>
	)
}
