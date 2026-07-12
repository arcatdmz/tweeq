import {expect, test} from '@playwright/test'

test('documentation navigation switches React pages', async ({page}) => {
	await page.goto('/')
	await expect(page.getByTestId('components-page')).toBeVisible()
	await page.getByRole('link', {name: 'Examples'}).click()
	await expect(page).toHaveURL(/#\/examples$/)
	await expect(page.getByTestId('examples-page')).toBeVisible()
	await page.getByRole('link', {name: 'Features'}).click()
	await expect(page.getByRole('heading', {name: 'Expression Support'})).toBeVisible()
})

test('Many Sliders edits update the live JSON value', async ({page}) => {
	await page.goto('/#/examples')
	const example = page.getByTestId('many-sliders')
	// Case.capital('number1') === 'Number1' — matches the legacy Vue labels.
	// exact: substring matching would also hit the JSON readout <pre>.
	await expect(example.getByText('Number1', {exact: true})).toBeVisible()
	// InputNumber overlays its <input> with inactive content until focused, so
	// a direct click fails Playwright's actionability check. Focus programmatically
	// (Tab-focus is a supported entry path), then type.
	const input = example.locator('input').first()
	await input.focus()
	await input.press('ControlOrMeta+A')
	await input.pressSequentially('42')
	await input.press('Enter')
	await expect(page.getByTestId('many-sliders-value')).toContainText('42')
})

test('Colors page renders the generated swatches', async ({page}) => {
	await page.goto('/#/colors')
	await expect(page.getByTestId('colors-page')).toBeVisible()
	await expect(page.getByTestId('color-swatch')).toHaveCount(24)
	await expect(page.getByText('error / alert / rec')).toBeVisible()
})
