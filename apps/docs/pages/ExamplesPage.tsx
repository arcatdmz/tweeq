import {type Scheme} from '@tweeq/react'

import {Heading} from './docs'
import {ExampleContainer} from './ExampleContainer'

type Sliders = Record<'number1' | 'number2' | 'number3' | 'number4' | 'number5', number>
const sliderScheme: Scheme<Sliders> = Object.fromEntries(
	Array.from({length: 5}, (_, index) => [
		`number${index + 1}`,
		{type: 'number', min: 0, max: 100},
	])
) as Scheme<Sliders>

type Colors = Record<'color1' | 'color2' | 'color3' | 'color4' | 'color5', string>
const colorScheme: Scheme<Colors> = Object.fromEntries(
	Array.from({length: 5}, (_, index) => [
		`color${index + 1}`,
		{type: 'string', ui: 'color', icon: 'mdi-palette'},
	])
) as Scheme<Colors>

type Angles = {low: number; mid: number; high: number}
const angleScheme = {
	low: {type: 'number', ui: 'angle', min: -100, max: 100, icon: 'mdi-equalizer'},
	mid: {type: 'number', ui: 'angle', min: -100, max: 100, icon: 'mdi-equalizer'},
	high: {type: 'number', ui: 'angle', min: -100, max: 100, icon: 'mdi-equalizer'},
} as unknown as Scheme<Angles>

type Switches = Record<`switch_${number}`, boolean>
const switchScheme = Object.fromEntries(
	Array.from({length: 10}, (_, index) => [
		`switch_${index + 1}`,
		{type: 'boolean', ui: 'switch', icon: 'mdi-toggle-switch'},
	])
) as unknown as Scheme<Switches>

type Files = Record<`file_${number}`, string>
const fileScheme = Object.fromEntries(
	Array.from({length: 10}, (_, index) => [
		`file_${index + 1}`,
		{type: 'string', icon: 'mdi:file'},
	])
) as Scheme<Files>

export function ExamplesPage() {
	return (
		<div {...{'vp-content': ''}} data-testid="examples-page">
			<Heading level={1} id="examples">Examples</Heading>
			<Heading level={2} id="many-sliders">Many Sliders</Heading>
			<ExampleContainer
				testId="many-sliders"
				initialValue={{number1: 10, number2: 20, number3: 30, number4: 40, number5: 50}}
				scheme={sliderScheme}
			/>
			<Heading level={2} id="color-palettes">Color Palettes</Heading>
			<ExampleContainer
				initialValue={{color1: '#000000', color2: '#FBF4EF', color3: '#E8EAEB', color4: '#AAABAE', color5: '#975E64'}}
				scheme={colorScheme}
			/>
			<Heading level={2} id="three-angle-inputs">Three Angle Inputs</Heading>
			<ExampleContainer initialValue={{low: 0, mid: 0, high: 0}} scheme={angleScheme} />
			<Heading level={2} id="bunch-of-switches">Bunch of Switches</Heading>
			<ExampleContainer
				initialValue={Object.fromEntries(Array.from({length: 10}, (_, index) => [`switch_${index + 1}`, index % 2 === 0])) as Switches}
				scheme={switchScheme}
			/>
			<Heading level={2} id="list-of-file-names">List of File Names</Heading>
			<ExampleContainer
				initialValue={{file_1: 'icon42.svg', file_2: 'logo17.svg', file_3: 'graphic3.svg', file_4: 'illustration89.svg', file_5: 'diagram25.svg', file_6: 'chart64.svg', file_7: 'banner31.svg', file_8: 'avatar12.svg', file_9: 'background76.svg', file_10: 'pattern58.svg'} as Files}
				scheme={fileScheme}
			/>
		</div>
	)
}
