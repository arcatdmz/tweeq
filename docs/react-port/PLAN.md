# Tweeq React Port — Master Plan & Handoff Doc

> **Audience:** any agent (Claude Code subagent, Codex, or human) picking up this work.
> **Branch:** `react-port`. Commit after each completed batch; never commit to `main`.
> **Status tracking:** see the checklist at the bottom + `STATUS.md` (append-only log).
> **Codebase inventory:** `INVENTORY.md` (per-component deps, difficulty, gotchas). Read it before porting anything.
> **Authoring rules:** `CONVENTIONS.md`. Follow them exactly so components stay uniform.

## Goal

Tweeq is a Vue 3 GUI toolkit for creative tools (`src/*` = ~50 components, pinia stores, composables, Stylus themes). We are producing a **React version**, extracting framework-agnostic logic into a core layer. **Vue support may be dropped**; the old `.vue` sources remain in place during the port purely as reference.

## Target architecture

```
src/
  core/           # NO framework imports (no vue, no react). Pure TS + DOM.
    stores/       # vanilla zustand stores: theme, actions, appConfig, modal, multiSelect
    theme/        # palette generation (material-color-utilities, radix), CSS var emission
    drag/         # drag/scrub state machine extracted from use/useDrag.ts (bndr-js based)
    ...           # util.ts, types.ts, validator.ts, color logic, parsing/formatting
  react/          # React 18+ components; thin rendering over core
    components/   # one dir per component, mirroring src/<Name>/
    hooks/        # useDrag, useBndr, useCopyPaste, ... (React adapters over core)
    index.ts      # public entry: exports components + initTweeq/useTweeq equivalents
  <Name>/         # LEGACY Vue components — reference only, do not edit
```

## Locked-in decisions

| Concern | Decision |
|---|---|
| State | **zustand v5**: `createStore` (vanilla) in `src/core/stores`, consumed in React via `useStore`. Replaces pinia. |
| Icons | `@iconify/react` replaces `@iconify/vue`. Keep the same `Icon` component API (string `icon` prop, supports `material-symbols:...` etc.). |
| Monaco | `@monaco-editor/react` replaces `monaco-editor-vue3`. |
| Gestures/input | `bndr-js` stays (framework-agnostic). `@vueuse/gesture` and `@vueuse/core` usages get replaced by core logic + small React hooks — do **not** add a vueuse-like React kitchen-sink dep. |
| Styles | Scoped `.styl` blocks in `.vue` files → **CSS Modules** (`<Name>.module.styl`). `common.styl` + theme CSS custom properties (`--tq-*`) stay as-is. |
| v-model | Vue `modelValue`/`update:modelValue` → React `value` + `onChange(value)` (controlled-only). See CONVENTIONS.md. |
| Build | Vite lib build with `@vitejs/plugin-react`; entry `src/react/index.ts`. `react`/`react-dom` are peerDependencies (>=18). Vue build targets can break/be removed — that's fine. |
| Tests | Existing vitest tests for pure logic move with the code into `src/core`. New core modules get unit tests where logic is nontrivial (drag math, parsing, theme). |
| E2E | **Playwright** (`@playwright/test`, chromium) against the demo playground (`demo/`, vite React app). Each batch adds a demo page section + at least a smoke test (renders, basic interaction fires `onChange`). Installing extra deps (npm or native) for testing is allowed. |

## Phases

1. **Phase 1 — core extraction** (blocks everything): port stores to vanilla zustand, move `theme/`, `util.ts`, `types.ts`, `validator.ts` into `src/core`, extract `useDrag` state machine.
2. **Phase 2 — React infra**: `TweeqProvider` (theme CSS vars, appId, global styles), `Icon`, hooks (`useBndr`, `useDrag`, `useCopyPaste`, ...), `initTweeq`/`useTweeq` equivalents.
3. **Phase 3 — components in batches** (see checklist; batch composition comes from INVENTORY.md's dependency order).
4. **Phase 4 — build/demo/cleanup**: vite build for the React lib, a demo page exercising every component, drop dead Vue deps.

## How to work on a batch (for agents)

1. Read `INVENTORY.md` entry + the legacy Vue source for your components.
2. Port per `CONVENTIONS.md`. Reuse `src/core` — if you need logic that lives in a `.vue` file, extract it to core first.
3. Typecheck (`npx tsc -p tsconfig.json --noEmit`) and run `npx vitest run` for anything you added tests for. `npm run lint` must pass for files you touched.
4. Tick your batch in the checklist below, append a dated entry to `STATUS.md` (what was done, deviations, TODOs).
5. Commit on `react-port` with message `react-port: <batch name>`.

## Batch checklist

Filled in after INVENTORY.md lands. States: `[ ]` todo · `[~]` in progress (note owner in STATUS.md) · `[x]` done.

- [ ] Phase 1: core extraction (stores, theme, util/types/validator, drag core)
- [ ] Phase 2: React infra (TweeqProvider, Icon, hooks, useTweeq)
- [ ] Batch A: primitives — Icon-adjacent + buttons/toggles (SvgIcon, ColorIcon, IconIndicator, BindIcon, InputButton, InputButtonToggle, InputCheckbox, InputSwitch, InputRadio, InputGroup)
- [ ] Batch B: text/number — InputTextBase, InputString, InputNumber, InputVec, InputSize, InputPosition, InputTranslate, InputSeed(InputShuffle)
- [ ] Batch C: overlays — Popover, Tooltip, Balloon, Menu, InputDropdown, MultiSelectPopup, TweakOverlay
- [ ] Batch D: rotary/temporal — InputAngle, InputRotary, InputDrum, InputTime, Ruler, Timeline
- [ ] Batch E: color & curves — InputColor (+ useInputColor), InputCubicBezier, GlslCanvas
- [ ] Batch F: code/text-adjacent — MonacoEditor, InputCode, Markdown, InputComplex
- [ ] Batch G: panes/layout — PaneSplit, PaneExpandable, PaneFloating, PaneModal, PaneModalComplex, PaneModalTabs, PaneZUI, Tabs, TitleBar, ParameterGrid, Viewport, App, CommandPalette, TweeqProvider wiring
- [ ] Phase 4: build config, demo app, dependency cleanup, final lint/typecheck

> NOTE: batch composition above is provisional — reconcile with INVENTORY.md's dependency-ordered batches once that file exists, and update this list if the survey suggests a better split.

## Usage-limit protocol

If you (an agent) are running low on context/usage: STOP starting new work, finish or revert the file you're mid-way through, update `STATUS.md` with exact next steps (file paths, what's half-done), and commit with `react-port: WIP <what>`.
