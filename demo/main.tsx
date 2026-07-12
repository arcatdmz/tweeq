import './demo.css'

import {createRoot} from 'react-dom/client'

import {TweeqProvider, Viewport} from '../src/react'
import {DemoApp} from './DemoApp'

// Like the legacy Vue toolkit, ALL base styles (font, reset, selection,
// scrollbars — reset-viewport() in common.styl) are scoped to <Viewport>'s
// .TqViewport subtree. TweeqProvider alone only provides stores/overlay roots.
// No accent/background overrides: tweeq's defaults (blue accent) match the
// published legacy docs at baku89.github.io/tweeq.
createRoot(document.getElementById('app')!).render(
	<TweeqProvider appId="react-demo" colorMode="light">
		<Viewport appId="react-demo">
			<DemoApp />
		</Viewport>
	</TweeqProvider>
)
