// File: RemoteWrapper/adapters/WebComponentAdapter.ts

// ─── Web Component Adapter ────────────────────────────────────────────────────
// Mounts remotes exposed as W3C Custom Elements (Angular, Lit, Vue CE).
// Handles dynamic script loading, registration waiting, shadow DOM mounting,
// attribute forwarding, and clean unmounting.
// ──────────────────────────────────────────────────────────────────────────────

import type { RemoteAdapter, RemoteAdapterConfig } from "./BaseAdapter";
import type { EventBus } from "../../services/eventBus";
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
  private eventUnsub: (() => void) | null = null;

  constructor(config: WebComponentConfig) {
    this.config = config;
  }

  private setupElement(
    el: HTMLElement,
    appName: string,
    eventBus?: EventBus,
  ): void {
    const isDark = document.documentElement.classList.contains("dark");
    el.setAttribute("theme", isDark ? "dark" : "light");
    if (this.config.attributes) {
      for (const [key, val] of Object.entries(this.config.attributes)) {
        el.setAttribute(key, val);
      }
    }
    el.addEventListener("wm-signout", (e: any) => {
      console.info(`[WebComponentAdapter:${appName}] wm-signout caught:`, e.detail);
      eventBus?.emit("wm:signout", e.detail);
    });
    el.addEventListener("wm-badge-count", (e: any) => {
      eventBus?.emit("wm:badge-count", e.detail);
    });
    el.addEventListener("wm-event", (e: any) => {
      eventBus?.emit(e.detail?.type || "wm:event", e.detail);
    });

    if (eventBus) {
      this.eventUnsub = eventBus.on("wm:theme", (payload: any) => {
        if (payload?.theme) {
          el.setAttribute("theme", payload.theme);
        }
      });
    }
  }

  async mount(adapterConfig: RemoteAdapterConfig): Promise<void> {
    const {
      mountPoint,
      shadowRoot,
      appName,
      eventBus,
      isCancelled = () => false,
    } = adapterConfig;

    this.restoreHeadPatch = patchHeadToShadow(shadowRoot, appName, isCancelled);
    replayCssIntoShadow(appName, shadowRoot);

    const tag = this.config.tag;

    // If custom element is already registered, mount directly
    if (customElements.get(tag)) {
      if (isCancelled()) return;
      const el = document.createElement(tag);
      this.setupElement(el, appName, eventBus);
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
        // Deterministically wait for custom element registration with safety timeout
        try {
          await Promise.race([
            customElements.whenDefined(tag),
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error(`Timeout waiting for custom element <${tag}> definition`)),
                5000,
              ),
            ),
          ]);
        } catch (err) {
          console.warn(`[WebComponentAdapter:${appName}] customElements.whenDefined:`, err);
        }
        if (isCancelled()) {
          resolve();
          return;
        }
        const el = document.createElement(tag);
        this.setupElement(el, appName, eventBus);
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
    if (this.eventUnsub) {
      try {
        this.eventUnsub();
      } catch {}
      this.eventUnsub = null;
    }
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
