<script setup lang="ts">
import {resizeSplitPane} from '@tweeq/core'
import {computed, useTemplateRef} from 'vue'

import {useAppConfigStore} from '../stores/appConfig'
import {useDrag} from '../use/useDrag'
import {PaneSplitProps} from './types'

const props = withDefaults(defineProps<PaneSplitProps>(), {
	size: 50,
	scroll: () => [true, true],
	min: 40,
})

const appConfig = useAppConfigStore()

const $root = useTemplateRef('$root')
const $divider = useTemplateRef('$divider')

const viewportSize = computed(() => {
	const bounds = $root.value?.getBoundingClientRect()
	return props.direction === 'horizontal'
		? bounds?.width ?? 0
		: bounds?.height ?? 0
})

// Which pane carries the stored size. In proportional mode it's always `first`
// (a percentage); in fixed mode it's whichever pane `fixed` names (in pixels).
const sizedPane = computed(() => props.fixed ?? 'first')

// Keep px and % under different keys so toggling the mode never reads one as the
// other (a stored 50% becoming 50px, say).
const size = appConfig.ref(
	props.fixed ? `${props.name}.px` : `${props.name}.width`,
	props.size
)

const sizeStyle = computed(() => {
	const cssProp = props.direction === 'horizontal' ? 'width' : 'height'
	const unit = props.fixed ? 'px' : '%'
	return {[cssProp]: `${size.value}${unit}`}
})

const firstStyle = computed(() =>
	sizedPane.value === 'first' ? sizeStyle.value : null
)
const secondStyle = computed(() =>
	sizedPane.value === 'second' ? sizeStyle.value : null
)

let sizeAtDragStart = size.value
useDrag($divider, {
	dragDelaySeconds: 0,
	onDragStart() {
		sizeAtDragStart = size.value
	},
	onDrag({xy, initial}) {
		const movement =
			props.direction === 'horizontal'
				? xy[0] - initial[0]
				: xy[1] - initial[1]
		size.value = resizeSplitPane({
			start: sizeAtDragStart,
			movement,
			fixed: props.fixed,
			viewportSize: viewportSize.value,
			minPixelSize: props.min,
		})
	},
})
</script>

<template>
	<div
		ref="$root"
		class="TqPaneSplit"
		:class="[direction, {fixed: !!fixed}]"
		:style="{'--pane-min': min + 'px'}"
		data-tq-component="pane-split"
		:data-tq-direction="direction"
		:data-tq-fixed="fixed ? '' : undefined"
		data-tq-part="root"
	>
		<div
			class="pane"
			:class="{grow: sizedPane !== 'first'}"
			:style="firstStyle"
			data-tq-part="first"
			:data-tq-grow="sizedPane !== 'first' ? '' : undefined"
		>
			<div
				class="wrapper"
				:class="{scroll: scroll[0]}"
				data-tq-part="wrapper"
				:data-tq-scroll="scroll[0] ? '' : undefined"
			>
				<slot name="first" />
			</div>
		</div>
		<div ref="$divider" class="divider" data-tq-part="divider" />
		<div
			class="pane"
			:class="{grow: sizedPane !== 'second'}"
			:style="secondStyle"
			data-tq-part="second"
			:data-tq-grow="sizedPane !== 'second' ? '' : undefined"
		>
			<div
				class="wrapper"
				:class="{scroll: scroll[1]}"
				data-tq-part="wrapper"
				:data-tq-scroll="scroll[1] ? '' : undefined"
			>
				<slot name="second" />
			</div>
		</div>
	</div>
</template>
