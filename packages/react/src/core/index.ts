// Temporary Stage V1/V2 alias (plan §5): the React renderer historically
// imported everything framework-neutral from a single '../core' barrel.
// It now forwards to the owning packages; imports migrate to explicit
// '@tweeq/core' / '@tweeq/dom' specifiers during Phase 3 family work, and
// this file is tracked in the parity-matrix deletion checklist.
export * from '@tweeq/core'
export * from '@tweeq/dom'
