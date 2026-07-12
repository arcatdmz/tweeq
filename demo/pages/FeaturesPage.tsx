export function FeaturesPage() {
	return <article className="docs-page" data-testid="features-page">
		<h1>Features</h1>
		<h2>Specialized Inputs for Creative Software</h2>
		<p>Tweeq provides precise controls for creative applications, from color and number inputs to rotary knobs, two-dimensional offsets, and timecode.</p>
		<h2>“Drag-to-tweak” Interaction</h2>
		<p>Drag pads and handles to adjust values. Shift increases adjustment scale, Alt enables finer adjustment, Q snaps values, and A/R select absolute or relative behavior where supported.</p>
		<h2>Simultaneous Editing</h2>
		<p>Hold Shift or the platform Meta key to select multiple compatible parameters and edit them together, much like spreadsheet cells.</p>
		<h2>Expression Support</h2>
		<p>Numeric inputs accept JavaScript expressions. Expressions can refer to <code>x</code>, the current value, and <code>i</code>, the zero-based parameter index.</p>
	</article>
}
