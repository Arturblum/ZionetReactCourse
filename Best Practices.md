# Best Practices (From Review Comments + Changes Applied)

This document captures the review feedback from screenshots and the improvements we applied across the project.

## Component Style
- Prefer arrow function components with named exports when consistent with team style (e.g., `export const Component = () => { ... }`).
- Keep component files focused on rendering and UI responsibilities.

## Folder Structure
- Separate responsibilities into clear top-level folders:
  - `contexts/` for React context objects and hooks (no provider logic inside).
  - `providers/` for provider components (wrapping contexts and logic).
  - `components/` for reusable UI components.
  - `pages/` for route-level screens.
  - `stores/` for global state (Zustand) with minimal, focused modules.
  - `types/` for shared types used in multiple places.
  - `i18n/` for localization setup, with `locales/` holding per-language JSON files.

## Contexts vs Providers
- Keep context definitions (types, context object, `useX` hook) in `contexts/`.
- Keep provider logic in `providers/` so it is easy to find and reuse.
- Avoid mixing provider logic inside context files.
- Use dedicated providers for cross-cutting app concerns (e.g., i18n, theming), and wrap `App` in `main.tsx`.

## Types and Reuse
- Move shared types to a `types/` folder when they are reused across modules.
- Export shared types from `types/index.ts` to simplify imports.

## Barrel Exports (index.ts)
- Add `index.ts` in each major folder (`api`, `components`, `contexts`, `hooks`, `pages`, `providers`, `stores`, `types`).
- Prefer imports like `from '../api'` or `from '../stores'` instead of deep paths.

## Imports Hygiene
- Combine imports from the same module into a single line when possible.
- Keep import paths stable via barrels to avoid churn when moving files.

## Lint and React Hooks
- Avoid setting state inside `useEffect` when it can be derived from existing state.
- Keep effect dependency arrays accurate (include all referenced values like `id`).
- Use `_param` naming for unused function arguments when needed.

## UI Layout
- Give large tables a fixed height with internal scrolling to avoid full-page scroll bloat.

## Build Artifacts
- Remove compiled output folders (`dist`, `build`) when asked to keep the repo clean.

## Project-Specific Changes Applied
- Moved cart context to `src/contexts` and provider logic to `src/providers`.
- Moved cart sidebar and toast host to `src/components`.
- Moved route components into `src/pages`.
- Added `src/types` and moved shared types there.
- Added barrel exports across major folders and updated imports accordingly.
- Consolidated notifications imports and resolved unused parameter lint.
- Fixed lint issues related to `useEffect` setState and missing hook dependencies.

## Suggested Ongoing Practice
- Keep feature changes aligned with the folder conventions above.
- Prefer barrels for imports and place new shared types into `src/types`.
- Run `npm run lint` and `npm run build` before finalizing changes.
