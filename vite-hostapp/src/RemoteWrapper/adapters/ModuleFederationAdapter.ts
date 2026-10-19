// File: RemoteWrapper/adapters/ModuleFederationAdapter.ts

// ─── Module Federation Adapter ────────────────────────────────────────────────
// Mounts remotes exposed via Module Federation (Vite and Webpack 5).
// Handles React, Vue 3, Svelte, and SolidJS lifecycle and unmounting.
// ──────────────────────────────────────────────────────────────────────────────

import type { RemoteAdapter, RemoteAdapterConfig } from "./BaseAdapter";
import { patchHeadToShadow, replayCssIntoShadow } from "../shadow";

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
      this.reactRoot.render(React.createElement(module.default));
    } else if (appName === "vite_vue_remoteapp") {
      const module =
        await import("vite_vue_remoteapp/ViteVueRemoteComponent");
      if (isCancelled()) return;
      this.lastRemoteModule = module;
      if (typeof module.mount === "function") {
        const result = await module.mount(mountPoint, {
          basename,
          memory: false,
        });
        this.vueAppInstance = result?.app ?? result ?? null;
      } else {
        const { createApp } = await import("vue");
        this.vueAppInstance = (createApp as any)(module.default);
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
      this.solidDisposer = render(() => (module.default as any)(), mountPoint);
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
      this.reactRoot.render(React.createElement(module.default));
    } else if (appName === "webpack_vue_remoteapp") {
      const module =
        await import("webpack_vue_remoteapp/WebpackVueRemoteComponent");
      if (isCancelled()) return;
      this.lastRemoteModule = module;
      if (typeof module.mount === "function") {
        const result = await module.mount(mountPoint);
        this.vueAppInstance = result?.app ?? result ?? null;
      } else {
        try {
          this.vueAppInstance = module.default(mountPoint) ?? null;
        } catch {
          const { createApp } = await import("vue");
          this.vueAppInstance = (createApp as any)(module.default);
          this.vueAppInstance.mount(mountPoint);
        }
      }
    } else {
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
