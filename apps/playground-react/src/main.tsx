import '@tweeq/react/style.css'
import './gallery.css'

import {createRoot} from 'react-dom/client'

import {ComponentGallery} from './ComponentGallery'

createRoot(document.getElementById('app')!).render(
	<>
		<header className="playground-header">
			<h1>Tweeq React component gallery</h1>
			<p>Every public component module is represented below.</p>
		</header>
		<ComponentGallery />
	</>,
)
