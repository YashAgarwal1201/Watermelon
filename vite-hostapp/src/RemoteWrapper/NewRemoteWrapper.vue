<template>
  <div class="remote-wrapper w-full h-full p-2">
    <div
      v-if="isLoading"
      class="p-4 bg-blue-100 text-blue-800 rounded mb-4 flex items-center space-x-2"
    >
      <svg
        class="animate-spin h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
        <path d="M22 12a10 10 0 0 1-10 10" />
      </svg>
      <span>Loading...</span>
    </div>

    <div v-if="error" class="p-4 bg-red-100 text-red-800 rounded mb-4">
      <p>Error loading remote app: {{ error }}</p>
      <button
        @click="retryLoad"
        class="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Retry
      </button>
    </div>

    <div
      ref="hostContainer"
      class="remote-container rounded-none md:rounded-lg"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const appName = ref(String(route.params.appName ?? ""));

const hostContainer = ref<HTMLElement | null>(null);
let shadowRoot: ShadowRoot | null = null;
let mountPoint: HTMLElement | null = null;

const isLoading = ref(false);
const error = ref<string | null>(null);

let vueAppInstance: any = null;
let reactRoot: any = null;
let svelteInstance: any = null;
let solidDisposer: any = null;
let lastRemoteModule: any = null;
let restoreHeadPatch: (() => void) | null = null;

// ─── Per-remote CSS text cache ────────────────────────────────────────────────
// On first load the head-patch captures every style/link that the remote's
// module-evaluation side-effects inject. On every subsequent navigation we
// replay that captured text directly into the freshly-wiped shadow, because
// the browser module cache means the injection side-effects never fire again.
const cssCache = new Map<string, string[]>();

// ─── load-id cancellation guard ───────────────────────────────────────────────
let loadId = 0;

// ─── isStyleOrLink ────────────────────────────────────────────────────────────
function isStyleOrLink(node: Node): boolean {
  if (!(node instanceof HTMLElement)) return false;
  const t = node.tagName.toLowerCase();
  return (
    t === "style" ||
    (t === "link" && (node as HTMLLinkElement).rel === "stylesheet")
  );
}

// ─── patchHeadToShadow ────────────────────────────────────────────────────────
// Intercepts ALL four DOM insertion methods on document.head for the duration
// of a single remote load, redirecting style/link nodes into the shadow instead.
// Returns a cleanup function that restores the originals.
function patchHeadToShadow(
  shadow: ShadowRoot,
  capturedId: number,
  remoteName: string,
): () => void {
  const head = document.head as any;
  const origAppendChild = head.appendChild.bind(head);
  const origInsertBefore = head.insertBefore.bind(head);
  const origAppend = head.append?.bind(head);
  const origPrepend = head.prepend?.bind(head);

  const isCancelled = () => capturedId !== loadId;

  if (!cssCache.has(remoteName)) cssCache.set(remoteName, []);
  const bucket = cssCache.get(remoteName)!;

  async function fetchAndInject(href: string) {
    try {
      const res = await fetch(href, { mode: "cors", cache: "force-cache" });
      if (!res.ok) return;
      const css = await res.text();
      if (isCancelled()) return;
      const s = document.createElement("style");
      s.setAttribute("data-remote-src", href);
      s.textContent = css;
      shadow.appendChild(s);
      if (!bucket.includes(css)) bucket.push(css);
    } catch {}
  }

  function intercept(node: Node): boolean {
    if (!isStyleOrLink(node)) return false;
    if (isCancelled()) return false;

    if (node instanceof HTMLElement && node.tagName.toLowerCase() === "style") {
      const css = node.textContent ?? "";
      const clone = document.createElement("style");
      clone.setAttribute("data-remote-css", remoteName);
      clone.textContent = css;
      shadow.appendChild(clone);
      // Keep clone in sync if the original is mutated (e.g. HMR)
      new MutationObserver(() => {
        clone.textContent = node.textContent;
      }).observe(node, { characterData: true, childList: true, subtree: true });
      if (!bucket.includes(css)) bucket.push(css);
      return true;
    }

    if (node instanceof HTMLLinkElement && node.rel === "stylesheet") {
      void fetchAndInject(node.href);
      return true;
    }

    return false;
  }

  head.appendChild = function <T extends Node>(node: T): T {
    if (intercept(node)) return node;
    return origAppendChild(node);
  };

  head.insertBefore = function <T extends Node>(node: T, ref: Node | null): T {
    if (intercept(node)) return node;
    return origInsertBefore(node, ref);
  };

  if (origAppend) {
    head.append = function (...nodes: (Node | string)[]) {
      for (const n of nodes) {
        if (typeof n !== "string" && intercept(n)) continue;
        origAppend(n);
      }
    };
  }

  if (origPrepend) {
    head.prepend = function (...nodes: (Node | string)[]) {
      for (const n of nodes) {
        if (typeof n !== "string" && intercept(n)) continue;
        origPrepend(n);
      }
    };
  }

  // Safety-net: some runtimes bypass the methods above and mutate the DOM
  // directly (e.g. innerHTML assignment, adoptedStyleSheets). Catch those too.
  const mo = new MutationObserver((records) => {
    for (const r of records)
      for (const n of Array.from(r.addedNodes))
        if (isStyleOrLink(n)) intercept(n);
  });
  mo.observe(document.head, { childList: true });

  return () => {
    mo.disconnect();
    head.appendChild = origAppendChild;
    head.insertBefore = origInsertBefore;
    if (origAppend) head.append = origAppend;
    if (origPrepend) head.prepend = origPrepend;
  };
}

// ─── replayCssIntoShadow ──────────────────────────────────────────────────────
// On navigations after the first, the module is cached and its style-injection
// side-effects won't re-run. We replay what we captured the first time.
function replayCssIntoShadow(remoteName: string, shadow: ShadowRoot) {
  const bucket = cssCache.get(remoteName);
  if (!bucket?.length) return;
  for (const css of bucket) {
    const s = document.createElement("style");
    s.setAttribute("data-remote-css-replay", remoteName);
    s.textContent = css;
    shadow.appendChild(s);
  }
}

// ─── buildShadow ─────────────────────────────────────────────────────────────
// Wipes and reconstructs the shadow DOM, forwarding host CSS variables.
function buildShadow(): { shadow: ShadowRoot; mount: HTMLElement } {
  if (shadowRoot) {
    while (shadowRoot.firstChild) shadowRoot.removeChild(shadowRoot.firstChild);
  } else {
    shadowRoot = hostContainer.value!.attachShadow({ mode: "open" });
  }

  // Forward all CSS custom properties from the host into :host so remotes
  // that use host design tokens still resolve them correctly.
  try {
    const computed = getComputedStyle(document.documentElement);
    let vars = ":host{";
    for (let i = 0; i < computed.length; i++) {
      const p = computed[i];
      if (p?.startsWith("--")) vars += `${p}:${computed.getPropertyValue(p)};`;
    }
    vars += "}";
    const varStyle = document.createElement("style");
    varStyle.textContent = vars;
    shadowRoot.appendChild(varStyle);
  } catch {}

  const mount = document.createElement("div");
  mount.style.cssText = "width:100%;height:100%;display:contents;";
  mount.setAttribute("data-remote-mount", appName.value || "");
  shadowRoot.appendChild(mount);

  return { shadow: shadowRoot, mount };
}

// ─── loadRemote ───────────────────────────────────────────────────────────────
async function loadRemote() {
  error.value = null;
  if (!hostContainer.value) return;

  // Cancel any in-flight async continuations from a previous navigation
  const currentId = ++loadId;

  // Always tear down the previous patch first — never have two patches live
  if (restoreHeadPatch) {
    restoreHeadPatch();
    restoreHeadPatch = null;
  }

  // Rebuild shadow
  const { shadow, mount } = buildShadow();
  mountPoint = mount;

  isLoading.value = true;

  // ── CRITICAL ORDER ─────────────────────────────────────────────────────────
  // 1. Install the head patch BEFORE import() so that any synchronous or
  //    microtask-level style injection that fires during module evaluation
  //    is captured and redirected into our fresh shadow.
  restoreHeadPatch = patchHeadToShadow(shadow, currentId, appName.value);

  // 2. If this remote was loaded before, the browser module cache means the
  //    injection side-effects won't fire again. Replay what we captured.
  //    Do this AFTER installing the patch (not before) so that if for some
  //    reason the module DOES re-inject (e.g. dev mode), we don't double-add.
  replayCssIntoShadow(appName.value, shadow);

  try {
    (window as any).BASENAME = `/remote/${appName.value}`;
    lastRemoteModule = null;

    if (appName.value === "vite_react_remoteapp") {
      const module =
        await import("vite_react_remoteapp/ViteReactRemoteComponent");

      console.log(
        "[diag] styles in document.head after import:",
        Array.from(
          document.head.querySelectorAll(
            "style[data-remote-css], style[data-remote-css-replay]",
          ),
        ).length,
      );
      console.log(
        "[diag] styles in shadow after import:",
        shadowRoot
          ? Array.from(shadowRoot.querySelectorAll("style")).length
          : "no shadow",
      );
      console.log(
        "[diag] cssCache bucket:",
        cssCache.get("vite_react_remoteapp")?.length ?? 0,
      );

      if (currentId !== loadId) return; // navigated away while loading
      lastRemoteModule = module;
      const [React, ReactDOM] = await Promise.all([
        import("react"),
        import("react-dom/client"),
      ]);
      if (currentId !== loadId) return;
      reactRoot = (ReactDOM as any).createRoot(mountPoint!);
      reactRoot.render(React.createElement(module.default));
    } else if (appName.value === "vite_vue_remoteapp") {
      const module = await import("vite_vue_remoteapp/ViteVueRemoteComponent");
      if (currentId !== loadId) return;
      lastRemoteModule = module;
      if (typeof module.mount === "function") {
        const result = await module.mount(mountPoint!, {
          basename: (window as any).BASENAME,
          memory: false,
        });
        vueAppInstance = result?.app ?? result ?? null;
      } else {
        const { createApp } = await import("vue");
        vueAppInstance = (createApp as any)(module.default);
        vueAppInstance.mount(mountPoint);
      }
    } else if (appName.value === "vite_svelte_remoteapp") {
      const module =
        await import("vite_svelte_remoteapp/ViteSvelteRemoteComponent");
      if (currentId !== loadId) return;
      lastRemoteModule = module;
      if (typeof module.mount === "function") {
        svelteInstance = module.mount(mountPoint!, {
          props: { basename: (window as any).BASENAME },
        });
      } else {
        svelteInstance = new module.default({
          target: mountPoint!,
          props: { basename: (window as any).BASENAME },
        });
      }
    } else if (appName.value === "vite_solidjs_remoteapp") {
      const module =
        await import("vite_solidjs_remoteapp/ViteSolidRemoteComponent");
      if (currentId !== loadId) return;
      lastRemoteModule = module;
      const { render } = await import("solid-js/web");
      solidDisposer = render(() => (module.default as any)(), mountPoint!);
    } else if (appName.value === "webpack_react_remoteapp") {
      const module =
        await import("webpack_react_remoteapp/WebpackReactRemoteComponent");
      if (currentId !== loadId) return;
      lastRemoteModule = module;
      const [React, ReactDOM] = await Promise.all([
        import("react"),
        import("react-dom/client"),
      ]);
      if (currentId !== loadId) return;
      reactRoot = (ReactDOM as any).createRoot(mountPoint!);
      reactRoot.render(React.createElement(module.default));
    } else if (appName.value === "webpack_vue_remoteapp") {
      const module =
        await import("webpack_vue_remoteapp/WebpackVueRemoteComponent");
      if (currentId !== loadId) return;
      lastRemoteModule = module;
      if (typeof module.mount === "function") {
        const result = await module.mount(mountPoint!);
        vueAppInstance = result?.app ?? result ?? null;
      } else {
        try {
          vueAppInstance = module.default(mountPoint) ?? null;
        } catch {
          const { createApp } = await import("vue");
          vueAppInstance = (createApp as any)(module.default);
          vueAppInstance.mount(mountPoint);
        }
      }
    } else if (appName.value === "angular_remoteapp") {
      const module = await import("angular_remoteapp/Component");
      if (currentId !== loadId) return;
      lastRemoteModule = module;
      if (typeof module.mount !== "function")
        throw new Error("Angular remote does not export a mount function");
      const result = await module.mount(mountPoint!);
      if (result?.destroy) lastRemoteModule.unmount = result.destroy;
    } else {
      throw new Error(`Unknown remote app: ${appName.value}`);
    }

    console.info(`[RemoteWrapper] "${appName.value}" loaded OK`);
  } catch (e: any) {
    if (currentId !== loadId) return; // stale — ignore
    console.error(`[RemoteWrapper] Failed to load "${appName.value}"`, e);
    error.value = e?.message ?? String(e);
  } finally {
    if (currentId === loadId) isLoading.value = false;
  }
}

// ─── cleanup ──────────────────────────────────────────────────────────────────
function cleanup() {
  try {
    lastRemoteModule?.unmount?.();
  } catch {}
  try {
    if (vueAppInstance?.unmount) {
      vueAppInstance.unmount();
      vueAppInstance = null;
    }
  } catch {}
  try {
    if (reactRoot?.unmount) {
      reactRoot.unmount();
      reactRoot = null;
    }
  } catch {}
  try {
    if (svelteInstance) {
      (svelteInstance.unmount ?? svelteInstance.$destroy)?.call(svelteInstance);
      svelteInstance = null;
    }
  } catch {}
  try {
    if (typeof solidDisposer === "function") {
      solidDisposer();
      solidDisposer = null;
    }
  } catch {}
  if (mountPoint) mountPoint.innerHTML = "";
  if (restoreHeadPatch) {
    restoreHeadPatch();
    restoreHeadPatch = null;
  }
  lastRemoteModule = null;
}

async function retryLoad() {
  cleanup();
  await nextTick();
  await loadRemote();
}

onMounted(() => {
  if (hostContainer.value) void loadRemote();
});
onBeforeUnmount(() => {
  cleanup();
});

watch(
  () => route.params.appName,
  async (newVal, oldVal) => {
    if (String(newVal) !== String(oldVal)) {
      appName.value = String(newVal || "");
      await retryLoad();
    }
  },
);
</script>

<style scoped>
.remote-container {
  flex-grow: 1;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
