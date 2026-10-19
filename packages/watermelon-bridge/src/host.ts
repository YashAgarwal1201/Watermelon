// File: packages/watermelon-bridge/src/host.ts

// ─── WatermelonBridgeHost ─────────────────────────────────────────────────────
// Host-side controller managing postMessage communication with an iframe remote.
// Validates namespaced messages, handles auto-resize, route sync, and theme pushing.
// ──────────────────────────────────────────────────────────────────────────────

import type {
  WatermelonBridgeHostConfig,
  WatermelonErrorPayload,
  WatermelonHostMessageType,
  WatermelonMessage,
  WatermelonNavigateToPayload,
  WatermelonTheme,
  WatermelonThemePayload,
  WatermelonAuthPayload,
} from "./types";

export class WatermelonBridgeHost {
  private config: WatermelonBridgeHostConfig;
  private isDestroyed = false;

  constructor(config: WatermelonBridgeHostConfig) {
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
      case "WM_READY":
        this.config.onReady?.();
        break;
      case "WM_RESIZE":
        if (typeof data.payload?.height === "number") {
          this.config.onResize?.(data.payload.height);
        }
        break;
      case "WM_NAVIGATE":
        if (typeof data.payload?.path === "string") {
          this.config.onNavigate?.(data.payload.path);
        }
        break;
      case "WM_ERROR":
        this.config.onError?.(data.payload as WatermelonErrorPayload);
        break;
      case "WM_EVENT":
        if (data.payload && typeof data.payload.eventType === "string") {
          this.config.onEvent?.(data.payload.eventType, data.payload.detail);
        }
        break;
      default:
        break;
    }
  };

  /**
   * Post a typed message to the remote iframe's contentWindow.
   */
  postMessage<T>(type: WatermelonHostMessageType, payload: T): void {
    if (this.isDestroyed) return;
    const targetWin = this.config.iframe.contentWindow;
    if (!targetWin) return;

    const message: WatermelonMessage<T> = {
      __wm: true,
      type,
      remoteId: this.config.remoteId,
      payload,
      timestamp: Date.now(),
    };

    targetWin.postMessage(message, this.config.targetOrigin ?? "*");
  }

  /**
   * Push current host theme mode ('light' | 'dark') to remote.
   */
  sendTheme(theme: WatermelonTheme): void {
    this.postMessage<WatermelonThemePayload>("WM_THEME", { theme });
  }

  /**
   * Push auth token / user context to remote.
   */
  sendAuth(auth: WatermelonAuthPayload): void {
    this.postMessage<WatermelonAuthPayload>("WM_AUTH", auth);
  }

  /**
   * Request remote to navigate to an internal route.
   */
  navigateTo(path: string): void {
    this.postMessage<WatermelonNavigateToPayload>("WM_NAVIGATE_TO", { path });
  }

  /**
   * Liveness ping check.
   */
  ping(): void {
    this.postMessage("WM_PING", {});
  }

  /**
   * Clean up event listener and tear down bridge.
   */
  destroy(): void {
    this.isDestroyed = true;
    if (typeof window !== "undefined") {
      window.removeEventListener("message", this.handleMessage);
    }
  }
}
