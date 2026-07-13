<script setup lang="ts">
import {
	InputCheckbox,
	InputColor,
	InputNumber,
	InputString,
	InputSwitch,
	InputTime,
	ParameterGrid,
	TweeqProvider,
	Viewport,
} from '@tweeq/vue'
import {ref} from 'vue'

import ResearchApp from './ResearchApp.vue'

const size = ref(1)
const name = ref('tweeq')
const color = ref('#ff6633')
const enabled = ref(true)
const flag = ref(false)
const time = ref(0)
const research = window.location.hash === '#/research'
</script>

<template>
	<TweeqProvider app-id="com.tweeq.playground-vue">
		<Viewport>
			<ResearchApp v-if="research" />
			<main v-else style="max-width: 24rem; padding: 2rem">
				<h1>Tweeq Vue playground</h1>
				<ParameterGrid>
					<InputNumber v-model="size" :min="0" :max="10" />
					<InputString v-model="name" />
					<InputColor v-model="color" />
					<InputSwitch v-model="enabled" />
					<InputCheckbox v-model="flag" />
					<InputTime v-model="time" />
				</ParameterGrid>
			</main>
		</Viewport>
	</TweeqProvider>
</template>
