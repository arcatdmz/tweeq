import {resizeSplitPane} from '@tweeq/core'
import {appConfigStore, type DragState} from '@tweeq/dom'
import {
	type CSSProperties,
	type HTMLAttributes,
	type ReactNode,
	useMemo,
	useRef,
} from 'react'

import {classNames} from '../../classNames'
import {useConfigRef, useDrag} from '../../hooks'
import styles from './PaneSplit.module.styl'

export interface PaneSplitProps extends HTMLAttributes<HTMLDivElement> {
	name: string
	direction: 'horizontal' | 'vertical'
	size?: number
	scroll?: readonly [boolean, boolean]
	fixed?: 'first' | 'second'
	min?: number
	first?: ReactNode
	second?: ReactNode
}

export function PaneSplit({
	name,
	direction,
	size: defaultSize = 50,
	scroll = [true, true],
	fixed,
	min = 40,
	first,
	second,
	className,
	style,
	...props
}: PaneSplitProps) {
	const root = useRef<HTMLDivElement>(null)
	const divider = useRef<HTMLDivElement>(null)
	const entry = useMemo(
		() =>
			appConfigStore
				.getState()
				.ref(fixed ? `${name}.px` : `${name}.width`, defaultSize),
		[defaultSize, fixed, name]
	)
	const [size, setSize] = useConfigRef(entry)
	const startSize = useRef(size)
	const current = useRef({size, setSize, fixed, direction, min})
	current.current = {size, setSize, fixed, direction, min}
	const dragOptions = useMemo(
		() => ({
			dragDelaySeconds: 0,
			onDragStart: () => {
				startSize.current = current.current.size
			},
			onDrag: (drag: DragState) => {
				const state = current.current
				const delta =
					state.direction === 'horizontal'
						? drag.xy[0] - drag.initial[0]
						: drag.xy[1] - drag.initial[1]
				const bounds = root.current?.getBoundingClientRect()
				const viewportSize =
					state.direction === 'horizontal'
						? bounds?.width ?? 0
						: bounds?.height ?? 0
				state.setSize(
					resizeSplitPane({
						start: startSize.current,
						movement: delta,
						fixed: state.fixed,
						viewportSize,
						minPixelSize: state.min,
					})
				)
			},
		}),
		[]
	)
	useDrag(divider, dragOptions)
	const sizedPane = fixed ?? 'first'
	const dimension = direction === 'horizontal' ? 'width' : 'height'
	const sizeStyle = {[dimension]: `${size}${fixed ? 'px' : '%'}`}

	return (
		<div
			{...props}
			ref={root}
			className={classNames(
				styles.split,
				styles[direction],
				fixed && styles.fixed,
				className
			)}
			style={{...style, '--pane-min': `${min}px`} as CSSProperties}
			data-tq-part="root"
		>
			<div
				className={classNames(
					styles.pane,
					sizedPane !== 'first' && styles.grow
				)}
				style={sizedPane === 'first' ? sizeStyle : undefined}
				data-tq-part="first"
			>
				<div className={classNames(styles.wrapper, scroll[0] && styles.scroll)}>
					{first}
				</div>
			</div>
			<div ref={divider} className={styles.divider} data-tq-part="divider" />
			<div
				className={classNames(
					styles.pane,
					sizedPane !== 'second' && styles.grow
				)}
				style={sizedPane === 'second' ? sizeStyle : undefined}
				data-tq-part="second"
			>
				<div className={classNames(styles.wrapper, scroll[1] && styles.scroll)}>
					{second}
				</div>
			</div>
		</div>
	)
}
