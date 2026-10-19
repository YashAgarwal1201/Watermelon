// File: packages/watermelon-bridge/src/client.ts

// ─── WatermelonBridgeClient ───────────────────────────────────────────────────
// Client-side SDK embedded inside an iframe remote (e.g. Next.js, Vite SPA).
// Safe in SSR/Node contexts, manages postMessage messaging with the host shell.
// ──────────────────────────────────────────────────────────────────────────────

import type {
  WatermelonAuthPayload,
  WatermelonBridgeClientConfig,
  WatermelonClientMessageType,
  WatermelonErrorPayload,
  WatermelonEventPayload,
  WatermelonMessage,
  WatermelonNavigatePayload,
  WatermelonResizePayload,
  WatermelonTheme,
  WatermelonThemePayload,
  WatermelonNavigateToPayload,
} from "./types";

export class WatermelonBridgeClient {
  private config: WatermelonBridgeClientConfig;
  private isDestroyed = false;

  private themeHandlers: Set<(theme: WatermelonTheme) => void> = new Set();
  private authHandlers: Set<(auth: WatermelonAuthPayload) => void> = new Set();
  private navigateHandlers: Set<(path: string) => void> = new Set();
  private pingHandlers: Set<() => void> = new Set();

  private resizeObserver: ResizeObserver | null = null;

  constructor(config: WatermelonBridgeClientConfig) {
    this.config = config;
    if (typeof window !== "undefined") {
      window.addEventListener("message", this.handleMessage);
    }
  }

  private handleMessage = (event: MessageEvent): void => {
    if (this.isDestroyed) return;
    const data = event.data;
    if (!data || typeof data !== "object") return;
    if (data.__wm !== true) return;
    if (data.remoteId !== this.config.remoteId) return;

    switch (data.type) {
      case "WM_THEME": {
        const theme = (data.payload as WatermelonThemePayload)?.theme;
        if (theme) {
          for (const handler of this.themeHandlers) {
            handler(theme);
          }
        }
        break;
      }
      case "WM_AUTH": {
        const auth = data.payload as WatermelonAuthPayload;
        if (auth) {
          for (const handler of this.authHandlers) {
            handler(auth);
          }
        }
        break;
      }
      case "WM_NAVIGATE_TO": {
        const path = (data.payload as WatermelonNavigateToPayload)?.path;
        if (path) {
          for (const handler of this.navigateHandlers) {
            handler(path);
          }
        }
        break;
      }
      case "WM_PING": {
        for (const handler of this.pingHandlers) {
          handler();
        }
        break;
      }
      default:
        break;
    }
  };

  /**
   * Post a typed message to window.parent (host application).
   */
  postMessage<T>(type: WatermelonClientMessageType, payload: T): void {
    if (this.isDestroyed) return;
    if (typeof window === "undefined" || !window.parent) return;

    const message: WatermelonMessage<T> = {
      __wm: true,
      type,
      remoteId: this.config.remoteId,
      payload,
      timestamp: Date.now(),
    };

    window.parent.postMessage(message, this.config.targetOrigin ?? "*");
  }

  /**
   * Signal to host that remote is mounted and initialized.
   */
  ready(): void {
    this.postMessage("WM_READY", {});
  }

  /**
   * Report content height to host for fluid layout without scrollbars.
   */
  resize(height?: number): void {
    if (typeof window === "undefined") return;
    const computedHeight =
      typeof height === "number"
        ? height
        : Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight,
          );

    this.postMessage<WatermelonResizePayload>("WM_RESIZE", {
      height: computedHeight,
    });
  }

  /**
   * Automatically observe body/element resizes and report to host.
   */
  observeResize(target?: HTMLElement): () => void {
    if (typeof window === "undefined" || typeof ResizeObserver === "undefined") {
      return () => {};
    }

    const el = target ?? document.body;
    if (!el) return () => {};

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
    });

    this.resizeObserver.observe(el);

    return () => {
      this.resizeObserver?.disconnect();
      this.resizeObserver = null;
    };
  }

  /**
   * Notify host of internal navigation.
   */
  navigate(path: string): void {
    this.postMessage<WatermelonNavigatePayload>("WM_NAVIGATE", { path });
  }

  /**
   * Report an error to the host error boundary.
   */
  error(message: string, stack?: string): void {
    this.postMessage<WatermelonErrorPayload>("WM_ERROR", { message, stack });
  }

  /**
   * Emit a domain-specific event to host.
   */
  emit<T = unknown>(eventType: string, detail?: T): void {
    this.postMessage<WatermelonEventPayload<T>>("WM_EVENT", {
      eventType,
      detail: detail as T,
    });
  }

  // ─── Subscriptions ──────────────────────────────────────────────────────────

  onTheme(handler: (theme: WatermelonTheme) => void): () => void {
    this.themeHandlers.add(handler);
    return () => this.themeHandlers.delete(handler);
  }

  onAuth(handler: (auth: WatermelonAuthPayload) => void): () => void {
    this.authHandlers.add(handler);
    return () => this.authHandlers.delete(handler);
  }

  onNavigateTo(handler: (path: string) => void): () => void {
    this.navigateHandlers.add(handler);
    return () => this.navigateHandlers.delete(handler);
  }

  onPing(handler: () => void): () => void {
    this.pingHandlers.add(handler);
    return () => this.pingHandlers.delete(handler);
  }

  destroy(): void {
    this.isDestroyed = true;
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    this.themeHandlers.clear();
    this.authHandlers.clear();
    this.navigateHandlers.clear();
    this.pingHandlers.clear();

    if (typeof window !== "undefined") {
      window.removeEventListener("message", this.handleMessage);
    }
  }
}
