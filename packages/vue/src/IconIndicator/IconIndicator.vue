<script lang="ts" setup>
import {Icon} from '../Icon'
import {IconIndicatorProps} from './types'

const props = defineProps<IconIndicatorProps>()

const emit = defineEmits<{
	'update:active': [boolean]
}>()

function toggle() {
	emit('update:active', !props.active)
}
</script>

<template>
	<div
		class="IconIndicator"
		:class="{active: active, inactive: active === false, inline}"
		role="button"
		tabindex="0"
		:aria-pressed="active"
		data-tq-component="icon-indicator"
		:data-inline="inline || undefined"
		data-tq-part="root"
		@click="toggle"
		@keydown.enter.prevent="toggle"
		@keydown.space.prevent="toggle"
	>
		<Icon v-if="icon" class="icon" :icon="icon" data-tq-part="icon" />
	</div>
</template>
