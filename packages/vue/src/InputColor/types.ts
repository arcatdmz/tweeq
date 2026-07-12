import {
	type ColorPickerComponent,
	DEFAULT_COLOR_PICKERS,
} from '@tweeq/core'

import type {InputBoxProps} from '../types'

// Stage V2: the shared color types live in @tweeq/core.
export type {
	ColorChannel,
	ColorPicker,
	ColorPickerComponent,
	ColorSpace,
	HSV,
	HSVA,
	RGB,
	RGBA,
} from '@tweeq/core'
export {colorChannelToIndex} from '@tweeq/core'

export type Channels = {
	r: number
	g: number
	b: number
	a: number
	h: number
	s: number
	v: number
}

// Mutable copy: the legacy public type used mutable tuples/arrays.
export const DefaultColorPickers: ColorPickerComponent[] = [
	...DEFAULT_COLOR_PICKERS,
]

export interface InputColorProps extends InputBoxProps {
	alpha?: boolean
	pickers?: ColorPickerComponent[]
	presets?: string[]
}
