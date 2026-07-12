# React Port — Authoring Conventions

Every ported component follows these rules. Uniformity matters more than local taste; if a rule seems wrong for your component, note it in STATUS.md instead of silently deviating.

## Files & naming

```
src/react/components/<Name>/
  <Name>.tsx          # the component (named export, no default exports)
  <Name>.module.styl  # CSS Module ported from the .vue <style scoped> block
  index.ts            # re-exports the component + its public types
  <helper>.ts         # component-local logic; move to src/core if reusable
```

- Component names keep the legacy names (`InputNumber`, `PaneSplit`, ...), exported as named exports from `src/react/index.ts`.
- Props interfaces are exported and named `<Name>Props`.

## Props / state model

- Vue `modelValue` + `update:modelValue` → **controlled** `value: T` + `onChange?: (value: T) => void`. No internal uncontrolled fallback unless the legacy component had one.
- Secondary models (`v-model:foo`) → `foo` + `onChangeFoo`.
- Vue emits from `InputEmits` (`focus`, `blur`, `confirm`) → optional callbacks `onFocus`, `onBlur`, `onConfirm`. Keep the same semantics (confirm = commit at end of gesture/edit).
- Vue slots → React: default slot becomes `children`; named slots become render props (`renderLabel?: () => ReactNode`) only when actually used by consumers in this repo — otherwise drop.
- Keep prop names/types otherwise identical to the Vue version so docs stay meaningful.

## Styling

- Port the `<style lang="stylus" scoped>` block to `<Name>.module.styl` verbatim where possible; class names become camelCase module keys. Keep using theme CSS custom properties (`var(--tq-...)`) — do not hardcode colors.
- Global imports (`@import '../common.styl'`) work in `.module.styl` too; check what the legacy file imported.
- No inline styles except truly dynamic values (transform positions, computed colors). Use CSS vars set via `style={{'--foo': ...}}` for dynamic theming, matching legacy patterns.

## State & effects

- Global/shared state comes from `src/core/stores` (vanilla zustand) via `useStore(themeStore, selector)` — never duplicate store state into React state.
- Event/gesture wiring uses `bndr-js` through the shared hooks in `src/react/hooks` (`useBndr`, `useDrag`, ...). Don't hand-roll `addEventListener` in components when a hook exists.
- `watch`/`computed` translate to `useEffect`/`useMemo` only when needed — prefer deriving during render.
- Cleanup: every effect that subscribes must dispose (bndr emitters have `.dispose()`; zustand `subscribe` returns unsubscribe).

## Core extraction rule

If you find yourself porting nontrivial logic (math, parsing, state machines, color) from inside a `.vue` file into a `.tsx` file: **stop** — put it in `src/core/` as pure TS with no React imports, add a unit test if it has branches worth testing, then call it from the component. The React file should read as "rendering + event glue only".

## Quality bar (per batch)

- `npx tsc -p tsconfig.json --noEmit` clean
- `npx eslint <files you touched>` clean
- `npx vitest run` green
- Add your components to the demo app (`demo/`) and add/extend a Playwright smoke test (`e2e/`): component renders and a representative interaction (click/drag/type) triggers `onChange` with the right value. Run `npx playwright test e2e/<your-file>` and make it pass.
- No `any` unless the legacy code had it; no `@ts-ignore`/`@ts-expect-error` without a comment explaining why.
- No new npm dependencies beyond those listed in PLAN.md's decisions table without noting it in STATUS.md.
