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

// ─── CSS cache ────────────────────────────────────────────────────────────────
// Keyed by appName. Populated on first load when the module's side-effect
// style injections actually fire. Replayed on every subsequent load because
// the module is cached and won't re-inject on its own.
const cssCache = new Map<string, string[]>();

// ─── load-id guard ────────────────────────────────────────────────────────────
// Prevents a slow async load from writing into a shadow that has already been
// replaced by a newer navigation.
let loadId = 0;

// ─── patchHeadToShadow ────────────────────────────────────────────────────────
function patchHeadToShadow(
  shadow: ShadowRoot,
  capturedId: number,
  remoteName: string,
) {
  const docHead = document.head as any;

  const orig = {
    appendChild: docHead.appendChild as Function,
    insertBefore: docHead.insertBefore as Function,
    append: (docHead.append as Function | undefined)?.bind(docHead),
    prepend: (docHead.prepend as Function | undefined)?.bind(docHead),
  };

  const isCancelled = () => capturedId !== loadId;

  const movedSet = new Set<Node>();

  // Initialise the cache bucket for this remote if not yet present.
  if (!cssCache.has(remoteName)) cssCache.set(remoteName, []);
  const bucket = cssCache.get(remoteName)!;

  async function fetchCssText(href: string): Promise<string | null> {
    try {
      const res = await fetch(href, { mode: "cors" });
      if (!res.ok) throw new Error("fetch failed");
      return await res.text();
    } catch {
      return null;
    }
  }

  async function moveToShadow(node: Node) {
    if (!(node instanceof HTMLElement)) return;
    if (movedSet.has(node)) return;
    if (isCancelled()) return;
    movedSet.add(node);

    const tag = node.tagName.toLowerCase();

    if (tag === "style") {
      if (isCancelled()) return;
      const cssText = node.textContent ?? "";
      const clone = document.createElement("style");
      clone.textContent = cssText;
      shadow.appendChild(clone);
      bucket.push(cssText); // cache for future navigations

      const mo = new MutationObserver(() => {
        if (!isCancelled()) clone.textContent = node.textContent;
      });
      mo.observe(node, { characterData: true, childList: true, subtree: true });
      return;
    }

    if (tag === "link" && (node as HTMLLinkElement).rel === "stylesheet") {
      const css = await fetchCssText((node as HTMLLinkElement).href);
      if (isCancelled()) return;
      if (css !== null) {
        const s = document.createElement("style");
        s.textContent = css;
        shadow.appendChild(s);
        bucket.push(css); // cache for future navigations
      } else {
        orig.appendChild.call(docHead, node);
      }
      return;
    }

    orig.appendChild.call(docHead, node);
  }

  // Intercept all four head insertion paths
  docHead.appendChild = function (node: Node) {
    if (isStyleOrLink(node)) {
      void moveToShadow(node);
      return node;
    }
    return orig.appendChild.call(this, node);
  };

  docHead.insertBefore = function (node: Node, ref: Node | null) {
    if (isStyleOrLink(node)) {
      void moveToShadow(node);
      return node;
    }
    return orig.insertBefore.call(this, node, ref);
  };

  if (orig.append) {
    docHead.append = function (...nodes: any[]) {
      for (const n of nodes)
        isStyleOrLink(n) ? void moveToShadow(n) : orig.append!.call(docHead, n);
    };
  }

  if (orig.prepend) {
    docHead.prepend = function (...nodes: any[]) {
      for (const n of nodes)
        isStyleOrLink(n)
          ? void moveToShadow(n)
          : orig.prepend!.call(docHead, n);
    };
  }

  // Safety-net MutationObserver for anything that bypasses the patched methods
  const headObserver = new MutationObserver((mutations) => {
    for (const m of mutations)
      for (const n of Array.from(m.addedNodes))
        if (isStyleOrLink(n)) void moveToShadow(n);
  });
  headObserver.observe(docHead, { childList: true });

  return () => {
    headObserver.disconnect();
    docHead.appendChild = orig.appendChild;
    docHead.insertBefore = orig.insertBefore;
    if (orig.append) docHead.append = orig.append;
    if (orig.prepend) docHead.prepend = orig.prepend;
    movedSet.clear();
  };
}

function isStyleOrLink(node: Node): boolean {
  if (!(node instanceof HTMLElement)) return false;
  const tag = node.tagName.toLowerCase();
  return (
    tag === "style" ||
    (tag === "link" && (node as HTMLLinkElement).rel === "stylesheet")
  );
}

// Replay cached CSS for a remote whose module won't re-inject on second load
function replayCachedCss(remoteName: string, shadow: ShadowRoot) {
  const bucket = cssCache.get(remoteName);
  if (!bucket || bucket.length === 0) return;
  for (const cssText of bucket) {
    const s = document.createElement("style");
    s.textContent = cssText;
    shadow.appendChild(s);
  }
}

// ─── loadRemote ───────────────────────────────────────────────────────────────
async function loadRemote() {
  error.value = null;
  if (!hostContainer.value) return;

  // Invalidate any in-flight async continuation from a previous navigation
  const currentId = ++loadId;

  // Tear down previous patch before touching the shadow
  if (restoreHeadPatch) {
    restoreHeadPatch();
    restoreHeadPatch = null;
  }

  // Wipe and rebuild shadow
  if (shadowRoot) {
    while (shadowRoot.firstChild) shadowRoot.removeChild(shadowRoot.firstChild);
  } else {
    shadowRoot = hostContainer.value.attachShadow({ mode: "open" });
  }

  mountPoint = document.createElement("div");
  mountPoint.setAttribute("data-remote-mount", appName.value || "");
  shadowRoot.appendChild(mountPoint);

  // Forward host CSS custom properties into the shadow
  try {
    const rootStyles = getComputedStyle(document.documentElement);
    let vars = ":host{";
    for (let i = 0; i < rootStyles.length; i++) {
      const prop = rootStyles[i];
      if (prop?.startsWith("--"))
        vars += `${prop}:${rootStyles.getPropertyValue(prop)};`;
    }
    vars += "}";
    const cssVarsNode = document.createElement("style");
    cssVarsNode.textContent = vars;
    shadowRoot.insertBefore(cssVarsNode, mountPoint);
  } catch {}

  isLoading.value = true;
  mountPoint.innerHTML = "";

  // ── KEY FIX: Install the head patch BEFORE any import() call ──────────────
  // cssInjectedByJsPlugin and style-loader both fire synchronously during
  // module evaluation. If the patch isn't live before the import resolves,
  // those injections hit document.head instead of the shadow.
  restoreHeadPatch = patchHeadToShadow(shadowRoot, currentId, appName.value);

  // If this remote has been loaded before, its module is cached and won't
  // re-inject styles — replay what we captured on the first visit.
  replayCachedCss(appName.value, shadowRoot);

  try {
    (window as any).BASENAME = `/remote/${appName.value}`;
    lastRemoteModule = null;

    if (appName.value === "vite_react_remoteapp") {
      const module =
        await import("vite_react_remoteapp/ViteReactRemoteComponent");
      lastRemoteModule = module;
      const component = module.default;
      const [React, ReactDOM] = await Promise.all([
        import("react"),
        import("react-dom/client"),
      ]);
      reactRoot = (ReactDOM as any).createRoot(mountPoint!);
      reactRoot.render(React.createElement(component));
    } else if (appName.value === "vite_vue_remoteapp") {
      const module = await import("vite_vue_remoteapp/ViteVueRemoteComponent");
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
      lastRemoteModule = module;
      if (typeof module.mount === "function") {
        svelteInstance = module.mount(mountPoint!, {
          props: { basename: (window as any).BASENAME },
        });
      } else {
        const SvelteComponent = module.default;
        svelteInstance = new SvelteComponent({
          target: mountPoint!,
          props: { basename: (window as any).BASENAME },
        });
      }
    } else if (appName.value === "vite_solidjs_remoteapp") {
      const module =
        await import("vite_solidjs_remoteapp/ViteSolidRemoteComponent");
      lastRemoteModule = module;
      const SolidComponent = module.default;
      const { render } = await import("solid-js/web");
      solidDisposer = render(() => (SolidComponent as any)(), mountPoint!);
    } else if (appName.value === "webpack_react_remoteapp") {
      const module =
        await import("webpack_react_remoteapp/WebpackReactRemoteComponent");
      lastRemoteModule = module;
      const component = module.default;
      const [React, ReactDOM] = await Promise.all([
        import("react"),
        import("react-dom/client"),
      ]);
      reactRoot = (ReactDOM as any).createRoot(mountPoint!);
      reactRoot.render(React.createElement(component));
    } else if (appName.value === "webpack_vue_remoteapp") {
      const module =
        await import("webpack_vue_remoteapp/WebpackVueRemoteComponent");
      lastRemoteModule = module;
      if (typeof module.mount === "function") {
        const result = await module.mount(mountPoint!);
        vueAppInstance = result?.app ?? result ?? null;
      } else if (
        typeof module.default === "function" ||
        typeof module.default === "object"
      ) {
        try {
          const maybeReturned = module.default(mountPoint);
          vueAppInstance = maybeReturned ?? null;
        } catch {
          const { createApp } = await import("vue");
          vueAppInstance = (createApp as any)(module.default);
          vueAppInstance.mount(mountPoint);
        }
      } else {
        throw new Error(
          "Cannot bootstrap webpack_vue_remoteapp: no mount or usable default export",
        );
      }
    } else if (appName.value === "angular_remoteapp") {
      const module = await import("angular_remoteapp/Component");
      lastRemoteModule = module;
      if (typeof module.mount === "function") {
        const result = await module.mount(mountPoint!);
        if (result && typeof result.destroy === "function") {
          lastRemoteModule.unmount = result.destroy;
        }
      } else {
        throw new Error("Angular remote does not export a mount function");
      }
    } else {
      throw new Error(`Unknown remote app: ${appName.value}`);
    }

    console.info(`Remote app "${appName.value}" loaded successfully`);
  } catch (e: any) {
    console.error(`Failed to load remote "${appName.value}"`, e);
    error.value = e?.message ?? String(e);
  } finally {
    isLoading.value = false;
  }
}

function cleanup() {
  try {
    if (lastRemoteModule?.unmount) lastRemoteModule.unmount();
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
      if (typeof svelteInstance.unmount === "function")
        svelteInstance.unmount();
      else if (typeof svelteInstance.$destroy === "function")
        svelteInstance.$destroy();
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
