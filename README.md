# Watermelon

A comprehensive polyglot microfrontend architecture monorepo federating and orchestrating **12 independent applications and packages** across three distinct integration paradigms: **Module Federation, W3C Web Components, and Sandboxed Iframes** — featuring bidirectional Shadow DOM style isolation, postMessage bridge communication, cross-framework navigation, and low-memory developer tooling.

---

## Why "Watermelon"

The color palette and visual identity are inspired by the watermelon fruit — crisp emerald greens (`#10b981`) for the host shell and accents, vibrant ruby reds and pinks (`#dd0031`, `#f43f5e`) for brand badges and Angular cheat sheet highlights, with deep obsidian dark mode surfaces (`#090d16`, `#0f172a`) and clean neutrals in both light and dark variants.

---

## Architecture Paradigms at a Glance

Watermelon serves as a production-grade blueprint comparing the three major microfrontend paradigms within a single unified host shell:

```
                                  ┌────────────────────────┐
                                  │  vite-hostapp (Port 5150)│
                                  │  Vue 3 + Pinia + Shell │
                                  └───────────┬────────────┘
                                              │
                      ┌───────────────────────┼───────────────────────┐
                      │                       │                       │
                      ▼                       ▼                       ▼
            [Module Federation]        [Web Components]        [Sandboxed Iframes]
            Shared JS Heap / ESM     Custom Element Boundary    Hardware Process Sandbox
            ────────────────────     ───────────────────────    ────────────────────────
            • Vite + React 19 (5251) • Angular 20 CE (4201)     • Vite React 19 (5300)
            • Vite + Vue 3.5  (5252) • Lit 3 CE      (5302)     • Next.js 16 App (5301)
            • Vite + Svelte 5 (5253) • Vue 3 CE      (5303)               │
            • Vite + SolidJS  (5254)                                      ▼
            • Webpack + React (5161)                           [@watermelon/bridge]
            • Webpack + Vue   (5162)                          Typed postMessage bus
```

### Architectural Paradigm Comparison Matrix

| Dimension | Module Federation | W3C Web Components | Sandboxed Iframes |
| :--- | :--- | :--- | :--- |
| **Primary Mechanism** | Runtime ESM / dynamic import | Custom Elements & Shadow DOM | Browser browsing context (`<iframe>`) |
| **Isolation Level** | Soft (shared window & JS heap) | Medium (DOM & CSS isolated, shared JS heap) | **Hard** (separate process, memory, & globals) |
| **CSS Encapsulation** | Head interception (`patchHeadToShadow`) | **Native Shadow Root** | **Native Window boundary** |
| **Cross-Boundary Comms** | Direct JS in-memory calls / store | Custom Events (`dispatchEvent` / `listen`) | **Typed postMessage (`@watermelon/bridge`)** |
| **Fault Tolerance** | Low (unhandled throw can impact shell) | Medium (element error contained, leaks memory) | **High** (crash isolated inside iframe sandbox) |
| **Startup / Latency** | **Fastest (~1.8 ms)** | Fast (~2.4 ms) | Moderate (~3.5–4.1 ms) |
| **Framework Support** | Requires bundler federation plugin | Any framework supporting Custom Elements | **Universal** (Next.js SSR/RSC, Nuxt, legacy, SPA) |
| **Deep Subrouting** | Basename handshake (`window.BASENAME`) | Basename injection (`APP_BASE_HREF`) | Completely isolated internal URL routing |

---

## Applications & Network Directory

All 11 applications run over local HTTPS with shared trusted certificates (`certs/localhost.pem` and `certs/localhost-key.pem` generated via `mkcert`):

| App Identifier | Directory | Port | Strategy | Framework & Bundler | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`host`** | `vite-hostapp` | `5150` | Host Orchestrator | Vue 3.5 + Vite 6 + PrimeVue | Global shell, navbar, theme sync, remote loader |
| **`v-react`** | `vite-remoteapp-1` | `5251` | Module Federation | React 19.1 + Vite 6 + Tailwind | Product showcase with interactive cart state |
| **`v-vue`** | `vite-remoteapp-2` | `5252` | Module Federation | Vue 3.5 + Vite 6 + PrimeVue | Subrouted dashboard with localized sub-navigation |
| **`v-svelte`** | `vite-remoteapp-3` | `5253` | Module Federation | Svelte 5.0 + Vite 6 | Compile-time rune reactivity & counter |
| **`v-solid`** | `vite-remoteapp-4` | `5254` | Module Federation | SolidJS 1.9 + Vite 6 | Fine-grained signals & DOM benchmarking |
| **`w-react`** | `webpack-remoteapp-1` | `5161` | Module Federation | React 19 + Webpack 5.98 | Vite-to-Webpack cross-bundler federation |
| **`w-vue`** | `webpack-remoteapp-2` | `5162` | Module Federation | Vue 3.5 + Webpack 5.98 + SCSS | Webpack 5 Vue 3 federated remote |
| **`angular`** | `angular-remoteapp` | `4201` | Web Component | Angular 20.3 + Zoneless Elements | 17-topic Angular developer cheat sheet |
| **`wc-lit`** | `wc-lit-app` | `5302` | Web Component | Lit 3.3 + Vite (Custom Element) | `<wm-notification-center>` notification inbox |
| **`wc-vue`** | `wc-vue-app` | `5303` | Web Component | Vue 3.5 `defineCustomElement` | `<wm-user-profile>` user card & status toggle |
| **`iframe-vite`** | `iframe-vite-app` | `5300` | Sandboxed Iframe | React 19 + Vite + Bridge | Asset / Media Manager with internal routing |
| **`iframe-nextjs`**| `iframe-nextjs-app` | `5301` | Sandboxed Iframe | Next.js 16 App Router + Turbopack | Analytics & Telemetry with SSR/SSG export |
| **`bridge`** | `packages/watermelon-bridge` | — | Shared Library | TypeScript (ESM + CJS) | Typed postMessage host/client bridge |

---

## Features & Core Mechanics

- **Universal Remote Adapter Pattern** — `RemoteWrapper.vue` delegates mounting and teardown to dedicated strategy adapters (`ModuleFederationAdapter`, `WebComponentAdapter`, `IframeAdapter`), maintaining zero file bloat.
- **Bidirectional Shadow DOM Style Isolation** — isolates remote components inside an open Shadow Root to eliminate CSS collisions between disparate styling libraries (Tailwind v4, PrimeVue, PrimeReact, PrimeNG, SCSS).
- **Runtime CSS Interception (`patchHeadToShadow`)** — monkey-patches `document.head` append methods to divert dynamically injected `<style>` and `<link>` tags into the active remote's Shadow DOM.
- **Module-Level CSS Cache** — persists captured styles across route changes in memory to avoid repetitive style reconstruction.
- **Universal Bridge Package (`@watermelon/bridge`)** — lightweight, zero-dependency typed postMessage communication bus handling handshake (`ready`), auto-height synchronization (`ResizeObserver`), host theme synchronization, and domain events (`ASSET_SELECTED`, `ANALYTICS_FILTER_CHANGED`).
- **Complete Blast Radius Containment** — unhandled exceptions inside sandboxed iframes are caught by internal error boundaries, leaving host shell navigation and active tabs completely unaffected.
- **Angular 20 Developer Cheat Sheet** — curated 17-topic standalone reference covering modern Control Flow (`@if`, `@for`, `@let`), Signals (`signal`, `computed`, `linkedSignal`, `resource`), Component I/O (`input`, `output`, `model`), and `@defer` views.
- **Dynamic Basename Subrouting** — host injects `window.BASENAME` to enable deep linking and nested subroutes inside embedded microfrontends.
- **Low-Memory Dev Strategies** — selective dev runner (`scripts/dev.sh`) and unified static remote server (`scripts/serve-remotes.mjs`) reducing RAM consumption from 4+ GB down to **~57 MB**.
- **End-to-End HTTPS** — all 11 applications serve over trusted local SSL certificates generated via `mkcert`.

---

## Getting Started

### 1. Prerequisites
- **Node.js**: `v24.15.0+` (managed via Volta or nvm)
- **mkcert**: Required for local trusted HTTPS certificates ([mkcert installation guide](https://github.com/FiloSottile/mkcert))

### 2. Initial Setup
Run the automated monorepo setup:
```bash
npm run setup
```
This installs dependencies across all packages, builds `@watermelon/bridge`, generates local SSL certificates in `certs/`, and sets up git validation hooks.

### 3. Development Workflows

#### Strategy A: Selective Live Dev Mode (Recommended — ~350–650 MB RAM)
Develop the host shell alongside only the specific remote you are working on:
```bash
npm run dev:angular         # Host (5150) + Angular 20 (4201)
npm run dev:react           # Host (5150) + Vite React (5251)
npm run dev:vue             # Host (5150) + Vite Vue (5252)
npm run dev:wc-lit          # Host (5150) + Lit Web Component (5302)
npm run dev:wc-vue          # Host (5150) + Vue Custom Element (5303)
npm run dev:iframe-vite     # Host (5150) + Vite Iframe (5300)
npm run dev:iframe-nextjs   # Host (5150) + Next.js Iframe (5301)
```
Or run `npm run dev` in an interactive terminal to choose from an interactive CLI menu.

#### Strategy B: Lightweight All-Remotes Mode (~57 MB RAM)
Runs the live host shell while serving all 10 remotes statically in a single Node.js process:
```bash
npm run build:all           # Build all applications once
npm run dev:host            # Launches unified static remotes (57 MB RAM) + live host (5150)
```

#### Strategy C: Full Concurrent Mode (High RAM ~3+ GB)
Launches all applications in preview/live mode concurrently:
```bash
npm run start:all
```

---

## Testing & Quality Assurance

```bash
# Monorepo-wide static type-checking (vue-tsc, tsc, svelte-check)
npm run check:all

# Production build across all 12 projects
npm run build:all

# Playwright end-to-end integration test suite
npm run test:e2e
```

---

## Repository Structure

```
Watermelon/
  certs/                       # Trusted local SSL certificates (localhost.pem, localhost-key.pem)
  e2e/                         # Playwright integration & federation test suite
  packages/
    watermelon-bridge/         # @watermelon/bridge typed postMessage communication bus
  scripts/                     # Automation scripts (dev.sh, build-all.sh, typecheck-all.sh, etc.)
  vite-hostapp/                # Vue 3 Host Shell (Port 5150)
    src/
      RemoteWrapper/           # Multi-paradigm mounting engine
        adapters/              # BaseAdapter, ModuleFederationAdapter, WebComponentAdapter, IframeAdapter
        shadow/                # Shadow DOM builder, patchHeadToShadow, CSS cache
      components/              # Home dashboard, side menu, navigation bar
      composables/             # Theme & UI state
  vite-remoteapp-1/            # React 19 Remote (Vite MF, Port 5251)
  vite-remoteapp-2/            # Vue 3.5 Remote (Vite MF, Port 5252)
  vite-remoteapp-3/            # Svelte 5 Remote (Vite MF, Port 5253)
  vite-remoteapp-4/            # SolidJS Remote (Vite MF, Port 5254)
  webpack-remoteapp-1/         # Webpack 5 + React 19 Remote (Port 5161)
  webpack-remoteapp-2/         # Webpack 5 + Vue 3.5 Remote (Port 5162)
  angular-remoteapp/           # Angular 20 Zoneless Cheat Sheet CE (Port 4201)
  wc-lit-app/                  # Lit 3 Notification Center CE (Port 5302)
  wc-vue-app/                  # Vue 3 Custom Element User Profile (Port 5303)
  iframe-vite-app/             # React 19 Asset Manager Iframe (Port 5300)
  iframe-nextjs-app/           # Next.js 16 App Router Analytics Iframe (Port 5301)
```

---

## Architecture Specifications

For detailed architectural diagrams, Shadow DOM CSS interception mechanics, lifecycle teardown, and federation constraints, see [SPEC.md](./SPEC.md).
