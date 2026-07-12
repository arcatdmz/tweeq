// @vitest-environment jsdom

import {
	type PaneSplitContractProps,
	type PointerAction,
	type RendererHarness,
	runPaneSplitContract,
} from '@tweeq/test-contracts'
import {createApp, defineComponent, h, nextTick, reactive} from 'vue'

import {PaneSplit} from './PaneSplit'

let harnessId = 0
runPaneSplitContract(async (_component, initialProps) => {
	const container = document.createElement('div')
	document.body.append(container)
	const props = reactive({...initialProps})
	const name = `contract-split-${++harnessId}`
	const app = createApp(
		defineComponent(() => () =>
			h(
				PaneSplit,
				{...props, name},
				{first: () => 'First', second: () => 'Second'}
			)
		)
	)
	app.mount(container)
	await nextTick()

	const harness: RendererHarness<PaneSplitContractProps> = {
		async update(next) {
			Object.assign(props, next)
			await nextTick()
		},
		part: part => container.querySelector(`[data-tq-part="${part}"]`),
		async pointer(action: PointerAction, part = 'divider') {
			installGeometry(harness)
			harness.part(part)?.dispatchEvent(pointerEvent(action))
			await nextTick()
		},
		async key() {},
		async activate() {},
		value: () => {
			const pane = harness.part(props.fixed ?? 'first') as HTMLElement
			return props.direction === 'horizontal' ? pane.style.width : pane.style.height
		},
		events: () => [],
		unmount() {
			app.unmount()
			container.remove()
		},
	}
	return harness
})

function installGeometry(harness: RendererHarness) {
	for (const part of ['root', 'divider']) {
		const element = harness.part(part) as HTMLElement
		Object.assign(element, {
			getBoundingClientRect: () => ({
				left: part === 'divider' ? 250 : 0,
				top: 0,
				right: part === 'divider' ? 251 : 500,
				bottom: 200,
				width: part === 'divider' ? 1 : 500,
				height: 200,
			}),
			setPointerCapture: () => undefined,
			releasePointerCapture: () => undefined,
		})
	}
}

function pointerEvent(action: PointerAction) {
	const type =
		action.type === 'down'
			? 'pointerdown'
			: action.type === 'move'
				? 'pointermove'
				: 'pointerup'
	return Object.assign(new Event(type, {bubbles: true}), {
		button: 0,
		isPrimary: true,
		pointerType: 'mouse',
		pointerId: 1,
		clientX: action.x,
		clientY: action.y,
	})
}
