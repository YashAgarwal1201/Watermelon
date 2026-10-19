// File: RemoteWrapper/adapters/WebComponentAdapter.ts

// ─── Web Component Adapter ────────────────────────────────────────────────────
// Mounts remotes exposed as W3C Custom Elements (Angular, Lit, Vue CE).
// Handles dynamic script loading, registration waiting, shadow DOM mounting,
// attribute forwarding, and clean unmounting.
// ──────────────────────────────────────────────────────────────────────────────

import type { RemoteAdapter, RemoteAdapterConfig } from "./BaseAdapter";
import { patchHeadToShadow, replayCssIntoShadow } from "../shadow";

export interface WebComponentConfig {
  tag: string;
  scriptUrl?: string | (() => string);
  attributes?: Record<string, string>;
}

export class WebComponentAdapter implements RemoteAdapter {
  readonly strategy = "web-component" as const;

  private config: WebComponentConfig;
  private element: HTMLElement | null = null;
  private restoreHeadPatch: (() => void) | null = null;

  constructor(config: WebComponentConfig) {
    this.config = config;
  }

  async mount(adapterConfig: RemoteAdapterConfig): Promise<void> {
    const {
      mountPoint,
      shadowRoot,
      appName,
      isCancelled = () => false,
    } = adapterConfig;

    this.restoreHeadPatch = patchHeadToShadow(shadowRoot, appName, isCancelled);
    replayCssIntoShadow(appName, shadowRoot);

    const tag = this.config.tag;

    // If custom element is already registered, mount directly
    if (customElements.get(tag)) {
      if (isCancelled()) return;
      const el = document.createElement(tag);
      const isDark = document.documentElement.classList.contains("dark");
      el.setAttribute("theme", isDark ? "dark" : "light");
      if (this.config.attributes) {
        for (const [key, val] of Object.entries(this.config.attributes)) {
          el.setAttribute(key, val);
        }
      }
      el.addEventListener("wm-signout", (e: any) => {
        console.info(`[WebComponentAdapter:${appName}] wm-signout caught:`, e.detail);
      });
      mountPoint.appendChild(el);
      this.element = el;
      return;
    }

    const scriptUrl =
      typeof this.config.scriptUrl === "function"
        ? this.config.scriptUrl()
        : this.config.scriptUrl;

    if (!scriptUrl) {
      throw new Error(
        `Web component <${tag}> is not registered and no scriptUrl was provided.`,
      );
    }

    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = scriptUrl;
      script.type = "module";
      script.onload = async () => {
        if (isCancelled()) {
          resolve();
          return;
        }
        // Give the web component runtime a tick to register the custom element
        await new Promise((r) => setTimeout(r, 50));
        if (isCancelled()) {
          resolve();
          return;
        }
        const el = document.createElement(tag);
        const isDark = document.documentElement.classList.contains("dark");
        el.setAttribute("theme", isDark ? "dark" : "light");
        if (this.config.attributes) {
          for (const [key, val] of Object.entries(this.config.attributes)) {
            el.setAttribute(key, val);
          }
        }
        el.addEventListener("wm-signout", (e: any) => {
          console.info(`[WebComponentAdapter:${appName}] wm-signout caught:`, e.detail);
        });
        mountPoint.appendChild(el);
        this.element = el;
        resolve();
      };
      script.onerror = (_e) =>
        reject(new Error(`Failed to load Web Component script from ${scriptUrl}`));
      document.head.appendChild(script);
    });
  }

  unmount(): void {
    if (this.element) {
      try {
        this.element.remove();
      } catch {}
      this.element = null;
    }
    if (this.restoreHeadPatch) {
      try {
        this.restoreHeadPatch();
      } catch {}
      this.restoreHeadPatch = null;
    }
  }
}
