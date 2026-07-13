import {TweeqProvider, Viewport} from '@tweeq/react'
import {type ComponentType, type ReactNode} from 'react'

const sectionModules = import.meta.glob<{default: ComponentType}>(
	'./sections/*Section.tsx',
	{eager: true},
)

export const sections: [name: string, Component: ComponentType][] =
	Object.entries(sectionModules)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([path, mod]) => [
			path.replace('./sections/', '').replace('Section.tsx', ''),
			mod.default,
		])

function GalleryViewport(): ReactNode {
	return (
		<Viewport
			appId="react-playground"
			className="all-components"
			data-testid="react-component-gallery"
		>
			<section data-gallery-component="TweeqProvider">
				<h2>TweeqProvider</h2>
				<p>The standalone gallery's outer runtime owner.</p>
			</section>
			{sections.map(([name, Section]) => (
				<div key={name} data-gallery-component={name}>
					<Section />
				</div>
			))}
		</Viewport>
	)
}

export function ComponentGallery({withProvider = true}: {withProvider?: boolean}) {
	const gallery = <GalleryViewport />
	return withProvider ? (
		<TweeqProvider appId="react-playground">{gallery}</TweeqProvider>
	) : (
		gallery
	)
}
