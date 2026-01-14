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

## Stretch task (S3)
- CI command: `npx nx affected -t lint,test,build --base=origin/main --head=HEAD`
- Package script: `npm run ci:affected`

CI run output:
```
> ci:affected
> nx affected -t lint,test,build --base=origin/main --head=HEAD

NX   Running targets lint, build for project my-react-app:
- my-react-app

> nx run my-react-app:lint
> my-react-app@0.0.0 lint
> eslint .

/Users/arthurblumberg/ZionetReactCourse/apps/my-react-app/src/pages/CheckInForm.tsx
  138:26  warning  Compilation Skipped: Use of incompatible library  react-hooks/incompatible-library

/Users/arthurblumberg/ZionetReactCourse/apps/my-react-app/src/pages/Products.tsx
  39:9  warning  The 'products' logical expression could make the dependencies of useMemo Hook (at line 47) change on every render. Move it inside the useMemo callback. Alternatively, wrap the initialization of 'products' in its own useMemo() Hook  react-hooks/exhaustive-deps

✖ 2 problems (0 errors, 2 warnings)

> nx run my-react-app:build
> my-react-app@0.0.0 build
> vite build

vite v7.3.1 building client environment for production...
transforming...
✓ 309 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                        0.46 kB │ gzip:   0.30 kB
dist/assets/primeicons-C6QP2o4f.woff2  35.15 kB
dist/assets/primeicons-MpK4pl85.ttf    84.98 kB
dist/assets/primeicons-WjwUDZjB.woff   85.06 kB
dist/assets/primeicons-DMOk5skT.eot    85.16 kB
dist/assets/primeicons-Dr5RGzOO.svg    342.53 kB │ gzip: 105.26 kB
dist/assets/index-dwtX_RbA.css         21.03 kB │ gzip:   5.28 kB
dist/assets/index-CMBSJaYt.js          854.07 kB │ gzip: 247.87 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 6.72s

NX   Successfully ran targets lint, build for project my-react-app
```

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
