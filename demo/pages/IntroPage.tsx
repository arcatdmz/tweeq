export function IntroPage() {
	return <article className="docs-page intro-page" data-testid="intro-page">
		<h1>Tweeq</h1>
		<p className="lede">Specialized React input components and micro-interactions for creative professionals.</p>
		<div className="feature-cards">
			<h2>Specialized Inputs for Creators</h2><p>Numeric sliders, color pickers, cubic-bezier editors, and more.</p>
			<h2>Drag-to-tweak Interaction</h2><p>Precise, quick parameter adjustment through direct gestures.</p>
			<h2>Simultaneous Editing</h2><p>Select and parametrically edit multiple values at once.</p>
			<h2>Expression Support</h2><p>Control numeric parameters dynamically with JavaScript expressions.</p>
		</div>
		<h2>How to use</h2>
		<pre><code>{`import { TweeqProvider, InputNumber } from 'tweeq'\n\n<TweeqProvider appId="my-app">\n  <InputNumber value={opacity} min={0} max={1} onChange={setOpacity} />\n</TweeqProvider>`}</code></pre>
	</article>
}
