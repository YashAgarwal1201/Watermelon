# Watermelon: Microfrontend Architecture — Expanded Scope Case Study

**Document Type**: Research & Record-Keeping  
**Status**: Draft for Review  
**Scope**: Module Federation (Done) → Web Components → Iframes & Fullstack Remotes  

---

## 1. Positioning Statement (Revised)

Watermelon is a **Microfrontend Architecture Proof-of-Concept Lab** — a working reference monorepo that demonstrates, benchmarks, and compares the three canonical integration paradigms for composing independent applications into a unified host shell:

| Paradigm | Status in Watermelon |
| :--- | :--- |
| **Module Federation** (Vite ESM + Webpack Var) | ✅ Done — 6 remotes working |
| **Web Components** (W3C Custom Elements + Shadow DOM) | 🟡 Partially Done — Angular 20 remote |
| **Iframes** (Sandboxed Fullstack Remotes) | 🔴 Proposed — Not yet implemented |

> **Goal of this document**: Exhaustively map what _can_ and _cannot_ be achieved with each paradigm, survey how production companies solve the hard problems, and produce a clear implementation plan for expanding Watermelon's scope.

---

## 2. The Three Paradigms in Depth

---

### 2.1 Module Federation (Webpack 5 & Vite Plugin)

**Implemented as**: Dynamic ESM `import()` of remote chunk files at runtime, enabling shared vendor singleton resolution across separately deployed apps.

#### ✅ What Can Be Achieved

| Capability | How It Works |
| :--- | :--- |
| **Shared vendor singletons** | React, Vue, etc. declared as `shared: { react: { singleton: true } }` loads one instance across host + remotes. |
| **Live HMR across boundaries** | In dev mode, changes in remotes hot-reload inside the host without full page refresh. |
| **Zero `<iframe>` overhead** | Remotes mount as native DOM nodes inside the host's virtual DOM — fastest possible rendering. |
| **Lazy code splitting** | Remote chunks fetched only when the user navigates to that section — true on-demand loading. |
| **Prop & callback passing** | Direct JavaScript objects, functions, and reactive signals can be passed between host and remotes. |
| **Direct router integration** | Remote Vue/React apps can receive and observe `basename` to participate in the host's URL structure. |
| **Cross-framework shared state** | Through window globals, custom events, or a SharedWorker, remotes can share state primitives. |

#### ❌ What Cannot (Easily) Be Achieved

| Limitation | Explanation |
| :--- | :--- |
| **Full-stack SSR Remotes** | Next.js App Router / Nuxt 3 Nitro generate server-dependent code (RSC, Server Actions). Their output cannot be shipped as a simple `remoteEntry.js` because there is no Node.js runtime in the browser to execute server components. |
| **Crash isolation** | One uncaught runtime error in any remote propagates up and can crash the entire host page. No hard process boundary exists. |
| **Version mismatch resilience** | If a shared singleton has a version mismatch (e.g. host uses React 19.0, remote expects 18.3), federation falls back to loading two copies silently, breaking shared hooks and context. |
| **Bundler lock-in** | The Vite ESM federation format and Webpack Var format are not natively interoperable — the host needs separate adapter config (`format: "var"`) for each. |
| **Independent deployability (fully)** | Remotes and the host must be compatible versions at the time of user visit — a mismatch between a just-deployed remote and a cached host shell can produce a runtime error. |
| **Integrating legacy apps** | A jQuery-, Backbone-, or Ember-based legacy app cannot expose a meaningful `remoteEntry.js`. |

#### 🏢 How Companies Use It
- **Zara / Inditex**: Split their e-commerce monolith into Vite MF remotes — product pages, cart, checkout each as separate deployed units.
- **Shopify Admin (formerly)**: Used Webpack 5 MF to isolate plugin surfaces while sharing React.
- **ByteDance (TikTok Ads Manager)**: Large internal tooling platform with 40+ micro-apps using Webpack MF shared singletons.

---

### 2.2 Web Components (W3C Custom Elements + Shadow DOM)

**Implemented as**: A framework compiles its root component into a browser-registered Custom Element (`customElements.define('tag-name', ...)`), which the host can instantiate with a plain `document.createElement('tag-name')` — no bundler coupling needed.

**Current state in Watermelon**: Angular 20 via `@angular/elements`, loaded dynamically via `<script type="module">` injection and mounted inside a Shadow Root managed by `RemoteWrapper.vue`.

#### ✅ What Can Be Achieved

| Capability | How It Works |
| :--- | :--- |
| **Absolute bundler independence** | The host doesn't care whether the remote was built by Angular CLI, Vite, Parcel, or plain `<script>` — it only consumes a registered HTML element. |
| **Native Shadow DOM CSS encapsulation** | Each custom element's Shadow Root provides hard CSS scoping — the remote's styles cannot bleed into the host, and the host cannot accidentally override the remote's styling. |
| **Framework-agnostic contract** | A Vue 3 host can consume a Svelte-compiled Web Component, an Angular 20 Web Component, or one built in Lit — all via the same `<my-element>` HTML tag. |
| **HTML attribute & property API** | Communication is standardized: attributes for primitives (strings, booleans) and element properties for complex data (objects, arrays) — no proprietary federation config. |
| **Custom Event bus** | Remotes fire `new CustomEvent('event-name', { detail, bubbles, composed: true })`. The `composed: true` flag allows events to cross the Shadow DOM boundary back into the host's event listeners. |
| **Reusability outside host shell** | The same `<angular-remote-app>` custom element can be dropped into any HTML page anywhere — it is a portable unit independent of Vue or Watermelon. |
| **Standalone access** | Visiting `https://localhost:4201` directly bootstraps the same app in standalone mode with full routing. The element tag is just one consumption mode. |

#### 🟡 Partially Achieved in Watermelon (Current Angular Remote)
- ✅ Shadow DOM style isolation with `patchHeadToShadow`.
- ✅ Module-level `cssCache` for navigation style persistence.
- ✅ `window.BASENAME` subrouting handshake.
- 🔴 **Missing**: Bidirectional Custom Event communication (remote → host notifications).
- 🔴 **Missing**: Attribute/property API for host-to-remote data passing (theme tokens, user session).
- 🔴 **Missing**: Declarative slot projection across shadow boundaries.

#### ❌ What Cannot (Easily) Be Achieved

| Limitation | Explanation |
| :--- | :--- |
| **Deep `provide`/`inject` or React Context sharing** | Shadow DOM is a hard boundary. Host's Vue `provide()` cannot be consumed by Angular inside the shadow root. Custom Events or a shared global bus must be used instead. |
| **Server-Side Rendering** | Custom Elements with Shadow DOM currently have limited SSR support. Declarative Shadow DOM (DSD) is the emerging standard, but browser adoption is still maturing and requires explicit framework support. |
| **Streaming and Suspense** | React 18's streaming SSR Suspense boundaries and RSC cannot be exposed via the Custom Element API — they require the server response stream itself. |
| **Direct reactive state subscription** | You cannot pass a Vue `ref()` or a React state setter directly as an element property — you must serialize/deserialize via events or shared global state. |
| **Synchronous render output** | Because `connectedCallback` is async, the element renders with a small initial blank period — not suitable for above-the-fold CLS-sensitive content. |

#### 🔧 Extending Web Components in Watermelon

To properly complete the Web Component paradigm, Watermelon should add:

1. **A dedicated non-Angular Web Component remote** (e.g., a Lit-based component or a Svelte 5 compiled custom element) to show framework-agnostic portability.
2. **A Custom Event Communication Bridge** in `RemoteWrapper.vue`:
   ```typescript
   // Host listens to composed events from shadow root
   hostContainer.value?.addEventListener('remote-navigate', (e: CustomEvent) => {
     router.push(e.detail.path);
   });
   ```
3. **Attribute-based host-to-remote theming**:
   ```typescript
   el.setAttribute('theme', currentTheme.value); // Angular reads this in ngOnChanges
   ```

---

### 2.3 Iframes (Sandboxed Execution Contexts)

**Not yet implemented in Watermelon.**

**Core concept**: The host renders `<iframe src="https://remote-app.example.com">` — the remote runs in a completely isolated browser context (separate window, separate JavaScript heap, separate DOM, separate cookies/storage).

#### ✅ What Can Be Achieved

| Capability | How It Works |
| :--- | :--- |
| **Full-stack SSR/SSG Remote Integration** | A Next.js App Router app, a Nuxt 3 Nitro app, a Remix app, or a Ruby on Rails view can all be embedded as iframes — the host doesn't care about the technology stack on the other side. |
| **Hard crash isolation** | If the remote's JavaScript throws a fatal error, it crashes only inside the iframe's isolated context. The host shell and other remotes remain unaffected. |
| **Complete memory isolation** | Each iframe has its own JavaScript heap, garbage collector, and memory budget. Memory leaks inside an iframe cannot bleed into the host's memory pool. |
| **Independent authentication** | Each iframe can manage its own session cookies (`HttpOnly`, `SameSite=Lax`) independently from the host, critical for multi-tenant SaaS platforms where different product surfaces may have separate auth domains. |
| **Legacy app integration** | Old jQuery 1.x, AngularJS 1.x, Backbone.js, or even server-rendered PHP apps can be embedded unchanged — the host just points `src` at them. |
| **Third-party / untrusted content** | `<iframe sandbox="allow-scripts allow-same-origin">` lets you embed completely untrusted code with strict capability restrictions. |
| **Cross-origin security** | Browser same-origin policy provides mandatory enforcement — the iframe literally cannot reach into the host's DOM, even with hostile code inside. |

#### ❌ What Cannot (Easily) Be Achieved

| Limitation | Explanation |
| :--- | :--- |
| **Shared vendor libraries** | React, Vue, lodash, etc. are each loaded independently inside the iframe — no singleton deduplication possible. |
| **Seamless visual integration** | Without custom scrolling choreography, iframes show their own internal scrollbars, fail to auto-resize their height, and feel like "embedded websites" rather than native components. |
| **Synchronous cross-frame state** | All communication between host and iframe **must** go through `postMessage` — which is asynchronous message-passing, not direct property binding. |
| **URL bar synchronization** | When the user navigates inside an iframe, the host's browser address bar stays stagnant unless the iframe explicitly posts navigation events and the host manually calls `history.pushState`. |
| **Deep SSR integration (hydration)** | The host shell cannot SSR the iframe's content — the iframe is always a client-side placeholder first, then loads its own server rendering separately. |
| **Accessibility across frames** | Screen readers have limited cross-frame ARIA tree traversal — an iframe break means `aria-controls` cannot reference elements inside the iframe from outside it. |
| **Same-origin cookie sharing** | Cross-origin iframes cannot share the host's auth cookies unless the remote is deployed on the same domain with `SameSite=None; Secure` and explicit CORS allows. |

#### 🏢 How Companies Use Iframes

| Company | Use Case | Pattern |
| :--- | :--- | :--- |
| **Google Analytics / Tag Manager** | Embedding analytics dashboards inside third-party SaaS portals | Sandboxed `<iframe>` with `postMessage` resize events |
| **Salesforce (Legacy Lightning)** | Embedding VisualForce pages inside Lightning Experience | VisualForce Iframes with `window.postMessage` bridge |
| **Figma (Plugins)** | Sandboxed user-authored plugins run inside a CSP-restricted `<iframe sandbox>` | Bidirectional `postMessage` protocol between host and plugin frame |
| **Shopify Polaris App Bridge** | Partners embed Shopify Admin context inside their own app iframes | `@shopify/app-bridge` library as a structured `postMessage` bridge |
| **Stripe.js Payment Element** | PCI-compliant credit card entry inside a cross-origin iframe | `postMessage` for tokenization response, auto-height for the payment form |
| **Microsoft Teams App Tabs** | 3rd-party team apps embedded as full tabs | `@microsoft/teams-js` SDK wrapping `postMessage` lifecycle events |
| **Vercel (Dashboard Sub-apps)** | Their analytics and monitoring surfaces previously used iframe isolation | Replaced with Module Federation over time as their stack unified |

---

## 3. Comprehensive Capability Matrix

### Feature-by-Feature Comparison

| Feature | Module Federation | Web Components | Iframes |
| :--- | :---: | :---: | :---: |
| **Next.js / Nuxt 3 / Remix integration** | ❌ Hard | 🟡 Via `output: 'export'` | ✅ Native |
| **AngularJS / jQuery / Rails legacy apps** | ❌ Impossible | 🟡 Manually wrapped | ✅ Native |
| **Shared vendor singletons** | ✅ Native | ❌ Not possible | ❌ Not possible |
| **Direct prop / signal passing** | ✅ Native | 🟡 Via attributes + events | ❌ Only via `postMessage` |
| **Hot Module Replacement (dev)** | ✅ Native | 🟡 Requires restart | ❌ Full iframe reload |
| **Shadow DOM CSS isolation** | 🟡 Manual (Watermelon) | ✅ Native | ✅ Hard isolated |
| **Crash isolation** | ❌ Host can crash | ❌ Host can crash | ✅ Isolated per frame |
| **Memory isolation** | ❌ Shared heap | ❌ Shared heap (mostly) | ✅ Separate heaps |
| **SSR / Server-Side Rendering** | 🟡 Client-side only | 🟡 DSD (experimental) | ✅ Full SSR support |
| **Independent auth / cookies** | ❌ Shared session | 🟡 With isolation APIs | ✅ Native per-origin |
| **URL bar synchronization** | ✅ Native (basename) | ✅ Native (basename) | ❌ Requires `postMessage` |
| **Accessibility / ARIA** | ✅ Full tree | ✅ Shadow DOM ARIA | ❌ Cross-frame ARIA broken |
| **Deployable without host changes** | 🟡 Semver contract | ✅ Tag name stable | ✅ URL/domain stable |
| **Third-party / untrusted content** | ❌ Security risk | ❌ Security risk | ✅ `sandbox` attribute |
| **Browser support** | ✅ IE11+ with polyfills | ✅ All modern browsers | ✅ Universal |
| **Cross-origin embedding** | ❌ Same-origin required | 🟡 Script-based | ✅ Cross-origin native |
| **Bundle size deduplication** | ✅ Best | ❌ Each ships own deps | ❌ Each ships own deps |
| **Performance (time to interactive)** | ✅ Fastest | ✅ Fast | 🟡 Iframe load overhead |
| **Zero-config CSS isolation** | ❌ Manual Shadow DOM | ✅ Native | ✅ Native |
| **Slot / Content projection** | ✅ Vue slots native | 🟡 Slot API across boundary | ❌ Not possible |

---

## 4. What Could Be Added to Watermelon

### Tier 1: Essential for Paradigm Completeness

These close obvious gaps and make Watermelon a credible, complete POC:

#### 4.1 Sandboxed Iframe Remote
**Effort: Medium**

Add an iframe mounting strategy to `RemoteWrapper.vue`:
```typescript
} else if (strategy === 'iframe') {
  const iframe = document.createElement('iframe');
  iframe.src = remoteConfig.url;
  iframe.style.cssText = 'width:100%;height:100%;border:none;';
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
  mountPoint.appendChild(iframe);
  
  // Auto-height bridge
  window.addEventListener('message', (e) => {
    if (e.data?.type === 'RESIZE' && e.data.remoteId === appName.value) {
      iframe.style.height = `${e.data.height}px`;
    }
  });
}
```

A minimal "iframe-aware" companion app could be a simple server-rendered HTML page (even vanilla PHP or Express) served on a different port, proving that the host can embed **any server-side technology**.

#### 4.2 `postMessage` Protocol Specification
**Effort: Low**

Define and document a structured message contract for the Watermelon iframe bridge:

```typescript
// Watermelon postMessage Protocol v1
interface WatermelonMessage {
  type: 'RESIZE' | 'NAVIGATE' | 'THEME_CHANGE' | 'AUTH_TOKEN' | 'READY';
  remoteId: string;
  payload: unknown;
}
```

This is the equivalent of Shopify's App Bridge or Microsoft Team's `teams-js` SDK — a minimal typed protocol.

#### 4.3 Non-Angular Web Component Remote (Lit or Svelte)
**Effort: Low-Medium**

A standalone `lit-remoteapp` or a Svelte 5 Web Component export would prove that Web Component integration works with **any** framework, not just Angular. Lit is ideal because it is Google's lightweight Web Component library (2kB) designed precisely for this use case.

---

### Tier 2: High Value, Moderate Effort

These additions demonstrate real architectural decision-making and differentiate Watermelon from generic "Module Federation demo" repos:

#### 4.4 Next.js Remote via Iframe (Fullstack SSR Demo)
**Effort: Medium**

Add a minimal Next.js 15 App Router application (could be a single page showing a server-rendered product card with a Server Action). Embed it inside the host as an iframe. This demonstrates:
- How Vercel-hosted Next.js apps integrate into non-Next.js shell architectures.
- Why companies like Shopify kept some pages as iframes even after adopting Module Federation.
- The performance tradeoff of iframe load overhead vs. SSR data freshness.

#### 4.5 Integration Strategy Selector UI in `RemoteWrapper.vue`
**Effort: Medium**

Display a UI control that lets you switch the **same remote** between integration modes (where applicable):

```
Angular Remote:  ● Web Component  ○ Iframe  
React Remote:    ● Module Federation  ○ Iframe
```

This is arguably Watermelon's most unique pedagogical feature — letting developers compare the identical app rendered under different integration strategies side-by-side.

#### 4.6 Bidirectional Custom Event API for Angular Remote
**Effort: Low**

Complete the Web Component paradigm for the existing Angular remote:
- Host → Remote: pass theme via element attribute.
- Remote → Host: fire `composed: true` custom events for navigation and state changes.

---

### Tier 3: Research & Edge Cases

These are optional but make Watermelon extremely valuable as a canonical reference:

#### 4.7 `SharedWorker` Cross-Remote State Bus
**Effort: High**

A `SharedWorker` can communicate between the host tab, an iframe, and any Module Federation remotes running in the same browser profile. This is how companies like Atlassian synchronize authentication refresh tokens and notification counts across federated surfaces.

#### 4.8 Server-Sent Events (SSE) or WebSocket State Bridge
**Effort: High**

Demonstrate cross-remote real-time sync (e.g., a counter incremented in the React remote that instantly updates in the Vue remote) via a shared lightweight WebSocket hub — the microfrontend equivalent of a distributed message bus.

#### 4.9 Cross-Origin Remote (Deployed on Different Domain)
**Effort: Low (config only)**

Document the CORS, CSP, and cookie policy configuration changes required when a remote is deployed on a completely different domain (`remote-app.other-company.com`) from the host (`platform.my-company.com`). This is the real-world enterprise scenario and Watermelon's current setup (all `localhost`) doesn't surface these concerns.

---

## 5. What Cannot Be Done (Hard Constraints)

These are architectural or browser-enforced limitations that no framework or tool can work around:

| Problem | Why It's Impossible | Industry Verdict |
| :--- | :--- | :--- |
| **Sharing React Context across iframe boundaries** | Separate JS heaps — context objects cannot be referenced across process boundaries. | Accepted — use `postMessage` serialization or a SharedWorker. |
| **CSS `@layer` / cascade across Shadow DOM** | CSS cascade does not cross Shadow DOM — `@layer` is scoped to the document context the styles are in. | Accepted — use CSS custom properties (`var(--*)`) which **do** pierce Shadow DOM boundaries as the only styling API. |
| **SSR streaming of Module Federation remotes** | RSC / streaming HTML is generated server-side per-request. Module Federation bundles are static client-side chunks. They are fundamentally different runtime models. | Industry is moving toward hybrid approaches — Astro Islands, Micro-frontend frameworks like Qiankun with SSR plugins, or Next.js Multi-Zones (proxy-based). |
| **Synchronous iframe communication** | `postMessage` is asynchronous by specification. There is no synchronous cross-frame API in browsers. | Accepted — design protocols to be fire-and-forget or use request-response correlation IDs. |
| **Zero CLS (Cumulative Layout Shift) with iframes** | Until the iframe's content loads, it renders as a blank block. Auto-height via `postMessage` introduces at least one layout reflow. | Partial mitigation — send the initial height as a URL param or a `meta` tag so the host can set it before first paint. |
| **Declarative Shadow DOM (DSD) at production scale** | DSD allows SSR for Web Components but requires explicit server-side serialization and browser support is still finalized in Safari. | Deferred — use client-side-only custom elements for now; DSD is a future upgrade path. |

---

## 6. Precedents from Production Systems

### 6.1 Micro-Frontend Frameworks (Higher-Level Orchestrators)
If Watermelon grows beyond POC into a platform framework, these are the dominant standardized solutions worth studying:

| Framework | Paradigms Supported | Key Companies |
| :--- | :--- | :--- |
| **Single-SPA** | MF + Web Components + Iframes via parcels | Canopy, Snapdocs, many enterprise CRM vendors |
| **Qiankun** (Alibaba) | Sandbox-based JS isolation (proxy-based), iframe fallback | Ant Design ecosystem, major Chinese e-commerce |
| **Luigi** (SAP) | Iframe-first with strong `postMessage` protocol + auth | SAP Business Technology Platform |
| **Bit** | Component-level federation, any framework | Teams wanting per-component versioning |
| **Module Federation Plugin (Zephyr)** | Enhanced Webpack/Vite MF with live deploy coordination | Companies with 10+ teams deploying independently |

### 6.2 Architectural Decision Records from Large Orgs

- **Netflix**: Moved away from single monolith to server-rendered page fragments (not traditional MF). Their approach is closer to Edge SSI (Server-Side Includes) at the CDN layer.
- **Spotify**: Uses a "Backstage" architecture — plugin surfaces are React components loaded via MF but their data is managed by a shared GraphQL federation layer.
- **IKEA**: Moved to Web Components for their product display units — each `<ikea-product-card>` is a self-contained custom element deployed by the product catalog team.
- **American Express**: Pioneered the term "micro-frontends" with their Node.js One App framework — Holocron modules (closer to Module Federation avant la lettre).

---

## 7. Proposed Implementation Sequence for Watermelon

Based on the analysis above, a clear sequenced roadmap:

```
Phase 1 — Complete the Web Components Paradigm [Estimated: 2–3 days]
  ├── Add bidirectional Custom Event API for Angular remote
  ├── Add attribute-based host-to-remote theme passing
  └── Add a Lit-based non-Angular Web Component remote

Phase 2 — Implement the Iframe Paradigm [Estimated: 3–4 days]
  ├── Add iframe mounting strategy to RemoteWrapper.vue
  ├── Define postMessage protocol (RESIZE, NAVIGATE, THEME_CHANGE, READY)
  ├── Create a minimal iframe-aware Express/Bun server as iframe remote
  └── Add URL bar synchronization via postMessage + history.pushState

Phase 3 — Fullstack SSR Remote Demo [Estimated: 3–5 days]
  └── Add minimal Next.js 15 App Router app as iframe remote

Phase 4 — Host UI: Integration Strategy Selector [Estimated: 2–3 days]
  └── Overlay in RemoteWrapper showing which paradigm is active
      + ability to switch strategies where applicable

Phase 5 — Research Documentation & Taxonomy Update [Estimated: 1 day]
  ├── Update README.md, SPEC.md with finalized taxonomy
  ├── Add ARCHITECTURE_DECISIONS.md with ADR-format records
  └── Add comparison page to the Home Dashboard UI
```

---

## 8. Open Questions for Decision

1. **Iframe Remote Technology**: For the initial iframe demo, should we use:
   - A) A simple Express.js / Bun server returning a plain HTML page (fastest to implement, clearest demo)
   - B) A minimal Next.js 15 App Router app (most relevant to enterprise reality)
   - C) Both — one lightweight, one fullstack?

2. **Non-Angular Web Component**: Should we add a Lit-based remote, or convert the Svelte remote to a custom element to avoid adding a 9th application?

3. **Scope of `postMessage` Protocol**: Should we document and implement the protocol as a standalone publishable spec (like Shopify App Bridge), or keep it internal to Watermelon?

4. **Host UI Update**: Should the Integration Strategy Selector be a toggle switch in `RemoteWrapper.vue`'s header bar, or a separate comparison page accessible from the home dashboard?

---

*Last updated: October 2026 | For review by project lead before implementation.*
