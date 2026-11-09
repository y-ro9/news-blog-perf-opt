# News Blog — Performance Optimization

> A React interface that lets the News Blog floor staff track, filter, and manage performance optimization tasks — replacing fragile paper/Excel workflows with a fast, accessible, and resilient digital tool.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-2.1-6E9F18?logo=vitest&logoColor=white)
![Tests](https://img.shields.io/badge/tests-10%20passing-brightgreen)
![A11y](https://img.shields.io/badge/a11y-100%25%20Lighthouse-blueviolet)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📖 Overview

This module was built after News Blog's operations team reported **massive data loss and operational slowdowns** caused by manual paper-based tracking.

The component gives floor staff a single, reliable place to:

- **View** all optimization tasks (loaded asynchronously with a visual indicator)
- **Add** new tasks with input validation and XSS sanitization
- **Search / filter** tasks instantly
- **Toggle** task status (pending ↔ done)
- **Trust the data** — every mutation is sanitized, validated, and telemetry-logged

The UI is a strict **monochromatic corporate design** with WCAG-compliant contrast, keyboard navigation, and ARIA semantics throughout.

---

## ✨ Features

| Category | What it does |
|----------|-------------|
| **Happy Path** | Instant input response, structured task list, live status toggle, completion counter |
| **Empty States** | `"No data found"` message when search/filter returns zero results |
| **Slow Network** | Animated spinner + `role="status"` during async initial load and submit |
| **Invalid Input** | Red border + `role="alert"` error, `aria-invalid="true"`, `aria-describedby` link |
| **Security** | Every text input passed through `sanitizeInput()` — strips `<script>`, HTML tags, `javascript:` protocol |
| **Telemetry** | `[Analytics] User interacted with Performance Optimization` logged on every primary action |
| **Accessibility** | 100% Lighthouse a11y, semantic HTML, ARIA labels, focus-visible outlines, sr-only headings |
| **Performance** | `useMemo` on derived data, `useCallback` on all handlers — zero wasted re-renders |

---

## 🧱 Tech Stack

- **Framework:** React 18 (function components + hooks)
- **Build tool:** Vite 5
- **Testing:** Vitest + React Testing Library + `@testing-library/user-event`
- **Linting:** ESLint 9 (flat config) with `react`, `react-hooks`, `react-refresh` plugins
- **Runtime:** Node 18+, modern evergreen browsers

---

## 🚀 Getting Started

### Prerequisites
- Node.js **18+**
- npm **9+**

### Install & run

```bash
# 1. Clone
git clone https://github.com/y-ro9/news-blog-perf-opt.git
cd news-blog-perf-opt

# 2. Install dependencies
npm install

# 3. Start dev server (http://localhost:5173)
npm run dev
```
### Run the test suite

```bash
# Watch mode (TDD)
npm test

# Single run (CI)
npm run test:run
```

### Lint & build

```bash
npm run lint
npm run build
npm run preview
```

## 🧪 Testing Strategy — TDD First

This project follows strict Test-Driven Development. The test suite (src/components/PerformanceOptimization.test.jsx) was written before the component itself.

```Coverage — 10 tests

#	Test					Guard Against

1	Renders main heading			Broken mount
2	Shows loading indicator			Silent async states
3	Shows "No data found" on empty filter	Blank-screen UX bug
4	Rejects empty submission + flags input	Form validation gaps
5	Adds valid task + fires analytics	Silent failures
6	Sanitizes <img onerror> XSS payload	XSS injection
7	Filters tasks by search term		Broken search
8	Toggling status fires analytics		Missing telemetry
9	All controls have accessible labels	a11y regression
10	sanitizeInput unit tests (4 cases)	Utility drift
```

### Run them with:

```bash
npm run test:run
```

## ♿ Accessibility (a11y)

Verified against the Lighthouse Accessibility audit — 100 / 100.

    All form controls use <label htmlFor> or aria-label

    Live regions (role="status", role="alert") for screen readers

    Keyboard navigable — no tabindex hacks, native focus order

    :focus-visible outlines on every interactive element

    Visually hidden headings via .po-sr-only for document structure

    Color contrast meets WCAG AA (monochromatic palette)

## 🔒 Security

All user-supplied text passes through `sanitizeInput()` before entering React state:

```js
	// src/utils/sanitize.js
	export function sanitizeInput(input) {
	  if (typeof input !== 'string') return '';
	  return input
	    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
	    .replace(/<[^>]*>/g, '')
	    .replace(/javascript:/gi, '')
	    .trim();
	}
```

    Strips `<script>` blocks, HTML tags, and `javascript:` URLs

    Returns empty string for non-string inputs (defensive)

    Covered by 4 dedicated unit tests

No API keys, tokens, or PII are hardcoded anywhere in the source.

## 🎨 Design System

### Strictly monochromatic — no rogue hex colors. All tokens live in `src/index.css`:

```css
:root {
  --color-bg:        #ffffff;
  --color-surface:   #f5f5f5;
  --color-border:    #d4d4d4;
  --color-text:      #1a1a1a;
  --color-text-muted:#6b6b6b;
  --color-primary:   #1a1a1a;   /* black */
  --color-on-primary:#ffffff;
  --color-danger:    #b00020;   /* only for validation */
  --space-2: 8px; --space-4: 16px; --space-6: 24px; --space-8: 32px;
}
```

    Spacing on an 8 / 16 / 24 / 32 scale

    `#b00020` is the only non-grayscale color — reserved strictly for form errors

    All styles scoped under the `.po-*` namespace to avoid bleed

## 📁 Project Structure

```text
news-blog-perf-opt/
├── src/
│   ├── components/
│   │   ├── PerformanceOptimization.jsx       # Main component
│   │   ├── PerformanceOptimization.css       # Scoped styles
│   │   └── PerformanceOptimization.test.jsx  # 10-test suite
│   ├── utils/
│   │   ├── sanitize.js                       # XSS guard
│   │   └── analytics.js                      # Telemetry stub
│   ├── test/
│   │   └── setup.js                          # jest-dom matchers
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                             # Design tokens
├── PROMPTS.md                                # Vibe Coding traceability log
├── eslint.config.js
├── vite.config.js
├── index.html
└── package.json
```

## 📋 Definition of Done — Checklist

    ☑ Code compiles and runs (npm run build ✅)
    ☑ Zero ESLint warnings (npm run lint ✅)
    ☑ All happy + unhappy path tests pass (10 / 10 ✅)
    ☑ PROMPTS.md present in root
    ☑ No hardcoded API keys / PII
    ☑ 100% Lighthouse accessibility score
    ☑ Analytics telemetry fires on every primary action
    ☑ All text inputs sanitized against XSS


## 🔗 Live Demo

Deployed URL: [https://news-blog-perf-opt.vercel.app](https://news-blog-perf-opt.vercel.app/)

## 📜 License

MIT — internal client deliverable for **News Blog**.

Assignee: **Yash Raj**

**Reporter:** Amit Sharma (Senior Staff Engineer)

**Tech Lead:** Deepika Kumari

