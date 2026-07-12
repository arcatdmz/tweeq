import {type ReactNode, useState} from 'react'

import {InputComplex, ParameterGrid, type Scheme} from '../../src/react'

export interface ExampleContainerProps<T extends Record<string, unknown>> {
	initialValue: T
	scheme: Scheme<T>
	children?: (value: T) => ReactNode
	testId?: string
}

export function ExampleContainer<T extends Record<string, unknown>>({
	initialValue,
	scheme,
	children,
	testId,
}: ExampleContainerProps<T>) {
	const [value, setValue] = useState(initialValue)

	return (
		<div className="example-container" data-testid={testId}>
			<InputComplex value={value} scheme={scheme} onChange={setValue} />
			{children?.(value)}
			<ParameterGrid className="example-readout">
				<li>
					<strong>Live value</strong>
					<output data-testid={testId ? `${testId}-value` : undefined}>
						<pre>{JSON.stringify(value, null, 2)}</pre>
					</output>
				</li>
			</ParameterGrid>
		</div>
	)
}
