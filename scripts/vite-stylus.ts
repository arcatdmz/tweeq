import {fileURLToPath} from 'node:url'

const commonStylusPath = fileURLToPath(
	new URL('../packages/styles/src/common.styl', import.meta.url)
)

/** Inject shared build-time Stylus mixins into every preprocessed stylesheet. */
export const tweeqStylusOptions = {
	additionalData: `@require '${commonStylusPath}'\n`,
}
