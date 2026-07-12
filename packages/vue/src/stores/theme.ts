import {type ColorMode, computeTheme, type Theme} from '@tweeq/core'
import {applyThemeToDOM} from '@tweeq/dom'
import {toReactive} from '@vueuse/core'
import {defineStore} from 'pinia'
import {computed, toRefs, watch} from 'vue'

import {useAppConfigStore} from './appConfig'

export const useThemeStore = defineStore('theme', () => {
	const config = useAppConfigStore().group('theme')

	const accentColor = config.ref('accentColor', '#0000ff')
	const colorMode = config.ref<ColorMode>('colorMode', 'light')
	const grayColor = config.ref('grayColor', '#8B8D98')
	const backgroundColor = config.ref(
		'backgroundColor',
		colorMode.value === 'light' ? '#ffffff' : '#111111'
	)

	// Snap the background to the appearance's default when the user toggles
	// light/dark, but leave it untouched afterwards (and on load) so a custom
	// background sticks. No `immediate`: we must not clobber a saved background
	// when the store first restores it.
	watch(colorMode, mode => {
		backgroundColor.value = mode === 'light' ? '#ffffff' : '#111111'
	})

	function setDefault(options: {
		colorMode?: ColorMode
		accentColor?: string
		backgroundColor?: string
		grayColor?: string
	}) {
		if (options.colorMode) {
			colorMode.default = options.colorMode
		}
		if (options.accentColor) {
			accentColor.default = options.accentColor
		}
		if (options.backgroundColor) {
			backgroundColor.default = options.backgroundColor
		}
		if (options.grayColor) {
			grayColor.default = options.grayColor
		}
	}

	// Stage V2: the palette/token computation lives in @tweeq/core.
	const computed_ = computed(() =>
		computeTheme({
			colorMode: colorMode.value,
			accentColor: accentColor.value,
			grayColor: grayColor.value,
			backgroundColor: backgroundColor.value,
		})
	)

	const theme = computed<Theme>(() => computed_.value.theme)
	const monacoTheme = computed(() => computed_.value.monacoTheme)

	// Promote all tokens as CSS variables (shared with the React renderer).
	watch(
		theme,
		() => applyThemeToDOM(theme.value, colorMode.value),
		{immediate: true}
	)

	return {
		accentColor,
		colorMode,
		backgroundColor,
		grayColor,
		setDefault,
		monacoTheme,
		...toRefs(toReactive(theme)),
	}
})
