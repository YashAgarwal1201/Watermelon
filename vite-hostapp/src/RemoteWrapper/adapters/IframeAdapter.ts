// File: RemoteWrapper/adapters/IframeAdapter.ts

// ─── Iframe Adapter ───────────────────────────────────────────────────────────
// Mounts remotes hosted inside an isolated <iframe> (Next.js SSR, Vite SPA).
// Provides crash isolation, cross-origin security, and bidirectional postMessage
// communication via @watermelon/bridge (WatermelonBridgeHost).
// ──────────────────────────────────────────────────────────────────────────────

import type { RemoteAdapter, RemoteAdapterConfig } from "./BaseAdapter";
import { WatermelonBridgeHost } from "@watermelon/bridge";

export interface IframeConfig {
  url: string | (() => string);
  targetOrigin?: string;
  onEvent?: (eventType: string, detail: unknown) => void;
}

export class IframeAdapter implements RemoteAdapter {
  readonly strategy = "iframe" as const;

  private config: IframeConfig;
  private iframe: HTMLIFrameElement | null = null;
  private bridge: WatermelonBridgeHost | null = null;

  constructor(config: IframeConfig) {
    this.config = config;
  }

  async mount(adapterConfig: RemoteAdapterConfig): Promise<void> {
    const { mountPoint, appName, isCancelled = () => false } = adapterConfig;
    if (isCancelled()) return;

    const url =
      typeof this.config.url === "function"
        ? this.config.url()
        : this.config.url;

    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.style.cssText =
      "width:100%;height:100%;border:none;display:block;min-height:500px;transition:height 0.15s ease;";
    iframe.setAttribute("data-remote-iframe", appName);

    // Detect current host theme setting
    const isDark = document.documentElement.classList.contains("dark");

    this.bridge = new WatermelonBridgeHost({
      remoteId: appName,
      iframe,
      targetOrigin: this.config.targetOrigin ?? "*",
      onReady: () => {
        // Broadcast theme context to remote immediately upon handshake
        this.bridge?.sendTheme(isDark ? "dark" : "light");
      },
      onResize: (height) => {
        if (height > 0) {
          iframe.style.height = `${height}px`;
        }
      },
      onNavigate: (path) => {
        console.info(`[IframeAdapter:${appName}] Remote navigated internally to:`, path);
      },
      onError: (err) => {
        console.error(`[IframeAdapter:${appName}] Remote reported unhandled error:`, err);
      },
      onEvent: (eventType, detail) => {
        this.config.onEvent?.(eventType, detail);
      },
    });

    mountPoint.appendChild(iframe);
    this.iframe = iframe;
  }

  /**
   * Access the underlying WatermelonBridgeHost instance for host-initiated triggers.
   */
  getBridge(): WatermelonBridgeHost | null {
    return this.bridge;
  }

  unmount(): void {
    if (this.bridge) {
      try {
        this.bridge.destroy();
      } catch {}
      this.bridge = null;
    }
    if (this.iframe) {
      try {
        this.iframe.remove();
      } catch {}
      this.iframe = null;
    }
  }
}
