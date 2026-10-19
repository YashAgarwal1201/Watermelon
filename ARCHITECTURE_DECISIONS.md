# Architecture Decision Records (ADRs): Watermelon

This document captures the architectural decisions made during the design, expansion, and scaling of the Watermelon polyglot microfrontend platform.

---

## ADR-001: Three-Tier Microfrontend Taxonomy

### Status
Accepted

### Context
Enterprises typically have a heterogeneous application ecosystem. While Module Federation is popular for greenfield SPAs, legacy systems, SSR/RSC frameworks (Next.js, Nuxt), and reusable UI widget libraries cannot all run cleanly under client-side Module Federation. A single microfrontend paradigm cannot satisfy all requirements without awkward workarounds.

### Decision
Implement and demonstrate three distinct microfrontend tiers within a single host shell:
1. **Module Federation (Vite & Webpack 5)**: For highly integrated, client-rendered SPAs requiring in-memory execution and shared runtime dependencies.
2. **W3C Web Components (Angular 20, Lit 3, Vue 3 CE)**: For self-contained, framework-agnostic leaf components with native browser Shadow DOM encapsulation.
3. **Sandboxed Iframes (React 19 Vite, Next.js 16 App Router)**: For full-stack SSR/RSC applications, third-party code, and mission-critical workflows requiring hardware-level process isolation and fault containment.

### Consequences
* **Positive**: Full architectural coverage. Frameworks that do not support Module Federation (Next.js App Router, Angular Zoneless, Lit) can be cleanly integrated.
* **Trade-off**: Requires distinct host lifecycle handlers and communication protocols.

---

## ADR-002: Strategy Adapter Pattern in `RemoteWrapper.vue`

### Status
Accepted

### Context
Originally, `RemoteWrapper.vue` was a 564-line monolithic component containing mounting logic, CSS head-patching, and framework-specific teardown for React, Vue, Svelte, Solid, and Angular. Adding Lit, Vue Custom Elements, and Iframes directly would have blown the file past 1,000 lines, violating separation of concerns and maintainability.

### Decision
Refactor `RemoteWrapper.vue` into an **Adapter Pattern**:
* `BaseAdapter.ts`: Defines `RemoteAdapter` interface and `RemoteAdapterConfig`.
* `ModuleFederationAdapter.ts`: Encapsulates dynamic imports and framework mount/unmount calls.
* `WebComponentAdapter.ts`: Encapsulates Custom Element script injection, DOM instantiation, and event binding.
* `IframeAdapter.ts`: Encapsulates `<iframe>` lifecycle and `@watermelon/bridge` postMessage wiring.
* `shadow/`: Modularized `buildShadow.ts`, `patchHeadToShadow.ts`, and `cssCache.ts`.

### Consequences
* **Positive**: Reduced `RemoteWrapper.vue` from 564 lines to ~180 lines. Adding new remotes or strategies requires zero modifications to existing adapter code.
* **Trade-off**: Slight increase in the number of modular source files.

---

## ADR-003: Runtime Head-Patching for Shadow DOM CSS Encapsulation

### Status
Accepted

### Context
When remote microfrontends are loaded at runtime, bundlers (like Webpack's `style-loader` or runtime CSS injectors) append `<style>` and `<link>` tags directly to `document.head`. Because styles in `document.head` cannot pierce the Shadow DOM boundary, remotes appear completely unstyled.

### Decision
Implement `patchHeadToShadow` which monkey-patches DOM head insertion methods (`appendChild`, `insertBefore`, `append`, `prepend`, etc.) during the remote mount lifecycle. Injected style nodes are diverted into the active remote's Shadow Root. Intercepted styles are cached in a module-level `Map` (`cssCache`) to prevent repeated style refetching during navigation.

### Consequences
* **Positive**: Seamless styling isolation. Third-party UI libraries (Tailwind v4, PrimeVue, PrimeReact, PrimeNG) render correctly inside Shadow DOM without global CSS leakage.
* **Trade-off**: Requires careful restoration of original DOM head methods upon remote unmount to prevent memory leaks or unintended interception of host styles.

---

## ADR-004: Standalone Namespaced PostMessage Protocol (`@watermelon/bridge`)

### Status
Accepted

### Context
Iframes provide hard isolation but lack native coordination with the host shell. Ad-hoc `window.addEventListener("message", ...)` calls quickly become fragile, insecure, and prone to cross-talk from browser extensions or analytics scripts.

### Decision
Extract a zero-dependency, typed monorepo package `packages/watermelon-bridge` (`@watermelon/bridge`):
* Enforces a namespace guard (`__wm: true`) and matching `remoteId`.
* Provides structured lifecycle messages: `WM_READY`, `WM_RESIZE`, `WM_THEME`, `WM_NAVIGATE`, and `WM_EVENT`.
* Exposes `WatermelonBridgeHost` for the host and `WatermelonBridgeClient` for remotes.
* Implements automatic height syncing via `ResizeObserver` to eliminate nested iframe scrollbars.

### Consequences
* **Positive**: Typesafe, reusable protocol. Can be independently published or imported into any project.
* **Trade-off**: Requires iframe applications to include the bridge client package.

---

## ADR-005: Unified Single-Process Static Serving for Local Development

### Status
Accepted

### Context
Booting 11 separate development bundlers (Vite dev servers, Webpack watchers, Angular CLI, Next.js server) simultaneously requires over 5 GB of RAM, causing severe memory pressure and slow startup times on developer laptops.

### Decision
Implement a dual-track development workflow:
1. **`scripts/serve-remotes.mjs`**: A custom, zero-dependency Node.js HTTPS server that serves all prebuilt remote bundles (`dist/` and `out/`) concurrently on their dedicated ports (`5251-5254`, `5161-5162`, `4201`, `5300-5303`) within a **single Node.js process using ~57 MB of RAM**.
2. **Selective Dev Runner (`scripts/dev.sh`)**: Runs only the target remote being edited in live HMR mode while serving all other remotes statically.

### Consequences
* **Positive**: RAM usage drops by 90% (from ~5 GB to ~350 MB in selective dev mode, or ~57 MB in static host mode). Instant startup with zero port conflicts.
* **Trade-off**: Requires running `npm run build:all` once before using static mode.

---

## ADR-006: Next.js App Router Static Export & CSP `frame-ancestors`

### Status
Accepted

### Context
Next.js 16 applications by default run as Node.js servers. Furthermore, modern browsers block cross-origin framing if legacy `X-Frame-Options: DENY` or `SAMEORIGIN` headers are set.

### Decision
1. Configure Next.js with `output: "export"` in `next.config.ts`, generating pure static HTML/JS/CSS assets into `out/`. This allows Next.js to be served statically by `serve-remotes.mjs` with zero runtime Node overhead.
2. Replace `X-Frame-Options` with standard modern CSP: `Content-Security-Policy: frame-ancestors 'self' https://localhost:5150 https://localhost:5173 *` in server configs to permit secure host embedding while preventing clickjacking from unauthorized origins.

### Consequences
* **Positive**: Next.js runs seamlessly within the unified static server and supports instant static previewing.
* **Trade-off**: Dynamic server-side runtime features (e.g. `cookies()`, dynamic SSR headers) are compiled at build time for the export artifact.
