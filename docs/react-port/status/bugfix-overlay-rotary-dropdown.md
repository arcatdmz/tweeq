# Overlay, rotary snap, and dropdown edge bugfixes

## Bug 1 — TweakOverlay demo

Root cause: `demo/sections/TweakOverlaySection.tsx` mounted `TweakOverlay` for the
entire lifetime of the demo page. Since the component enters the browser top
layer, its generic “Top-layer overlay” child appeared to be stray application
content. Legacy rotary usage mounts the overlay only while `tweaking` is true
(`src/InputRotary/InputRotary.vue:87-96` establishes gesture state used by the
conditional overlay later in that component).

Changed the demo section to mount it only from pointer-down until pointer-up,
cancel, or leave on a clearly labelled “Hold to show overlay” button. Updated
`e2e/primitives.spec.ts` to assert absence at rest, `:popover-open` while held,
intentional content, and removal after release.

## Bug 2 — InputAngle/InputRotary snapping

Root cause: Vue explicitly keeps a pre-snap local value
(`src/InputRotary/InputRotary.vue:109-116`) and quantizes only the derived value;
its Shift/Q key state and radius band are live (`:87-95`). The React port wrote
the quantized result back into its local accumulator on every drag event. That
discarded sub-snap deltas and made relative motion stick/jitter. Its center also
came from hook state rather than being refreshed at the event that performs the
radius test.

Added pure `getRotaryDragValue` in `src/core/inputRotary.ts`, which returns the
unsnapped accumulator and separately quantized output. React now preserves the
former, emits the latter, continues to read window-level live Shift/Q state,
and measures the element center in viewport coordinates on every drag event
(`src/react/components/InputRotary/InputRotary.tsx:150-183`). InputAngle already
passed `snap` through unchanged.

`src/core/inputRotary.test.ts` covers 45-degree quantization, repeated relative
deltas, and toggling snap off without losing accumulated motion.
`e2e/rotary-snap.spec.ts` covers Shift snapping across multiple moves, releasing
Shift mid-drag, and radial-band snapping.

## Bug 3 — InputDropdown gradation

Source comparison shows Vue computes each direction independently
(`src/InputDropdown/InputDropdown.vue:215-225`) and conditionally mounts only
that arrow (`:473-487`). React already had equivalent independent conditions
(`src/react/components/InputDropdown/InputDropdown.tsx:117-124,331-348`) and
uses the same translucent input surface as Vue. The visual drift was in the
ported overlay geometry: React had omitted the edge border radii, text color,
pointer behavior, and cursor from Vue's overlay rules
(`src/InputDropdown/InputDropdown.vue:596-617`). Those omissions made the
gradient strips read as square, detached bands against the rounded popup.

Restored those rules in
`src/react/components/InputDropdown/InputDropdown.module.styl:86-107` while
retaining the legacy colors, 0.7-row height, 2px horizontal inset, 1px edge
offset, and z-index 20. Expanded the dropdown demo to ten items so both edge
states are available.

## Verification

- `npx eslint` on every touched TS/TSX file: passed.
- `npx vitest run`: 22 files, 84 tests passed.
- Targeted rotary unit suite: 3 tests passed.
- `npx tsc -p tsconfig.json --noEmit`: blocked by concurrent changes in the
  explicitly off-limits `demo/pages/ColorsPage.tsx` and
  `demo/pages/ExamplesPage.tsx`; no reported error is in a file changed here.
- `npm run e2e`: Playwright's configured server cannot bind in this execution
  sandbox (`listen EPERM 127.0.0.1:5174`), so browser assertions and requested
  top/middle/bottom screenshots could not execute here. The new specs are left
  ready for the normal permitted environment.

Files touched outside ownership: none. Existing concurrent modifications to
`demo/DemoApp.tsx`, `demo/demo.css`, `demo/pages/**`, and other status/e2e files
were not edited.
