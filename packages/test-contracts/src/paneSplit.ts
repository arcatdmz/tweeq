import {afterEach, describe, expect, it} from 'vitest'

import type {RendererHarness, RendererHarnessFactory} from './harness'

export interface PaneSplitContractProps {
	direction: 'horizontal' | 'vertical'
	size: number
	fixed?: 'first' | 'second'
	min?: number
}

export function runPaneSplitContract(
	createHarness: RendererHarnessFactory<PaneSplitContractProps>
) {
	describe('PaneSplit renderer contract', () => {
		let harness: RendererHarness<PaneSplitContractProps> | undefined

		afterEach(() => {
			harness?.unmount()
			harness = undefined
		})

		it('resizes proportional panes from pointer movement', async () => {
			harness = await createHarness('PaneSplit', {
				direction: 'horizontal',
				size: 50,
			})
			await harness.pointer({type: 'down', x: 250, y: 100}, 'divider')
			await harness.pointer({type: 'move', x: 350, y: 100}, 'divider')
			await harness.pointer({type: 'up', x: 350, y: 100}, 'divider')
			expect(harness.value()).toBe('70%')
		})

		it('honors min while resizing a fixed second pane', async () => {
			harness = await createHarness('PaneSplit', {
				direction: 'horizontal',
				size: 200,
				fixed: 'second',
				min: 80,
			})
			await harness.pointer({type: 'down', x: 250, y: 100}, 'divider')
			await harness.pointer({type: 'move', x: 430, y: 100}, 'divider')
			await harness.pointer({type: 'up', x: 430, y: 100}, 'divider')
			expect(harness.value()).toBe('80px')
		})
	})
}
