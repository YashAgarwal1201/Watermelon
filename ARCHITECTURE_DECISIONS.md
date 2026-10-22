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

---

## ADR-007: Origin Whitelisting and Frame Sandbox Hardening

### Status
Accepted

### Context
`postMessage` listeners that do not validate `event.origin` and `event.source` are vulnerable to message spoofing from malicious tabs, browser extensions, or third-party scripts. Furthermore, framing iframes without explicit `sandbox` attributes allows remotes unrestricted access to top-level navigation, modals, and plugins.

### Decision
1. In `@watermelon/bridge` (`host.ts`), add `allowedOrigins` configuration. Check both `allowedOrigins.includes(event.origin)` and verify `event.source === this.iframe.contentWindow`. Reject and discard all unauthorized postMessage events.
2. In `IframeAdapter.ts`, configure `sandbox="allow-scripts allow-same-origin allow-forms allow-popups"` on created iframe elements to enforce the principle of least privilege.

### Consequences
* **Positive**: Complete defense against cross-origin postMessage spoofing and unauthorized iframe escalation.
* **Trade-off**: Requires parent host shell to explicitly specify remote origins.

---

## ADR-008: Blast Radius Containment via Dynamic Error Boundaries & Mount Circuit Breakers

### Status
Accepted

### Context
In Module Federation, remotes execute in the same JavaScript thread and heap as the host shell. An uncaught rendering error in a remote React or Vue component unmounts the host component tree, producing a blank screen. Additionally, if a remote bundle network request hangs indefinitely, the host shell gets stuck in a perpetual loading state.

### Decision
1. In `ModuleFederationAdapter.ts`, wrap React remotes in a dynamically constructed `ErrorBoundary` component that renders a localized fallback UI with a retry action.
2. Configure `app.config.errorHandler` on Vue remote applications to catch unhandled errors inside the remote.
3. In `RemoteWrapper.vue`, wrap adapter mount execution in a 10-second `Promise.race` timeout circuit breaker. If the remote fails to mount within 10 seconds, the promise rejects and renders a clean offline recovery screen with CLI troubleshooting commands.

### Consequences
* **Positive**: Eliminates single points of failure. Remote runtime crashes are trapped within their container; the host shell remains fully interactive.
* **Trade-off**: Slightly more verbose mounting pipeline in `ModuleFederationAdapter`.

---

## ADR-009: Decoupled Cross-Paradigm Resilient Event Bus

### Status
Accepted

### Context
Microfrontends running across three distinct paradigms (Module Federation in-memory, Web Components in Shadow DOM, and Iframes in sandboxed browsing contexts) require coordinated state (e.g. dark/light theme shifts, user session invalidation, badge notifications). Directly coupling the host to each paradigm's communication mechanism creates an unmaintainable web of dependencies.

### Decision
Implement a central `EventBus` singleton (`src/services/eventBus.ts`):
1. In-memory pub/sub (`on`, `off`, `emit`, `clear`) with defensive `try/catch` execution of handlers.
2. Dual dispatch: every `eventBus.emit(event, payload)` automatically fires `window.dispatchEvent(new CustomEvent(event, { detail: payload }))` for framework-agnostic browser-level interoperability.
3. Adapters bridge to their respective paradigm:
   * `IframeAdapter` pushes `wm:theme` and `wm:auth` over `@watermelon/bridge`.
   * `WebComponentAdapter` reflects `theme` attribute updates and forwards `wm-signout` and `wm-badge-count` onto `eventBus`.
   * `ModuleFederationAdapter` injects `eventBus` into remote component props and Vue provide contexts.

### Consequences
* **Positive**: Unified cross-paradigm state propagation without tight coupling. Any remote can emit or listen to events regardless of its integration paradigm.
* **Trade-off**: Developers must adhere to semantic event names (`wm:*`).

---

## ADR-010: Standardized Remote Contract (`StandardRemoteLifecycle`)

### Status
Accepted

### Context
Different microfrontends historically exported varying interfaces: some exported standard `mount(el, options)` and `unmount()` functions, while others exported bare components (React default export, Svelte class, Solid function). The host had to maintain bespoke mounting blocks for each remote.

### Decision
Define `StandardRemoteLifecycle` and `RemoteMountOptions` in `BaseAdapter.ts`:
```typescript
export interface RemoteMountOptions {
  basename: string;
  memory?: boolean;
  eventBus?: EventBus;
  [key: string]: any;
}

export interface StandardRemoteLifecycle {
  mount(element: HTMLElement, options?: RemoteMountOptions): Promise<any> | any;
  unmount?(): Promise<void> | void;
}
```
In `ModuleFederationAdapter.ts`, standardize the mount lifecycle dispatcher so that if a remote exports `mount`/`unmount`, it executes it directly. A dynamic federation fallback handles any third-party remote implementing this contract.

### Consequences
* **Positive**: Clean polymorphic interface with backward-compatible framework fallbacks.
* **Trade-off**: Remotes must agree on the `RemoteMountOptions` argument format.
