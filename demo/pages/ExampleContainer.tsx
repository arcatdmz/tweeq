import {type ReactNode, useState} from 'react'

import {InputButton, InputComplex, type Scheme} from '../../src/react'

export interface ExampleContainerProps<T extends Record<string, unknown>> {
	initialValue: T
	scheme: Scheme<T>
	children?: (value: T) => ReactNode
	testId?: string
}

/**
 * Mirrors the legacy docs' ExampleContainer + DemoContainer pair
 * (docs/.vuepress/ExampleContainer.vue, DemoContainer.vue): a narrow
 * (18rem) centered scheme-driven form with a subtle Full Screen toggle at
 * the top-right. The live value stays in the DOM for tests but is visually
 * hidden — the original page shows only the form.
 */
export function ExampleContainer<T extends Record<string, unknown>>({
	initialValue,
	scheme,
	children,
	testId,
}: ExampleContainerProps<T>) {
	const [value, setValue] = useState(initialValue)
	const [isFullscreen, setIsFullscreen] = useState(false)

	return (
		<div
			className={'example-demo' + (isFullscreen ? ' fullscreen' : '')}
			data-testid={testId}
		>
			<InputButton
				className="example-fullscreen-button"
				icon={isFullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'}
				label={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
				subtle
				onClick={() => setIsFullscreen(fullscreen => !fullscreen)}
			/>
			<div className="example-sandbox">
				<InputComplex value={value} scheme={scheme} onChange={setValue} />
				{children?.(value)}
			</div>
			<output
				className="sr-only"
				data-testid={testId ? `${testId}-value` : undefined}
			>
				{JSON.stringify(value)}
			</output>
		</div>
	)
}
