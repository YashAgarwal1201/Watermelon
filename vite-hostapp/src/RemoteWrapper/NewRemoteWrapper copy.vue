<template>
  <div class="w-full h-full flex flex-col bg-white dark:bg-gray-950 p-3 sm:p-5">
    <div class="w-full flex flex-col mb-6 shrink-0">
      <div class="flex items-center justify-start gap-x-2">
        <GoBackBtn />
        <h2
          class="text-3xl font-bold bg-linear-to-r from-pink-500 via-red-500 to-green-500 bg-clip-text text-transparent font-heading"
        >
          {{ appName }}
        </h2>
      </div>

      <p class="text-gray-600 dark:text-gray-400">
        View the remote app and its components
      </p>
    </div>
    <div class="remote-wrapper w-full h-full overflow-y-auto">
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

      <!-- container that hosts the shadowRoot -->
      <div
        ref="hostContainer"
        class="remote-container rounded-none md:rounded-lg"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import GoBackBtn from "../components/GoBack/GoBackBtn.vue";

const route = useRoute();
const appName = ref(String(route.params.appName ?? ""));

const hostContainer = ref<HTMLElement | null>(null);
let shadowRoot: ShadowRoot | null = null;
let mountPoint: HTMLElement | null = null;

const isLoading = ref(false);
const error = ref<string | null>(null);

// remote framework instances
let vueAppInstance: any = null;
let reactRoot: any = null;
let svelteInstance: any = null;
let solidDisposer: any = null;
let lastRemoteModule: any = null;

// restore function for head patching — scoped per loadRemote call
let restoreHeadPatch: (() => void) | null = null;

// ─── Bug Fix #5 & #1: track which nodes were injected BY the remote (not by
//     the host) so the initial scan never moves pre-existing host styles.
//     We snapshot head children just before the remote loads and only intercept
//     nodes added AFTER that snapshot.
let preLoadHeadChildren: Set<Node> = new Set();

/** -------- helper: robust head -> shadow patch -------- */
function patchHeadToShadow(shadow: ShadowRoot): () => void {
  const docHead = document.head as any;

  const orig = {
    appendChild: docHead.appendChild.bind(
      docHead,
    ) as typeof docHead.appendChild,
    insertBefore: docHead.insertBefore.bind(
      docHead,
    ) as typeof docHead.insertBefore,
    append: (docHead.append as Function | undefined)?.bind(docHead),
    prepend: (docHead.prepend as Function | undefined)?.bind(docHead),
  };

  // map originalNode -> { clone, observer }
  const movedMap = new Map<
    Node,
    { clone: HTMLElement; observer?: MutationObserver }
  >();

  async function fetchCssText(href: string): Promise<string | null> {
    try {
      const res = await fetch(href, { mode: "cors" });
      if (!res.ok) throw new Error("Fetch failed");
      return await res.text();
    } catch {
      return null;
    }
  }

  async function moveToShadow(node: Node): Promise<void> {
    if (!(node instanceof HTMLElement)) return;
    if (movedMap.has(node)) return;

    // ── Bug Fix #5: skip nodes that existed before this remote loaded ──
    if (preLoadHeadChildren.has(node)) return;

    const tag = node.tagName.toLowerCase();

    if (tag === "style") {
      const clone = document.createElement("style");
      clone.textContent = node.textContent;
      shadow.appendChild(clone);

      const mo = new MutationObserver(() => {
        clone.textContent = node.textContent;
      });
      mo.observe(node, { characterData: true, childList: true, subtree: true });
      movedMap.set(node, { clone, observer: mo });
      return;
    }

    if (tag === "link" && (node as HTMLLinkElement).rel === "stylesheet") {
      const link = node as HTMLLinkElement;
      const css = await fetchCssText(link.href);
      if (css !== null) {
        const s = document.createElement("style");
        s.textContent = css;
        shadow.appendChild(s);
        movedMap.set(node, { clone: s });
        return;
      } else {
        // CORS/network blocked — leave in head as fallback
        orig.appendChild(node);
        return;
      }
    }

    // non-style/link node — pass through to real head
    orig.appendChild(node);
  }

  // ── Patched DOM methods ──
  docHead.appendChild = function <T extends Node>(node: T): T {
    if (isStyleOrLink(node)) {
      void moveToShadow(node);
      return node;
    }
    return orig.appendChild(node);
  };

  docHead.insertBefore = function <T extends Node>(
    node: T,
    ref: Node | null,
  ): T {
    if (isStyleOrLink(node)) {
      void moveToShadow(node);
      return node;
    }
    return orig.insertBefore(node, ref);
  };

  if (orig.append) {
    docHead.append = function (...nodes: (Node | string)[]) {
      for (const n of nodes) {
        if (n instanceof Node && isStyleOrLink(n)) {
          void moveToShadow(n);
        } else {
          orig.append!(n);
        }
      }
    };
  }

  if (orig.prepend) {
    docHead.prepend = function (...nodes: (Node | string)[]) {
      for (const n of nodes) {
        if (n instanceof Node && isStyleOrLink(n)) {
          void moveToShadow(n);
        } else {
          orig.prepend!(n);
        }
      }
    };
  }

  // MutationObserver fallback for anything that bypasses patched methods
  const headObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const n of Array.from(m.addedNodes)) {
        if (
          n instanceof HTMLElement &&
          isStyleOrLink(n) &&
          !preLoadHeadChildren.has(n)
        ) {
          void moveToShadow(n);
        }
      }
    }
  });
  headObserver.observe(docHead, { childList: true, subtree: false });

  // ── Bug Fix #5: NO initial scan — we only capture nodes added after load ──
  // (preLoadHeadChildren already excludes anything present before loadRemote)

  return () => {
    headObserver.disconnect();
    docHead.appendChild = orig.appendChild;
    docHead.insertBefore = orig.insertBefore;
    if (orig.append) docHead.append = orig.append;
    if (orig.prepend) docHead.prepend = orig.prepend;

    for (const [, info] of movedMap.entries()) {
      try {
        info.observer?.disconnect();
        if (info.clone.parentNode === shadow) {
          shadow.removeChild(info.clone);
        }
      } catch {
        // ignore teardown errors
      }
    }
    movedMap.clear();
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

/** -------- remote loader -------- */
async function loadRemote(): Promise<void> {
  error.value = null;
  if (!mountPoint) return;

  isLoading.value = true;
  mountPoint.innerHTML = "";

  // ── Bug Fix #1 & #5: snapshot existing head nodes BEFORE the remote loads ──
  // Only nodes added after this point belong to the remote.
  preLoadHeadChildren = new Set(Array.from(document.head.childNodes));

  // ── Bug Fix #1: always create a fresh head patch per load so movedMap is clean ──
  if (restoreHeadPatch) {
    restoreHeadPatch();
    restoreHeadPatch = null;
  }
  if (shadowRoot) {
    restoreHeadPatch = patchHeadToShadow(shadowRoot);
  }

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
        const component = module.default;
        const { createApp } = await import("vue");
        vueAppInstance = (createApp as any)(component);
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

      try {
        const stylesheets = Array.from(document.styleSheets);
        const cssTexts = await Promise.all(
          stylesheets.map(async (sheet) => {
            try {
              return Array.from((sheet as CSSStyleSheet).cssRules)
                .map((r) => (r as CSSRule).cssText)
                .join("\n");
            } catch {
              if ((sheet as any).href) {
                try {
                  const res = await fetch((sheet as any).href);
                  return await res.text();
                } catch {
                  return "";
                }
              }
              return "";
            }
          }),
        );
        if (shadowRoot && "adoptedStyleSheets" in shadowRoot) {
          const sheet = new CSSStyleSheet();
          await (sheet as any).replace(cssTexts.join("\n"));
          (shadowRoot as any).adoptedStyleSheets = [
            ...((shadowRoot as any).adoptedStyleSheets ?? []),
            sheet,
          ].filter(Boolean);
        }
      } catch {
        // ignore adoptedStyleSheets failures
      }

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
      } else if (module.default !== undefined) {
        // ── Bug Fix #3: handle both component-object and bootstrap-function cases ──
        if (typeof module.default === "function") {
          // Could be a bootstrap function — try calling it
          try {
            const maybeApp = await module.default(mountPoint);
            // If it returned something with an unmount, treat as already-mounted app
            vueAppInstance = maybeApp ?? null;
          } catch {
            // It's a component constructor, not a bootstrap — mount via createApp
            const { createApp } = await import("vue");
            vueAppInstance = (createApp as any)(module.default);
            vueAppInstance.mount(mountPoint);
          }
        } else {
          // module.default is a component options object
          const { createApp } = await import("vue");
          vueAppInstance = (createApp as any)(module.default);
          vueAppInstance.mount(mountPoint); // ← was missing in original catch block
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
        // ── Bug Fix #4: store destroy separately; don't write onto lastRemoteModule ──
        // cleanup() will call angularDestroy directly instead of going through
        // lastRemoteModule.unmount (which was being called twice).
        if (result && typeof result.destroy === "function") {
          angularDestroy = result.destroy;
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

// ── Bug Fix #4: dedicated slot for the angular destroy fn ──
let angularDestroy: (() => void) | null = null;

/** -------- cleanup -------- */
function cleanup(): void {
  // Angular — call its specific destroy once
  try {
    if (typeof angularDestroy === "function") {
      angularDestroy();
      angularDestroy = null;
    }
  } catch {}

  // Generic remote-provided unmount (non-angular remotes that export it)
  try {
    if (
      lastRemoteModule &&
      typeof lastRemoteModule.unmount === "function" &&
      appName.value !== "angular_remoteapp" // already handled above
    ) {
      lastRemoteModule.unmount();
    }
  } catch {}

  // Vue
  try {
    if (vueAppInstance && typeof vueAppInstance.unmount === "function") {
      vueAppInstance.unmount();
      vueAppInstance = null;
    }
  } catch {}

  // React
  try {
    if (reactRoot && typeof reactRoot.unmount === "function") {
      reactRoot.unmount();
      reactRoot = null;
    }
  } catch {}

  // Svelte 5 (unmount method) or Svelte 4 ($destroy)
  try {
    if (svelteInstance) {
      if (typeof svelteInstance.unmount === "function") {
        svelteInstance.unmount();
      } else if (typeof svelteInstance.$destroy === "function") {
        svelteInstance.$destroy();
      }
      svelteInstance = null;
    }
  } catch {}

  // Solid
  try {
    if (typeof solidDisposer === "function") {
      solidDisposer();
      solidDisposer = null;
    }
  } catch {}

  lastRemoteModule = null;

  // Clear mount point DOM
  if (mountPoint) {
    mountPoint.innerHTML = "";
  }

  // ── Bug Fix #1: restore head patch on every cleanup so next load gets a fresh one ──
  try {
    if (restoreHeadPatch) {
      restoreHeadPatch();
      restoreHeadPatch = null;
    }
  } catch {}
}

/** -------- retry -------- */
async function retryLoad(): Promise<void> {
  cleanup();
  await nextTick();
  await loadRemote();
}

/** -------- lifecycle -------- */
onMounted(() => {
  if (hostContainer.value) {
    if (!shadowRoot) {
      shadowRoot = hostContainer.value.attachShadow({ mode: "open" });
      mountPoint = document.createElement("div");
      mountPoint.setAttribute("data-remote-mount", appName.value || "");
      shadowRoot.appendChild(mountPoint);

      // Copy host CSS custom properties so :root tokens work inside shadow DOM
      try {
        const rootStyles = getComputedStyle(document.documentElement);
        let vars = ":host{";
        for (let i = 0; i < rootStyles.length; i++) {
          const prop = rootStyles[i];
          if (prop?.startsWith("--")) {
            vars += `${prop}:${rootStyles.getPropertyValue(prop)};`;
          }
        }
        vars += "}";
        const cssVarsNode = document.createElement("style");
        cssVarsNode.textContent = vars;
        shadowRoot.insertBefore(cssVarsNode, mountPoint);
      } catch {
        // ignore CSS var copying if it fails
      }
    }

    void loadRemote();
  }
});

onBeforeUnmount(() => {
  cleanup();
});

// Reload when route param changes (SPA navigation)
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
