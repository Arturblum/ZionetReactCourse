# Homework - Session 4 (Nx Monorepo & Capstone Polish)

## How to run
- Serve: `npx nx serve my-react-app`
- Build: `npx nx build my-react-app`
- Lint: `npx nx lint my-react-app`
- Test: `npx nx test my-react-app` (no unit tests configured yet)

## Workspace structure
- `apps/`: application entrypoints (Vite app lives in `apps/my-react-app`)
- `libs/`: shared code
  - `libs/ui`: shared UI components (Toasts, CartSidebar, GlobalLoader)
  - `libs/hooks`: TanStack Query hooks + shared stores/types
  - `libs/i18n`: i18next init + language helpers

## Architecture rules (module boundaries)
- Apps can depend on all libs.
- `type:ui` can depend on `type:hooks` and `type:i18n`.
- `type:hooks` cannot depend on `type:ui`.
- Libs cannot import from apps.

## Affected demo (Part A4)
Change made only in `libs/ui`, then:

```
npx nx affected -t lint,build,test

NX   Affected criteria defaulted to --base=main --head=HEAD

NX   Running targets lint, build for project my-react-app:
- my-react-app

> nx run my-react-app:lint
> my-react-app@0.0.0 lint
> eslint .

/Users/arthurblumberg/ZionetReactCourse/apps/my-react-app/src/pages/CheckInForm.tsx
  138:26  warning  Compilation Skipped: Use of incompatible library  react-hooks/incompatible-library

/Users/arthurblumberg/ZionetReactCourse/apps/my-react-app/src/pages/Products.tsx
  39:9  warning  The 'products' logical expression could make the dependencies of useMemo Hook (at line 47) change on every render.  react-hooks/exhaustive-deps

✖ 2 problems (0 errors, 2 warnings)

> nx run my-react-app:build
> my-react-app@0.0.0 build
> vite build
...
✓ built in 6.31s

NX   Successfully ran targets lint, build for project my-react-app
```

Nx 22 replacement for `print-affected`:
```
npx nx show projects --affected --with-target build
my-react-app
```
