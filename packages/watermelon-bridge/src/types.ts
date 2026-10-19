// File: packages/watermelon-bridge/src/types.ts

// ─── WatermelonBridge Message Types & Protocol Specifications ────────────────
// Structured, namespaced message definitions for host <-> iframe communication.
// ─────────────────────────────────────────────────────────────────────────────

export type WatermelonClientMessageType =
  | "WM_READY" // Remote has mounted and initialized bridge
  | "WM_RESIZE" // Remote layout/content height changed
  | "WM_NAVIGATE" // Remote navigated internally
  | "WM_ERROR" // Unhandled runtime error in remote
  | "WM_EVENT"; // Custom semantic domain event emitted by remote

export type WatermelonHostMessageType =
  | "WM_THEME" // Host is sending theme update ('light' | 'dark')
  | "WM_AUTH" // Host is sending auth/session context
  | "WM_NAVIGATE_TO" // Host requests the remote to navigate internally
  | "WM_PING"; // Host liveness check

export type WatermelonMessageType =
  | WatermelonClientMessageType
  | WatermelonHostMessageType;

export interface WatermelonMessage<T = unknown> {
  __wm: true; // Namespace guard: distinguishes Watermelon messages from browser/extension noise
  type: WatermelonMessageType;
  remoteId: string; // Identifier of the remote (e.g. 'iframe_vite_app', 'iframe_nextjs_app')
  payload: T;
  timestamp: number;
}

export type WatermelonTheme = "light" | "dark";

export interface WatermelonAuthPayload {
  token?: string;
  userId?: string;
  username?: string;
  roles?: string[];
  [key: string]: unknown;
}

export interface WatermelonResizePayload {
  height: number;
}

export interface WatermelonNavigatePayload {
  path: string;
}

export interface WatermelonErrorPayload {
  message: string;
  stack?: string;
}

export interface WatermelonEventPayload<T = unknown> {
  eventType: string;
  detail: T;
}

export interface WatermelonThemePayload {
  theme: WatermelonTheme;
}

export interface WatermelonNavigateToPayload {
  path: string;
}

// ─── Host Configuration ───────────────────────────────────────────────────────
export interface WatermelonBridgeHostConfig {
  remoteId: string;
  iframe: HTMLIFrameElement;
  targetOrigin?: string; // Default: '*' or specific origin
  onReady?: () => void;
  onResize?: (height: number) => void;
  onNavigate?: (path: string) => void;
  onError?: (error: WatermelonErrorPayload) => void;
  onEvent?: (eventType: string, detail: unknown) => void;
}

// ─── Client Configuration ─────────────────────────────────────────────────────
export interface WatermelonBridgeClientConfig {
  remoteId: string;
  targetOrigin?: string; // Default: '*'
}
