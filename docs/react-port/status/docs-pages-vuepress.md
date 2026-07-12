# Docs pages: source-faithful VuePress DOM

## Components

Converted every entry in `docs/components.md` to anchored VuePress headings, live `DemoComponent` islands, source-matching initial values/options/schemes, interaction notes, prose, and React-adapted common API tables (`value`/`onChange`, camel-cased attributes, and React callback names).

Deviations: Vue's inline `Icon` in the InputSize note is represented as prose because the React icon component does not accept the legacy Vue `icon` API in that markdown context. Legacy descriptor/passthrough properties that are absent from the narrower React types use explicit `unknown`/`Scheme` casts. The source typo “SMTPE” is intentionally preserved.

## Home

Converted the frontmatter to the default-theme `vp-hero`, hero actions, `vp-features`/`vp-feature`, and body `vp-content` DOM. Internal documentation actions use hash routes; the UIST action remains an internal `/uist2025` route exactly as declared by the source frontmatter. The empty hero description element reflects the absent `tagline`/`heroText` values (VuePress supplies the site title as the hero title). The badge and markdown body are preserved.

## Features

Wrapped the page in `vp-content`, converted all headings to VuePress anchor headings, and restored all source prose verbatim, including the InputPosition example and internal hash link. The source image has an empty alt attribute because the markdown image has no alt text.

## Colors

Wrapped the source prose and existing live palette demo in `vp-content`; converted the document and live-demo section headings to anchored VuePress headings. The generated preview remains the React equivalent of the source `ColorPaletteDemo` island.

## Examples

Wrapped content in `vp-content`, converted every heading to a VuePress anchor heading, retained all live examples/test IDs, and corrected scheme values to the markdown (`mdi-*` spellings and `ui: 'switch'`). The legacy `switch` scheme uses an explicit cast because the React `Scheme` type does not include that Vue-era UI discriminator.

## Verification

- `npx tsc -p tsconfig.json --noEmit`: passed.
- `npx eslint demo e2e`: passed.
- `npx vitest run`: passed (22 files, 84 tests).
- `npm run e2e`: could not start Playwright's configured Vite server on port 5174 in the sandbox (`Process from config.webServer was not able to start`, exit 1); no server was already listening on that port. No e2e assertions were weakened or changed.
