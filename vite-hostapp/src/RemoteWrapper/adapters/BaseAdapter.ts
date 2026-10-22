// File: RemoteWrapper/adapters/BaseAdapter.ts

// ─── Base Adapter Interfaces & Strategy Types ─────────────────────────────────
// Defines the contract that all remote adapters (Module Federation, Web Component,
// Iframe) must satisfy.
// ──────────────────────────────────────────────────────────────────────────────

import type { EventBus } from "../../services/eventBus";

export type RemoteStrategy = "module-federation" | "web-component" | "iframe";

export interface RemoteAdapterConfig {
  mountPoint: HTMLElement;
  shadowRoot: ShadowRoot;
  appName: string;
  basename: string;
  isCancelled?: () => boolean;
  bridge?: any; // WatermelonBridgeHost for iframe strategy
  eventBus?: EventBus;
}

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

export interface RemoteAdapter {
  readonly strategy: RemoteStrategy;
  mount(config: RemoteAdapterConfig): Promise<void>;
  unmount(): void;
}
