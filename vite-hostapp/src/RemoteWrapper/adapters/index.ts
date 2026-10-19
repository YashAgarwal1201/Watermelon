// File: RemoteWrapper/adapters/index.ts

// ─── Adapters Barrel & Remote Registry ────────────────────────────────────────
// Central registry mapping remote names to their adapter strategy and configuration.
// ──────────────────────────────────────────────────────────────────────────────

import type { RemoteAdapter } from "./BaseAdapter";
import { ModuleFederationAdapter } from "./ModuleFederationAdapter";
import { WebComponentAdapter } from "./WebComponentAdapter";
import { IframeAdapter } from "./IframeAdapter";

export * from "./BaseAdapter";
export * from "./ModuleFederationAdapter";
export * from "./WebComponentAdapter";
export * from "./IframeAdapter";

export interface RemoteRegistryEntry {
  strategy: "module-federation" | "web-component" | "iframe";
  config?: any;
}

export const REMOTE_REGISTRY: Record<string, RemoteRegistryEntry> = {
  // ─── Module Federation Remotes ──────────────────────────────────────────────
  vite_react_remoteapp: { strategy: "module-federation" },
  vite_vue_remoteapp: { strategy: "module-federation" },
  vite_svelte_remoteapp: { strategy: "module-federation" },
  vite_solidjs_remoteapp: { strategy: "module-federation" },
  webpack_react_remoteapp: { strategy: "module-federation" },
  webpack_vue_remoteapp: { strategy: "module-federation" },

  // ─── Web Component Remotes ──────────────────────────────────────────────────
  angular_remoteapp: {
    strategy: "web-component",
    config: {
      tag: "angular-remote-app",
      scriptUrl: () =>
        `${((import.meta as any).env?.VITE_REMOTE_ANGULAR_URL ?? "https://localhost:4201").replace(/\/+$/, "")}/main.js`,
    },
  },
  wc_lit_remoteapp: {
    strategy: "web-component",
    config: {
      tag: "wm-notification-center",
      scriptUrl: () =>
        `${((import.meta as any).env?.VITE_REMOTE_WC_LIT_URL ?? "https://localhost:5302").replace(/\/+$/, "")}/main.js`,
    },
  },
  wc_vue_remoteapp: {
    strategy: "web-component",
    config: {
      tag: "wm-user-profile",
      scriptUrl: () =>
        `${((import.meta as any).env?.VITE_REMOTE_WC_VUE_URL ?? "https://localhost:5303").replace(/\/+$/, "")}/main.js`,
      attributes: {
        "user-name": "Alex Johnson",
        "user-role": "Staff Software Engineer",
        status: "online",
      },
    },
  },

  // ─── Iframe Remotes ─────────────────────────────────────────────────────────
  iframe_vite_app: {
    strategy: "iframe",
    config: {
      url: () =>
        (import.meta as any).env?.VITE_REMOTE_IFRAME_VITE_URL ??
        "https://localhost:5300",
    },
  },
  iframe_nextjs_app: {
    strategy: "iframe",
    config: {
      url: () =>
        (import.meta as any).env?.VITE_REMOTE_IFRAME_NEXTJS_URL ??
        "https://localhost:5301",
    },
  },
};

export function resolveAdapter(appName: string): RemoteAdapter {
  const entry = REMOTE_REGISTRY[appName];
  if (!entry) {
    throw new Error(`Unknown remote app: ${appName}`);
  }

  switch (entry.strategy) {
    case "module-federation":
      return new ModuleFederationAdapter();
    case "web-component":
      return new WebComponentAdapter(entry.config);
    case "iframe":
      return new IframeAdapter(entry.config);
    default:
      throw new Error(`Unknown strategy: ${(entry as any).strategy}`);
  }
}
