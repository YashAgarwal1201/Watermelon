// File: src/components/Architecture/data/faq.ts

import type { FaqItem } from "../types";

export const faqItems: FaqItem[] = [
  {
    question: "When should a team choose Web Components over Module Federation?",
    answer: "Choose Web Components when strict CSS isolation is required without conflicting class names (e.g. two teams using different versions of Tailwind), or when packaging reusable widgets for consumers on unknown tech stacks. Choose Module Federation when maximum performance, shared dependency deduplication (e.g. loading React only once), and deep history/routing integration are required."
  },
  {
    question: "Can an unhandled runtime error in a remote crash the host application?",
    answer: "In Sandboxed Iframes, the browser executes the remote in a separate browsing context, preventing unhandled remote runtime exceptions from bubbling to the host shell. In Web Components and Module Federation, Watermelon encapsulates each remote within an adapter-level error boundary. If a remote throws an unhandled error, the adapter catches it, renders an inline recovery card, and keeps the host shell responsive."
  },
  {
    question: "How does @watermelon/bridge protect against cross-site scripting (XSS)?",
    answer: "The bridge uses strict message structure guards: every message must contain an internal __wm namespace tag, a known remote ID, and an allowable message type (WM_READY, WM_RESIZE, WM_THEME, etc.). Additionally, iframe attributes use strict sandbox permissions (sandbox='allow-scripts allow-same-origin') and explicit frame-ancestor CSP restrictions."
  },
  {
    question: "How are shared dependencies handled between Vite and Webpack remotes?",
    answer: "Webpack 5 and Vite use compatible Module Federation sharing semantics. Packages declared as shared (such as react and react-dom) register their version in the global window share scope. The host negotiates the highest semver-compatible version and provides it as a singleton to both Vite and Webpack remotes, preventing redundant downloads."
  },
  {
    question: "Why use Next.js App Router as a microfrontend if it is primarily an SSR framework?",
    answer: "Many enterprise systems have existing Next.js web applications, analytics dashboards, or server-rendered admin tools. By embedding them via sandboxed iframes with dynamic height resizing and postMessage bridge sync, teams can integrate entire Next.js applications into an overarching portal without needing to rewrite them as client-side libraries."
  },
  {
    question: "How does the platform prevent CSS collisions between multiple remotes using different versions of Tailwind?",
    answer: "Watermelon uses two complementary defenses: (1) In Web Component remotes, styles are encapsulated inside the Shadow DOM, scoping stylesheets directly to the component's shadow tree. (2) In Module Federation remotes, PostCSS prefixing scopes utility classes to remote-specific wrapper containers."
  }
];
