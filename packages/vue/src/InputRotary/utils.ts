// Stage V2: the implementation lives in @tweeq/core (fixture:
// core/src/inputRotary.test.ts "clamps a label ray to the viewport
// rectangle"). @baku89/pave's Rect and core's geometry Rect are the same
// readonly [min, max] tuple, so callers pass either.
export {clampPosWithinRect} from '@tweeq/core'
