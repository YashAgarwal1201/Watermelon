// File: src/components/Architecture/data/findings.ts

import type { EngineeringFinding } from "../types";

export const engineeringFindings: EngineeringFinding[] = [
  {
    id: "1",
    title: "Shadow DOM & Head Stylesheet Diversion",
    category: "CSS & Shadow DOM",
    categoryBadgeClass: "bg-pink-100 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800",
    severity: "CSS Isolation",
    severityBadgeClass: "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    iconClass: "bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300",
    synopsis: "Runtime bundlers inject stylesheets into document.head, which cannot pierce Shadow DOM boundaries, leaving microfrontend components completely unstyled.",
    symptoms: {
      description: "When remotes loaded inside a Shadow Root, component stylesheets were appended to the global document.head, leaving the shadow DOM tree with zero applied styles.",
      details: [
        "Runtime CSS loaders in Vite, Webpack, and Angular call document.head.appendChild() dynamically as chunks load.",
        "Styles residing in document.head cannot cross the Shadow DOM encapsulation boundary into the remote.",
        "Components rendered completely unstyled with browser-default typography and broken layouts."
      ],
      errorSignature: "HTMLStyleElement appended to document.head while active component renders inside ShadowRoot"
    },
    failedAttempts: {
      description: "Initial workarounds attempted global head duplication and post-mount DOM queries:",
      attempts: [
        "Duplicating remote stylesheets into global document.head, which leaked styles and broke host shell typography.",
        "Querying the DOM after mount to copy style nodes, which failed due to asynchronous chunk loading and caused visible FOUC flashes."
      ]
    },
    solution: {
      title: "Active DOM Head Interception via patchHeadToShadow.ts",
      description: "Implemented an interception layer that diverts head-bound stylesheet injections directly into the active remote's Shadow Root.",
      details: [
        "Monkey-patched document.head.appendChild, insertBefore, and append during active remote mount lifecycles.",
        "Attached a scoped MutationObserver to capture any asynchronous style and link tags targeted at document.head.",
        "Automatically redirected captured stylesheets into the active remote Shadow Root.",
        "Systematically disconnected all observers and restored native head methods upon remote unmount."
      ]
    },
    takeaway: "Shadow DOM provides clean boundary isolation, but runtime CSS loaders target document.head. The host shell must actively intercept and divert head mutations into the active shadow tree."
  },
  {
    id: "2",
    title: "Vite CSS-in-JS & Cross-Origin Relative Asset Resolution",
    category: "CSS & Shadow DOM",
    categoryBadgeClass: "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    severity: "Cross-Origin Blocker",
    severityBadgeClass: "bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    iconClass: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300",
    synopsis: "External CSS extraction in federated Vite remotes causes relative font and image paths to resolve against the host origin, returning 404s.",
    symptoms: {
      description: "Vite remotes exporting separate external CSS files failed to resolve font files and SVG icons when loaded across different origins.",
      details: [
        "Relative asset paths like url('./fonts/Inter.woff2') resolved against host origin https://localhost:5150 rather than the remote origin.",
        "The browser returned 404 Not Found for all nested font and icon subresources.",
        "Cross-origin stylesheet link tags introduced subresource integrity and CORS complexity."
      ],
      errorSignature: "GET https://localhost:5150/assets/font.woff2 404 (Not Found)"
    },
    failedAttempts: {
      description: "Early attempts relied on hardcoded base URLs and runtime string rewrites:",
      attempts: [
        "Hardcoding absolute base URLs in vite.config.ts, which broke portability across Docker networks, staging, and production domains.",
        "Fetching CSS files as text blobs and regex-rewriting relative paths at runtime, which added 180ms latency on initial load."
      ]
    },
    solution: {
      title: "Inlined CSS Bundling via vite-plugin-css-injected-by-js",
      description: "Configured vite-plugin-css-injected-by-js across all Vite remotes to produce self-contained JavaScript chunks with embedded styles.",
      details: [
        "Compiled CSS directly into the JavaScript ESM chunks instead of outputting separate .css files.",
        "Styles are injected dynamically when the JavaScript module executes, resolving assets relative to import.meta.url.",
        "Guaranteed atomic delivery of code and matching styles in a single network request.",
        "Completely eliminated cross-origin stylesheet network requests and relative asset 404 errors."
      ]
    },
    takeaway: "In multi-origin federation, bundling styles directly into JavaScript creates self-contained modules that resolve assets correctly without cross-origin stylesheet failures."
  },
  {
    id: "3",
    title: "Next.js 16 Security Headers & Sandboxed Frame Embedding",
    category: "Security & CSP",
    categoryBadgeClass: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    severity: "Cross-Origin Blocker",
    severityBadgeClass: "bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    iconClass: "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300",
    synopsis: "Next.js default security headers send legacy X-Frame-Options: SAMEORIGIN, blocking parent host shells on different ports from embedding the application.",
    symptoms: {
      description: "Embedding the Next.js analytics app on port 5301 into the host shell on port 5150 failed immediately with browser security errors.",
      details: [
        "The browser refused to display the iframe content inside the host container.",
        "Console logged security errors: Refused to display in a frame because it set X-Frame-Options to SAMEORIGIN.",
        "Port 5150 and port 5301 represent different origins under RFC 6454 security rules."
      ],
      errorSignature: "Refused to display 'https://localhost:5301/' in a frame because it set 'X-Frame-Options' to 'SAMEORIGIN'"
    },
    failedAttempts: {
      description: "Attempted workarounds with deprecated headers and reverse proxies:",
      attempts: [
        "Setting X-Frame-Options: ALLOW-FROM https://localhost:5150, which modern browsers ignore due to standard deprecation.",
        "Running Next.js behind a local reverse proxy, which broke Turbopack WebSocket HMR and local HTTPS certificates."
      ]
    },
    solution: {
      title: "Content-Security-Policy frame-ancestors Configuration",
      description: "Replaced legacy X-Frame-Options with modern Content-Security-Policy frame-ancestors permissions in next.config.ts.",
      details: [
        "Removed legacy X-Frame-Options: SAMEORIGIN header completely.",
        "Configured Content-Security-Policy: frame-ancestors 'self' https://localhost:5150 * to explicitly authorize the host origin.",
        "Preserved full SSR App Router capabilities, Turbopack fast refresh, and server actions inside the sandbox."
      ]
    },
    takeaway: "Modern iframe microfrontends cannot rely on deprecated X-Frame-Options. Use Content-Security-Policy frame-ancestors for explicit parent origin allowlists."
  },
  {
    id: "4",
    title: "Unmount Lifecycle Hygiene & Memory Leaks",
    category: "Runtime & Globals",
    categoryBadgeClass: "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    severity: "Performance",
    severityBadgeClass: "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    iconClass: "bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300",
    synopsis: "Navigating between remotes without systematic teardown leaves orphaned bridge message listeners, ResizeObservers, and detached DOM trees in heap memory.",
    symptoms: {
      description: "Switching between remotes caused browser heap memory to climb continuously from 85 MB to over 600 MB after repeated route transitions.",
      details: [
        "window.addEventListener('message') handlers accumulated on every navigation, causing postMessage events to fire multiple times.",
        "ResizeObservers attached to remote containers continued firing after components were removed from the DOM.",
        "Detached DOM trees remained pinned in memory by active event listener closures."
      ],
      errorSignature: "Duplicate postMessage handling & monotonic heap memory growth across route transitions"
    },
    failedAttempts: {
      description: "Naive cleanup approaches that failed to release memory:",
      attempts: [
        "Setting container.innerHTML = '' alone, which removed DOM nodes but left active window listeners and observer closures pinned in heap memory.",
        "Attempting global window listener resets, which broke the host shell's own navigation and keyboard shortcuts."
      ]
    },
    solution: {
      title: "Mandatory BaseAdapter Teardown Contract",
      description: "Enforced an unmount() contract across all remote adapters executed systematically on route change.",
      details: [
        "BaseAdapter enforces an unmount() method called during Vue onBeforeUnmount and before initializing any new remote.",
        "IframeAdapter unregisters window message listeners, disconnects ResizeObservers, and resets the iframe src.",
        "ModuleFederationAdapter invokes framework unmount hooks (root.unmount() for React, app.unmount() for Vue).",
        "WebComponentAdapter disconnects Shadow DOM observers and cleans up DOM nodes."
      ]
    },
    takeaway: "Microfrontend hosts must treat unmounting as a first-class contract. Without explicit teardown protocols, multi-framework Single Page Applications leak memory rapidly."
  },
  {
    id: "5",
    title: "Why Angular Module Federation Failed: Zone.js & Router Collisions",
    category: "Runtime & Globals",
    categoryBadgeClass: "bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    severity: "Critical Architectural Pivot",
    severityBadgeClass: "bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    iconClass: "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300",
    synopsis: "Angular's deep runtime assumptions (zone.js monkey-patching, router window.location ownership, and document.head styling) broke the host app globally until migrating to Web Components.",
    symptoms: {
      description: "Loading Angular through Module Federation broke the host globally. Angular's runtime intercepted host asynchronous operations and entered recursive reload loops.",
      details: [
        "zone.js monkey-patched global window APIs (setTimeout, Promise, addEventListener, MutationObserver). Angular reacted to host async events (Vue Router transitions, Vite HMR), triggering continuous change detection passes and full-page reload loops.",
        "Angular Router directly inspected and mutated window.location, colliding with Vue Router and causing route mismatches on nested routes.",
        "NG0908: Angular requires Zone.js occurred when attempting to switch to provideZonelessChangeDetection() due to third-party module expectations.",
        "Blank initial renders occurred in zoneless mode where content remained invisible until an explicit appRef.tick() was triggered."
      ],
      errorSignature: "NG0908: In this configuration Angular requires Zone.js / Recursive window reload loop"
    },
    failedAttempts: {
      description: "Multiple workarounds attempted to salvage Module Federation before abandoning it:",
      attempts: [
        "Adding withHashLocation() stopped one version of the reload loop, but injected '#' into URLs and caused page refreshes on sub-routes to reset back to the root.",
        "Intercepting document.head CSS and regex-rewriting :root, html, and body selectors to :host, which proved fragile and caused styles to disappear on navigation.",
        "Dual entry point collisions between bootstrap.ts and remote-entry.ts mount functions leading to erratic bundle resolution."
      ]
    },
    solution: {
      title: "Architectural Pivot: Angular Elements (W3C Custom Element)",
      description: "Replaced Module Federation with W3C Web Components via @angular/elements, giving Angular a strict encapsulation boundary.",
      details: [
        "Compiled Angular into a standalone Custom Element (<app-root>), eliminating global federation module sharing.",
        "Scoped zone.js inside the Angular element bundle without leaking its monkey-patching behavior into the Vue host window.",
        "Implemented a SilentLocationStrategy so Angular routes internally in memory without reading or writing the browser URL.",
        "Configured outputHashing: 'none' and pinned @angular/elements@20 to match the Angular 20 compiler.",
        "Registered PrimeIcons and PrimeFlex styles properly inside angular.json and scoped styles cleanly to the custom element."
      ]
    },
    takeaway: "Unlike React, Vue, Svelte, or SolidJS, Angular assumes substantial ownership of browser globals (zone patching, router history, document head). Attempting to share an un-encapsulated window via Module Federation causes severe side effects. Web Components provide the essential isolation boundary."
  }
];
