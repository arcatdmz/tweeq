<script setup lang="ts">
import {updateSizeWithRatio} from '@tweeq/core'
import {vec2} from 'linearly'
import {ref} from 'vue'

import {Icon} from '../Icon'
import {InputVec} from '../InputVec'
import {InputEmits, InputProps} from '../types'

const model = defineModel<vec2>({required: true})

const props = defineProps<InputProps>()
const emit = defineEmits<InputEmits>()

const keepRatio = ref(true)

let valueOnEdit = model.value

function onUpdate(value: vec2) {
	const result = updateSizeWithRatio({
		previous: model.value,
		next: value,
		valueOnEdit,
		keepRatio: keepRatio.value,
	})
	keepRatio.value = result.keepRatio
	model.value = result.value
}

function recordValueOnEdit() {
	valueOnEdit = model.value
	emit('focus')
}
</script>

<template>
	<div class="TqInputSize">
		<InputVec
			:modelValue="model"
			:icon="['mdi:arrow-left-right', 'mdi:arrow-up-down']"
			:disabled="props.disabled"
			:invalid="props.invalid"
			@update:modelValue="onUpdate"
			@focus="recordValueOnEdit"
			@confirm="emit('confirm')"
			@blur="emit('blur')"
		/>
		<button
			class="chain"
			:class="{active: keepRatio}"
			type="button"
			:disabled="props.disabled"
			:aria-pressed="keepRatio"
			@click="keepRatio = !keepRatio"
		>
			<Icon
				class="chainIcon"
				:icon="keepRatio ? 'radix-icons:link-1' : 'radix-icons:link-none-1'"
			/>
		</button>
	</div>
</template>

<style lang="stylus" scoped>

.TqInputSize
	position relative

.chain
	position absolute
	top 0
	left 50%
	transform translateX(-50%)
	width var(--tq-input-height)
	height var(--tq-input-height)
	color var(--tq-color-text-subtle)
	z-index 1
	padding 0
	border 0
	background transparent
	box-sizing border-box

	&:disabled
		pointer-events none
		color var(--tq-color-text-mute)

	&:hover
		color 'color-mix(in srgb, var(--tq-color-text-mute), transparent 50%)' % ''

	&.active
		color var(--tq-color-accent)

		&:hover
			color var(--tq-color-accent-hover)

.chainIcon
	width 100%
	height 100%
	transform scale(.8)

:deep(.TqInputNumber:not(:first-child))
	.icon.left
		left calc(var(--tq-input-height) * .3)
</style>
