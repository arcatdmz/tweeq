/**
 * Demo playground for the React port.
 *
 * Each ported batch adds a <section data-testid="<BatchOrComponentName>">
 * here exercising its components with visible state, so Playwright tests in
 * e2e/ can assert rendering + interaction. Keep sections self-contained.
 */
export function DemoApp() {
	return (
		<main>
			<h1>Tweeq React Demo</h1>
			<p data-testid="placeholder">
				No components ported yet — sections appear here per batch.
			</p>
		</main>
	)
}
