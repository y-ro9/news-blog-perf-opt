# PROMPTS.md — Vibe Coding Traceability Log

This document records the sequence of prompts used to drive the Antigravity AI assistant
through the TDD workflow for ticket **ENG-84718 — Performance Optimization for News Blog**.

## Phase 1 — Test Suite First (TDD Red)

**Prompt 1**
> You are building a React component called `PerformanceOptimization` for the News Blog.
> Before writing any production code, write a Vitest + React Testing Library test suite
> that asserts the following acceptance criteria:
> - Renders a heading "Performance Optimization"
> - Shows a loading indicator (`role="status"`) during initial async load
> - Shows "No data found" when the filtered task list is empty
> - Rejects empty submissions: form error with `role="alert"`, input has
>   `aria-invalid="true"` and a red-border class
> - A valid submission adds the task and logs exactly:
>   `[Analytics] User interacted with Performance Optimization`
> - XSS payloads (`<img src=x onerror=...>`) are sanitized in state and never rendered
> - Search filters the task list by title
> - Toggling a task status fires the same analytics log
> - All interactive controls have accessible labels (`getByLabelText` / `aria-label`)
> Include unit tests for a `sanitizeInput` utility.

**Prompt 2**
> The tests must fail against an empty component. Do not implement yet. Only commit
> the test file and the `sanitizeInput` utility stub that returns empty string.

## Phase 2 — Implementation (TDD Green)

**Prompt 3**
> Now implement `src/components/PerformanceOptimization.jsx` so that the test suite
> passes. Constraints:
> - Use `useMemo` for `filteredTasks` and `completedCount`
> - Use `useCallback` for `handleSearchChange`, `handleTitleChange`,
>   `handleAddTask`, `toggleStatus`
> - Simulate async initial load with `setTimeout` (600 ms) to exercise the loading state
> - Simulate async submit (300 ms) so `aria-busy` and disabled states are visible
> - Sanitize all text inputs via `sanitizeInput` before writing to state
> - Call `trackEvent()` on successful add and on status toggle

**Prompt 4**
> Add `src/components/PerformanceOptimization.css` with a strict monochromatic
> corporate design: black/white/grey palette, CSS variables, padding on a 8/16/24/32
> scale. Provide a `.po-input-error` class with `border-color` `#b00020` (only
> failure-state color permitted). Add `.po-sr-only` for visually hidden headings.

## Phase 3 — Iteration & Fixes

**Prompt 5**
> The loading-state test is flaky because the effect fires outside `act()`. Wrap the
> awaited transition in `waitFor`/`findByRole` inside a `renderLoaded` helper so all
> assertions run against the loaded DOM. Do not change production code.

**Prompt 6**
> ESLint reports `react/prop-types` and `react/react-in-jsx-scope` warnings. Disable
> both rules in `eslint.config.js` and re-run `npm run lint` until zero warnings.

**Prompt 7**
> Rename `TrackEvent` to `trackEvent` and move the console message into a dedicated
> util so the string is centralized and testable.