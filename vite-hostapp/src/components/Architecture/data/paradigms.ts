// File: src/components/Architecture/data/paradigms.ts

import type { ParadigmItem, MatrixRow } from "../types";

export const paradigms: ParadigmItem[] = [
  {
    title: "Module Federation",
    tag: "Runtime JS",
    remotesCount: "6",
    borderClass: "border-blue-200 dark:border-blue-900/60",
    badgeClass: "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300",
    description: "Webpack 5 & Vite federation exporting ESM chunks dynamically. Components mount directly into the host DOM with zero runtime wrapper overhead.",
    strengths: [
      "Shared dependencies deduplication (React, Vue)",
      "Native DOM execution without iframe overhead",
      "Seamless browser history & deep linking",
      "Fastest initial mount time"
    ],
    usedFor: "High-performance inner-loop features, design systems, and cohesive app workflows."
  },
  {
    title: "Web Components",
    tag: "W3C Standard",
    remotesCount: "3",
    borderClass: "border-pink-200 dark:border-pink-900/60",
    badgeClass: "bg-pink-100 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300",
    description: "Browser-native Custom Elements with Shadow DOM encapsulation. Standard DOM properties, attributes, and CustomEvent dispatching.",
    strengths: [
      "Native style encapsulation (Shadow DOM)",
      "Framework-agnostic standard lifecycle",
      "No shared bundle negotiation required",
      "Self-contained reusable custom tags"
    ],
    usedFor: "Angular 20 Zoneless, Lit 3 notification centers, and Vue 3 reactive custom elements."
  },
  {
    title: "Sandboxed Iframes",
    tag: "Process Isolated",
    remotesCount: "2",
    borderClass: "border-emerald-200 dark:border-emerald-900/60",
    badgeClass: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300",
    description: "Native browser sandboxed browsing contexts communicating via the typed @watermelon/bridge postMessage protocol.",
    strengths: [
      "Fault isolation (unhandled remote errors do not crash host)",
      "Supports complex SSR runtimes (Next.js 16)",
      "Independent document CSS & JS isolation",
      "Seamless dynamic auto-resizing"
    ],
    usedFor: "Third-party extensions, Next.js App Router analytics, and isolated asset managers."
  }
];

export const matrixRows: MatrixRow[] = [
  {
    criteria: "CSS Isolation",
    mf: "Shared DOM (relies on prefixing / CSS modules)",
    wc: "Shadow DOM (native browser boundary)",
    iframe: "Separate Document Context (isolated DOM and global scope)"
  },
  {
    criteria: "Fault Boundary",
    mf: "Host ErrorBoundary (unhandled crash can bubble)",
    wc: "Component Boundary (custom element fails safely)",
    iframe: "Browsing Context Isolation (frame exceptions contained in iframe)"
  },
  {
    criteria: "Shared Dependencies",
    mf: "Yes (automatic deduplication across remotes)",
    wc: "Bundled inside custom element or shared globally",
    iframe: "No (each frame loads its own runtime)"
  },
  {
    criteria: "Communication",
    mf: "Direct JS callbacks, Props, Pinia / Redux store",
    wc: "HTML Attributes, Props, and CustomEvents",
    iframe: "Typed @watermelon/bridge postMessage protocol"
  },
  {
    criteria: "SSR Compatibility",
    mf: "Complex (requires Node federation streaming)",
    wc: "Declarative Shadow DOM or Client Hydration",
    iframe: "Native & Effortless (Next.js 16 App Router)"
  },
  {
    criteria: "Memory Context",
    mf: "Shared browser heap (shared runtime memory)",
    wc: "Shared heap with isolated DOM tree",
    iframe: "Isolated browsing context per frame"
  }
];
