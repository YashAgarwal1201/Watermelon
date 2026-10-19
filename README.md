# Watermelon — Microfrontend Architecture Playground

A polyglot microfrontend playground demonstrating multiple federation strategies and framework integrations under one monorepo. The Vue 3 host shell seamlessly embeds and orchestrates remote applications built with **React 19**, **Vue 3**, **Svelte 5**, **SolidJS**, and **Angular 20** — each leveraging different bundlers, build tools, and integration patterns.

---

## Architecture Overview

```
                               ┌─────────────────────────────────┐
                               │           vite-hostapp          │
                               │      (Vue 3 + PrimeVue 4)       │
                               │           Port: 5150            │
                               └───────┬─────────────┬───────────┘
                                       │             │
                ┌──────────────────────┴────────┐    │ (Web Component)
                │      Module Federation        │    ▼
                ▼                               ▼ ┌─────────────────────┐
  ┌───────────────────────────┐   ┌─────────────┐ │  angular-remoteapp  │
  │     Vite Remotes (ESM)    │   │   Webpack   │ │    (Angular 20)     │
  ├───────────────────────────┤   ├─────────────┤ │     Port: 4201      │
  │ vite-remoteapp-1 (React)  │   │ webpack-1   │ └─────────────────────┘
  │ vite-remoteapp-2 (Vue 3)  │   │  (React 19) │
  │ vite-remoteapp-3 (Svelte) │   │ webpack-2   │
  │ vite-remoteapp-4 (SolidJS)│   │   (Vue 3)   │
  └───────────────────────────┘   └─────────────┘
```

### Integration Strategies

1. **Vite Module Federation (Native ESM)**:
   - Uses `@originjs/vite-plugin-federation` to expose dynamic ESM remotes.
   - Unified `vite.config.ts` handles both standalone dev (`server`) and federated remote preview (`preview`) without requiring separate configuration files.
   - Built-in CSS injection plugins (`injectCssIntoJs` and `cssInjectedByJsPlugin`) bundle component styles directly into the JS entry chunks, preventing style bleed or loss during host client-side route transitions.

2. **Webpack 5 Module Federation (`var` library target)**:
   - Uses Webpack 5's native `ModuleFederationPlugin` with a global `var` container format for maximum cross-bundler compatibility with Vite host consumers.
   - Runs on independent Webpack dev servers (`:5161` and `:5162`).

3. **Angular Custom Elements (Web Components)**:
   - Built with Angular 20 and `@angular/elements`.
   - Bootstrapped as custom HTML elements (`<app-angular-remote></app-angular-remote>`) that the Vue 3 host renders inside dynamic mounting wrappers.

---

## Apps, Frameworks & Ports

| Application | Framework | Bundler | Port | Federation / Integration | Stored In |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **`vite-hostapp`** | Vue 3 + Pinia | Vite 7 | `5150` | Host Shell / Consumer | [`vite-hostapp/`](./vite-hostapp) |
| **`vite-remoteapp-1`** | React 19 + PrimeReact | Vite 7 | `5251` | Vite MF (`./ViteReactRemoteComponent`) | [`vite-remoteapp-1/`](./vite-remoteapp-1) |
| **`vite-remoteapp-2`** | Vue 3 + PrimeVue | Vite 7 | `5252` | Vite MF (`./ViteVueRemoteComponent`) | [`vite-remoteapp-2/`](./vite-remoteapp-2) |
| **`vite-remoteapp-3`** | Svelte 5 | Vite 7 | `5253` | Vite MF (`./ViteSvelteRemoteComponent`) | [`vite-remoteapp-3/`](./vite-remoteapp-3) |
| **`vite-remoteapp-4`** | SolidJS | Vite 7 | `5254` | Vite MF (`./ViteSolidRemoteComponent`) | [`vite-remoteapp-4/`](./vite-remoteapp-4) |
| **`webpack-remoteapp-1`** | React 19 | Webpack 5 | `5161` | Webpack MF (`./WebpackReactRemoteComponent`) | [`webpack-remoteapp-1/`](./webpack-remoteapp-1) |
| **`webpack-remoteapp-2`** | Vue 3 | Webpack 5 | `5162` | Webpack MF (`./WebpackVueRemoteComponent`) | [`webpack-remoteapp-2/`](./webpack-remoteapp-2) |
| **`angular-remoteapp`** | Angular 20 + PrimeNG | Angular CLI | `4201` | Angular Elements Web Component | [`angular-remoteapp/`](./angular-remoteapp) |

---

## Getting Started

### ⚡ One-Step Automated Setup

To install all dependencies, generate trusted local HTTPS certificates (`mkcert`), and configure Git validation hooks:

```sh
npm run setup
```

*(Alternatively, run `bash scripts/setup.sh`).*

---

## Running the Federation System

### Option A — Selective Development Runner (Recommended, Low Memory)

Instead of running 8 heavy bundlers and compilers simultaneously (which requires 3+ GB RAM), develop only the application you are actively editing while serving the remaining remotes statically from a **single ultra-lightweight process (~40 MB RAM)**:

```sh
npm run dev
```

This opens an interactive menu:
```
🍉 Watermelon Microfrontends — Selective Development Runner
  [1] Host Shell Only      (All 7 remotes static)    ~200 MB RAM
  [2] Angular Remote       (Host + Angular live)     ~650 MB RAM
  [3] Vite React Remote    (Host + React live)       ~350 MB RAM
  [4] Vite Vue Remote      (Host + Vue live)         ~350 MB RAM
  [5] Vite Svelte Remote   (Host + Svelte live)      ~350 MB RAM
  [6] Vite Solid Remote    (Host + Solid live)       ~350 MB RAM
  [7] Webpack React Remote (Host + W-React live)     ~500 MB RAM
  [8] Webpack Vue Remote   (Host + W-Vue live)       ~500 MB RAM
  [9] ALL 8 Live Bundlers  (Heavy full stack mode)   ~2.5 GB RAM
```

#### Dedicated Direct Commands:
```sh
npm run dev:host           # Develop host app with all 7 remotes served statically (~200 MB RAM)
npm run dev:angular        # Live Angular 20 development + Host (~650 MB RAM)
npm run dev:react          # Live React 19 development + Host (~350 MB RAM)
npm run dev:vue            # Live Vue 3 remote + Host (~350 MB RAM)
npm run dev:svelte         # Live Svelte 5 remote + Host (~350 MB RAM)
npm run dev:solid          # Live SolidJS remote + Host (~350 MB RAM)
npm run dev:webpack-react  # Live Webpack React + Host (~500 MB RAM)
npm run dev:webpack-vue    # Live Webpack Vue + Host (~500 MB RAM)
```

---

### Option B — Serve All Prebuilt Remotes Statically (Zero Watchers)

If you just want all 7 remotes available on their respective ports (`5251`, `5252`, `5253`, `5254`, `5161`, `5162`, `4201`) without running 7 separate Node processes:

```sh
npm run serve:remotes
```

- Replaces 7 separate Node.js dev/preview servers with **1 single Node.js process**.
- Serves all 7 remotes over HTTPS with proper CORS headers in **~45 MB total RAM** (98% reduction from 2.5 GB).

---

### Option C — Launch All 8 Applications Together (Full-Stack Live Mode)

If you have a machine with 16GB+ RAM and need live compilers running for every application concurrently:

```sh
npm run start:all
# or
npm run dev:all
```

- Sequentially verifies prebuilt bundles before launching to prevent initial CPU compile storms.
- Starts host shell (`vite-hostapp`) and all 7 remotes concurrently over HTTPS.
- Pressing `Ctrl+C` cleanly shuts down all applications without leaving orphaned processes.

Then open **`https://localhost:5150`** in your browser.

---

## Monorepo Orchestration Scripts

| Command | Script | Description |
| :--- | :--- | :--- |
| `npm run dev` | `scripts/dev.sh` | Interactive selective development runner (70–90% RAM reduction) |
| `npm run dev:angular` | `scripts/dev.sh --remote=angular` | Host + live Angular 20 cheat sheet, other remotes static |
| `npm run serve:remotes` | `scripts/serve-remotes.mjs` | Unified static HTTPS server for all 7 remotes (~45 MB RAM) |
| `npm run start:all` | `scripts/start-all.sh` | Concurrently boots host shell and all 7 remotes over HTTPS |
| `npm run build:all` | `scripts/build-all.sh` | Builds all 8 applications for production sequentially |
| `npm run check:all` | `scripts/typecheck-all.sh` | Runs static typechecks across all 8 applications |
| `npm run clean:all` | `scripts/clean-all.sh` | Removes `dist/`, `.angular/`, and build artifacts across all apps |
| `npm run kill:ports` | `scripts/kill-ports.sh` | Frees all 8 application ports if held by lingering processes |
| `npm run generate-certs` | `scripts/generate-certs.sh` | Generates local mkcert SSL certificates in `certs/` |
| `npm run setup-hooks` | `scripts/setup-hooks.sh` | Configures local git pre-push validation hook |
| `npm run test:e2e` | `playwright test` | Runs automated E2E integration tests against host shell and all 7 remotes |

---

## Memory Footprint & Architecture

Running multiple independent bundlers and servers in a polyglot microfrontend monorepo is one of the heaviest workloads a local development environment can encounter.

### The Memory Problem in Microfrontends
When running in monolithic "all live" mode, the local machine runs:
- 1 Vite Vue host instance
- 4 Vite preview / dev servers
- 2 Webpack 5 dev servers with in-memory ASTs, Babel transpilers, and module graphs
- 1 Angular CLI dev server with esbuild + Angular AOT compiler

This creates **8 separate Node runtimes**, easily exceeding **2.5–3.5 GB of RAM** and spiking CPU during parallel startup compilations, leading to OS swap thrashing and desktop lag.

### The Solution: Targeted Development
1. **Unified Multiplexed Static Server (`scripts/serve-remotes.mjs`)**:
   Instead of launching 7 separate Node runtimes for remotes that are not currently being edited, a single Node process serves all prebuilt `dist/` folders across ports `5251`, `5252`, `5253`, `5254`, `5161`, `5162`, and `4201`.
   **Memory drops from ~2,500 MB to ~45 MB.**

2. **Selective Dev Runner (`scripts/dev.sh`)**:
   Leaves the designated port open for the remote being actively developed, connecting it to live HMR while serving the rest statically.
   **Total active RAM drops to ~350 MB – 650 MB.**

3. **Graceful Host Fallback**:
   If a remote is offline or unreachable, `RemoteWrapper.vue` displays an informative card with the exact CLI command to start that remote, rather than crashing.

---

## Standalone Development (Isolated HMR)

To develop or debug any **Vite remote** in isolation as a standalone SPA with fast unbundled HMR:

```sh
cd vite-remoteapp-N && npm run dev
```

- Runs on the app's designated port (`5251`, `5252`, `5253`, `5254`) using the unified [`vite.config.ts`](file:///home/yash-agarwal/Watermelon/vite-remoteapp-1/vite.config.ts).
- Automatically sets local fallback routing without requiring host context.
- Use `npm start` (`build` + `preview`) whenever integrating with the host shell.

---

## Git Pre-Push Guard

To ensure code health before any commit is pushed to the remote repository, a pre-push guard validates types, linting, and production builds across all 8 apps.

### Installing the Hook Locally

```sh
bash scripts/setup-hooks.sh
```

### What Runs on `git push`

The hook executes a 3-phase fail-fast verification:
1. **Static Type Checking (All 8 apps)**: `vue-tsc -b`, `tsc -b`, and `svelte-check`.
2. **Linting**: ESLint checks on configured workspaces.
3. **Production Builds (All 8 apps)**: Verifies that Rollup, Webpack, and Angular CLI generate all bundles and `remoteEntry.js` contracts with exit code `0`.

To run the verification manually at any time:
```sh
./scripts/git-hooks/pre-push
```

---

## Monorepo Tech Stack

- **Host Framework**: Vue 3, Vue Router, Pinia, PrimeVue 4, Tailwind CSS v4
- **Remote Frameworks**: React 19, Vue 3, Svelte 5, SolidJS, Angular 20
- **Build Tools**: Vite 7, Webpack 5, Angular CLI (esbuild + Karma)
- **Federation Libraries**: `@originjs/vite-plugin-federation`, Webpack `ModuleFederationPlugin`, `@angular/elements`
- **Styling**: Tailwind CSS v4, PostCSS, PrimeFlex, PrimeIcons
- **TypeScript**: Strict typechecking across all sub-applications
- **Runtime**: Node.js `>= 24.15.0` (managed via Volta)
