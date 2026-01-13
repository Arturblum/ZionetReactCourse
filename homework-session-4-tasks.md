# Homework - Session 4 Tasks (Nx Monorepo & Capstone Polish)

## Part A - Nx migration deliverable (required)
- Create branch `nx-migration`.
- Initialize Nx in repo: `npx nx@latest init`.
- Verify Nx works:
  - `npx nx show projects` prints project(s).
  - `npx nx serve <your-app>` runs app.
  - `npx nx graph` opens project graph.

### A2) Create libs and move real code
- Create libs:
  - `libs/ui`
  - `libs/hooks`
  - `libs/i18n`
- Move code into libs:
  - UI: Toaster, GlobalLoader, plus 1 more shared UI component.
  - Hooks: all TanStack Query hooks (list/detail/infinite + mutations).
  - i18n: i18next init + LanguageSwitcher helpers / `isRtlLang`.
- Update imports to use aliases (e.g., `@my-app/ui`, `@my-app/hooks`, `@my-app/i18n`).
- Verify app still runs with `npx nx serve <app>`.

### A3) Enforce architecture with Nx module boundaries
- Enable `@nx/enforce-module-boundaries`.
- Add tags/constraints (simple policy):
  - `type:ui` can depend on `type:hooks` and `type:i18n`.
  - `type:hooks` cannot depend on `type:ui`.
  - Apps can depend on all libs.
  - Libs cannot import from apps.
- Prove it works:
  - Intentionally break a rule -> lint fails.
  - Fix it -> lint passes.

### A4) Prove you understand "affected"
- Change only `libs/ui` (e.g., CSS class or label).
- Run: `npx nx affected -t lint,build,test`.
- Run: `npx nx print-affected -t build`.
- Save console output to paste into README.

## Part B - Capstone polish (required)
- Write concise README (max ~60 lines) including:
  - How to run: serve, build, lint, test.
  - Workspace structure: apps + libs (1-2 lines each).
  - Architecture rules summary (module boundaries).
  - Affected demo output from Part A4.

## Stretch tasks (pick 1)
- S1) Nx speed script + caching proof:
  - Add scripts:
    - `lint:all` -> `nx run-many -t lint --all`
    - `check:affected` -> `nx affected -t lint,test,build`
  - Show two consecutive builds and note second run is cached/faster.
- S2) Add optional Next.js app:
  - Create `apps/next-app` and reuse at least one lib (e.g., `libs/i18n` or small UI component).
- S3) CI-friendly command:
  - Document: `nx affected -t lint,test,build --base=origin/main --head=HEAD`.

## Submission checklist
- Repo link.
- README with required sections + affected output pasted.
- Optional screenshots of `nx graph` and folder structure.
