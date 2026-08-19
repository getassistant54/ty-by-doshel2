# Production & Quality Rules for Antigravity

## 1. Zero External Runtime Dependency (Autonomous Assets)
- Never rely on `https://cdn.tailwindcss.com` or JIT browsers in production/GitHub Pages.
- All styles must be pre-compiled into local static CSS files (e.g. `css/tailwind.min.css`, `css/styles.css`).
- Libraries (like Lucide icons) must be downloaded locally in the repository (e.g. `js/vendor-lucide.js`) to guarantee offline / strict-CSP operation.

## 2. Strict Content Security Policy (CSP)
- Maintain strict and safe CSP in `index.html`.
- Never weaken CSP with `'unsafe-eval'` or permissive wildcards (`https:`, `data:`, `blob:`) to bypass asset loading errors. Always fix the underlying asset architecture.

## 3. Code Limits and Quality Audits
- Source files (`.js`, `.html`, `.css`) must not exceed **150 lines per file**.
- Always run and pass the project audit before committing changes:
  ```powershell
  powershell -ExecutionPolicy Bypass -File scripts\audit.ps1
  ```
- Any commit with failing audit or unaddressed root causes is strictly prohibited.

## 4. Root Cause Analysis (No Quick-Dirty Patches)
- Always investigate why an issue occurs before proposing or applying fixes.
- When an issue is reported (e.g. missing styles, broken transitions), analyze the entire deployment pipeline and environment (GitHub Pages, iframe, webviews).
