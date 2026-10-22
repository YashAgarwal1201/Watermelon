// File: RemoteWrapper/adapters/ModuleFederationAdapter.ts

// ─── Module Federation Adapter ────────────────────────────────────────────────
// Mounts remotes exposed via Module Federation (Vite and Webpack 5).
// Handles React, Vue 3, Svelte, and SolidJS lifecycle and unmounting.
// ──────────────────────────────────────────────────────────────────────────────

import type { RemoteAdapter, RemoteAdapterConfig } from "./BaseAdapter";
import { patchHeadToShadow, replayCssIntoShadow } from "../shadow";

function createReactErrorBoundary(React: any, appName: string) {
  return class RemoteErrorBoundary extends React.Component {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }
    componentDidCatch(error: Error, errorInfo: any) {
      console.error(`[RemoteErrorBoundary:${appName}] Render error:`, error, errorInfo);
    }
    render() {
      if ((this.state as any).hasError) {
        return React.createElement(
          "div",
          {
            style: {
              padding: "1.25rem",
              margin: "1rem",
              borderRadius: "0.75rem",
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              fontFamily: "system-ui, sans-serif",
            },
          },
          React.createElement(
            "h3",
            { style: { color: "#dc2626", fontWeight: "bold", fontSize: "0.875rem", marginBottom: "0.25rem" } },
            `Component Error in ${appName}`,
          ),
          React.createElement(
            "p",
            { style: { color: "#4b5563", fontSize: "0.75rem", marginBottom: "0.5rem" } },
            (this.state as any).error?.message || "An unhandled render exception occurred in this remote.",
          ),
          React.createElement(
            "button",
            {
              style: {
                padding: "0.25rem 0.5rem",
                backgroundColor: "#dc2626",
                color: "#ffffff",
                borderRadius: "0.25rem",
                border: "none",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
              },
              onClick: () => this.setState({ hasError: false, error: null }),
            },
            "Retry Component",
          ),
        );
      }
      return (this.props as any).children;
    }
  };
}

export class ModuleFederationAdapter implements RemoteAdapter {
  readonly strategy = "module-federation" as const;

  private vueAppInstance: any = null;
  private reactRoot: any = null;
  private svelteInstance: any = null;
  private solidDisposer: any = null;
  private lastRemoteModule: any = null;
  private restoreHeadPatch: (() => void) | null = null;

  async mount(config: RemoteAdapterConfig): Promise<void> {
    const {
      mountPoint,
      shadowRoot,
      appName,
      basename,
      eventBus,
      isCancelled = () => false,
    } = config;

    (window as any).BASENAME = basename;
    this.restoreHeadPatch = patchHeadToShadow(shadowRoot, appName, isCancelled);
    replayCssIntoShadow(appName, shadowRoot);

    this.lastRemoteModule = null;

    if (appName === "vite_react_remoteapp") {
      const module =
        await import("vite_react_remoteapp/ViteReactRemoteComponent");
      if (isCancelled()) return;
      this.lastRemoteModule = module;
      const [React, ReactDOM] = await Promise.all([
        import("react"),
        import("react-dom/client"),
      ]);
      if (isCancelled()) return;
      this.reactRoot = (ReactDOM as any).createRoot(mountPoint);
      const ErrorBoundary = createReactErrorBoundary(React, appName);
      this.reactRoot.render(
        React.createElement(
          ErrorBoundary as any,
          null,
          React.createElement(module.default, { basename, eventBus }),
        ),
      );
    } else if (appName === "vite_vue_remoteapp") {
      const module =
        await import("vite_vue_remoteapp/ViteVueRemoteComponent");
      if (isCancelled()) return;
      this.lastRemoteModule = module;
      if (typeof module.mount === "function") {
        const result = await module.mount(mountPoint, {
          basename,
          memory: false,
          eventBus,
        });
        this.vueAppInstance = result?.app ?? result ?? null;
      } else {
        const { createApp } = await import("vue");
        this.vueAppInstance = (createApp as any)(module.default, { basename, eventBus });
        if (this.vueAppInstance?.provide && eventBus) {
          this.vueAppInstance.provide("eventBus", eventBus);
        }
        if (this.vueAppInstance?.config) {
          this.vueAppInstance.config.errorHandler = (err: unknown, _inst: unknown, info: string) => {
            console.error(`[VueRemoteErrorHandler:${appName}] Error in ${info}:`, err);
          };
        }
        this.vueAppInstance.mount(mountPoint);
      }
    } else if (appName === "vite_svelte_remoteapp") {
      const module =
        await import("vite_svelte_remoteapp/ViteSvelteRemoteComponent");
      if (isCancelled()) return;
      this.lastRemoteModule = module;
      if (typeof module.mount === "function") {
        this.svelteInstance = module.mount(mountPoint, {
          props: { basename },
        });
      } else {
        this.svelteInstance = new module.default({
          target: mountPoint,
          props: { basename },
        });
      }
    } else if (appName === "vite_solidjs_remoteapp") {
      const module =
        await import("vite_solidjs_remoteapp/ViteSolidRemoteComponent");
      if (isCancelled()) return;
      this.lastRemoteModule = module;
      const { render } = await import("solid-js/web");
      this.solidDisposer = render(() => (module.default as any)({ basename, eventBus }), mountPoint);
    } else if (appName === "webpack_react_remoteapp") {
      const module =
        await import("webpack_react_remoteapp/WebpackReactRemoteComponent");
      if (isCancelled()) return;
      this.lastRemoteModule = module;
      const [React, ReactDOM] = await Promise.all([
        import("react"),
        import("react-dom/client"),
      ]);
      if (isCancelled()) return;
      this.reactRoot = (ReactDOM as any).createRoot(mountPoint);
      const ErrorBoundary = createReactErrorBoundary(React, appName);
      this.reactRoot.render(
        React.createElement(
          ErrorBoundary as any,
          null,
          React.createElement(module.default, { basename, eventBus }),
        ),
      );
    } else if (appName === "webpack_vue_remoteapp") {
      const module =
        await import("webpack_vue_remoteapp/WebpackVueRemoteComponent");
      if (isCancelled()) return;
      this.lastRemoteModule = module;
      if (typeof module.mount === "function") {
        const result = await module.mount(mountPoint, { basename, eventBus });
        this.vueAppInstance = result?.app ?? result ?? null;
      } else {
        try {
          this.vueAppInstance = module.default(mountPoint, { basename, eventBus }) ?? null;
        } catch {
          const { createApp } = await import("vue");
          this.vueAppInstance = (createApp as any)(module.default, { basename, eventBus });
          if (this.vueAppInstance?.provide && eventBus) {
            this.vueAppInstance.provide("eventBus", eventBus);
          }
          if (this.vueAppInstance?.config) {
            this.vueAppInstance.config.errorHandler = (err: unknown, _inst: unknown, info: string) => {
              console.error(`[VueRemoteErrorHandler:${appName}] Error in ${info}:`, err);
            };
          }
          this.vueAppInstance.mount(mountPoint);
        }
      }
    } else {
      // Generic federation fallback: if remote implements standard mount() lifecycle
      try {
        const module: any = await import(/* @vite-ignore */ appName);
        if (isCancelled()) return;
        this.lastRemoteModule = module;
        if (typeof module.mount === "function") {
          const result = await module.mount(mountPoint, {
            basename,
            memory: false,
            eventBus,
          });
          if (result && typeof result.unmount === "function") {
            this.lastRemoteModule = result;
          }
          return;
        }
      } catch (err) {
        console.warn(`[ModuleFederationAdapter] Generic mount fallback failed for "${appName}":`, err);
      }
      throw new Error(`Unknown Module Federation remote: ${appName}`);
    }
  }

  unmount(): void {
    try {
      this.lastRemoteModule?.unmount?.();
    } catch {}
    try {
      if (this.vueAppInstance?.unmount) {
        this.vueAppInstance.unmount();
        this.vueAppInstance = null;
      }
    } catch {}
    try {
      if (this.reactRoot?.unmount) {
        this.reactRoot.unmount();
        this.reactRoot = null;
      }
    } catch {}
    try {
      if (this.svelteInstance) {
        (this.svelteInstance.unmount ?? this.svelteInstance.$destroy)?.call(
          this.svelteInstance,
        );
        this.svelteInstance = null;
      }
    } catch {}
    try {
      if (typeof this.solidDisposer === "function") {
        this.solidDisposer();
        this.solidDisposer = null;
      }
    } catch {}
    if (this.restoreHeadPatch) {
      try {
        this.restoreHeadPatch();
      } catch {}
      this.restoreHeadPatch = null;
    }
    this.lastRemoteModule = null;
  }
}
