<script setup lang="ts">
import {vec2} from 'linearly'
import type {editor} from 'monaco-editor'
import {
	markRaw,
	nextTick,
	onMounted,
	shallowRef,
	useTemplateRef,
	watchEffect,
} from 'vue'

import type {MonacoEditorProps} from './types'
import {useThemeStore} from '../stores/theme'

withDefaults(defineProps<MonacoEditorProps>(), {})

defineEmits<{
	'update:modelValue': [value: string]
	'update:cursorIndex': [value: number]
	'update:cursorPosition': [value: vec2]
}>()

const theme = useThemeStore()

const editorOptions: editor.IStandaloneEditorConstructionOptions = {
	minimap: {enabled: false},
	fontLigatures: true,
	fontFamily: 'Geist Mono',
	fontSize: theme.rem,
	folding: false,
	lineNumbers: 'off',
	lineDecorationsWidth: 0,
	lineNumbersMinChars: 0,
	overviewRulerLanes: 0,
	renderLineHighlight: 'none',
	scrollBeyondLastLine: false,
	scrollbar: {
		horizontalSliderSize: 2,
		useShadows: false,
		verticalSliderSize: 2,
		verticalScrollbarSize: 2,
	},
	tabSize: 2,
	// @ts-ignore
	'bracketPairColorization.enabled': false,
	renderIndentGuides: false,
}

// Register (and keep in sync) the palette-derived editor theme. defineTheme is
// global and safe to call before the editor mounts; setTheme re-applies it when
// the palette/appearance changes.
const THEME_NAME = 'tweeq'
const codeEditor = shallowRef()
const editorApi = shallowRef<typeof editor>()

watchEffect(() => {
	if (!editorApi.value) return
	editorApi.value.defineTheme(
		THEME_NAME,
		theme.monacoTheme as editor.IStandaloneThemeData
	)
	editorApi.value.setTheme(THEME_NAME)
})

const $editor = useTemplateRef<{$el: HTMLElement}>('$editor')

onMounted(async () => {
	const [wrapper, monaco] = await Promise.all([
		import('monaco-editor-vue3'),
		import('monaco-editor'),
	])
	codeEditor.value = markRaw(wrapper.CodeEditor)
	editorApi.value = monaco.editor
	await nextTick()
	if (!$editor.value) return

	const el = $editor.value.$el as HTMLElement

	el.addEventListener('keydown', (event: KeyboardEvent) => {
		event.stopPropagation()
	})
	el.addEventListener('keyup', (event: KeyboardEvent) => {
		event.stopPropagation()
	})
})

// 	// fetch the theme file and apply to the editor
// 	monaco.editor.defineTheme('light', Tomorrow as any)
// 	monaco.editor.defineTheme('dark', TomorrowNight as any)

// 	const theme = useThemeStore()

// 	watchEffect(() => {
// 		monaco.editor.setTheme(theme.colorMode)
// 	})

// 	// resize editor to match its parent element size
// 	useResizeObserver($root.value.parentElement, entries => {
// 		const {
// 			contentRect: {width, height},
// 		} = entries[0]

// 		editor.layout({width, height})
// 	})

// 	// allow ES5 JavaScript linting
// 	const options =
// 		monaco.languages.typescript.javascriptDefaults.getCompilerOptions()
// 	options.noLib = true
// 	options.target = monaco.languages.typescript.ScriptTarget.ES5
// 	options.lib = ['es6']

// 	// run the code on change
// 	editor.getModel()?.onDidChangeContent(() => {
// 		const value = editor.getValue()
// 		if (value === props.modelValue) return
// 		emit('update:modelValue', editor.getValue())
// 	})

// 	editor.onDidChangeCursorPosition(() => {
// 		const position = editor.getPosition()

// 		if (!position) return

// 		// Convert monaco editor's position to character-based index
// 		const index = editor.getModel()?.getOffsetAt(position) ?? 0
// 		emit('update:cursorIndex', index)

// 		// Convert monaco editor's position to pixel-based position
// 		const cursorInfo = editor.getScrolledVisiblePosition(position)
// 		if (cursorInfo) {
// 			const {top, left, height} = cursorInfo
// 			emit('update:cursorPosition', [left, top + height])
// 		}
// 	})

// 	watch(
// 		() => props.cursorIndex,
// 		cursorIndex => {
// 			if (cursorIndex === undefined) return

// 			const prevPosition = editor.getPosition()
// 			const position = editor.getModel()?.getPositionAt(cursorIndex)
// 			if (!prevPosition || !position || position.equals(prevPosition)) {
// 				return
// 			}

// 			editor.setPosition(position)
// 		},
// 		{immediate: true}
// 	)

// 	watch(
// 		() => props.errors,
// 		errors => {
// 			if (!errors) return

// 			const model = editor.getModel()
// 			if (!model) return

// 			// Add error decorations to monaco editor
// 			monaco.editor.setModelMarkers(
// 				model,
// 				'my-source',
// 				errors.map(error => ({
// 					message: error.message,
// 					severity: monaco.MarkerSeverity.Error,
// 					startLineNumber: error.line,
// 					endLineNumber: error.line,
// 					startColumn: error.column,
// 					endColumn: error.column,
// 				}))
// 			)
// 		},
// 		{immediate: true}
// 	)
// })
</script>

<template>
	<component
		:is="codeEditor"
		v-if="codeEditor"
		ref="$editor"
		class="TqMonacoEditor"
		:value="modelValue"
		:theme="THEME_NAME"
		:language="lang"
		:options="editorOptions"
		@update:value="$emit('update:modelValue', $event)"
		height="100%"
	/>
</template>

<style lang="stylus" scoped>
.TqMonacoEditor
	background transparent !important

:deep(.monaco-editor)
	--vscode-editor-background transparent !important
</style>
