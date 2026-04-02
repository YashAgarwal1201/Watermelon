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

    <!-- container that hosts the shadowRoot -->
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

// remote instances
let vueAppInstance: any = null;
let reactRoot: any = null;
let svelteInstance: any = null;
let solidDisposer: any = null;

// last imported module (so we can call exported unmount if present)
let lastRemoteModule: any = null;

// restore function for head patching
let restoreHeadPatch: (() => void) | null = null;

/** -------- helper: robust head -> shadow patch -------- */
function patchHeadToShadow(shadow: ShadowRoot) {
  const docHead = document.head as any;

  const orig = {
    appendChild: docHead.appendChild,
    insertBefore: docHead.insertBefore,
    append: (docHead as any).append?.bind(docHead),
    prepend: (docHead as any).prepend?.bind(docHead),
  };

  // map originalNode -> { clone, observer }
  const movedMap = new Map<
    Node,
    { clone: HTMLElement; observer?: MutationObserver }
  >();

  // utility: inline link href (CORS may block)
  async function fetchCssText(href: string) {
    try {
      const res = await fetch(href, { mode: "cors" });
      if (!res.ok) throw new Error("Fetch failed");
      return await res.text();
    } catch {
      return null;
    }
  }

  async function moveToShadow(node: Node) {
    if (!(node instanceof HTMLElement)) return;
    if (movedMap.has(node)) return; // already moved/observed

    const tag = node.tagName.toLowerCase();
    if (tag === "style") {
      const clone = document.createElement("style");
      clone.textContent = node.textContent;
      shadow.appendChild(clone);

      // observe original style node for text changes (HMR updates)
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
        // no live updates possible unless server/loader re-inserts new <style> nodes;
        movedMap.set(node, { clone: s });
        return;
      } else {
        // can't fetch (CORS or network) -> leave the link in head (fallback)
        return orig.appendChild.call(docHead, node);
      }
    }

    // otherwise pass through to original head
    return orig.appendChild.call(docHead, node);
  }

  // patched methods
  docHead.appendChild = function (node: Node) {
    if (
      node instanceof HTMLElement &&
      (node.tagName.toLowerCase() === "style" ||
        (node.tagName.toLowerCase() === "link" &&
          (node as HTMLLinkElement).rel === "stylesheet"))
    ) {
      // don't await here (fire-and-forget), it's fine — moveToShadow updates clones async
      void moveToShadow(node);
      return node;
    }
    return orig.appendChild.call(this, node);
  };

  docHead.insertBefore = function (node: Node, refNode: Node | null) {
    if (
      node instanceof HTMLElement &&
      (node.tagName.toLowerCase() === "style" ||
        (node.tagName.toLowerCase() === "link" &&
          (node as HTMLLinkElement).rel === "stylesheet"))
    ) {
      void moveToShadow(node);
      return node;
    }
    return orig.insertBefore.call(this, node, refNode);
  };

  if (orig.append) {
    (docHead as any).append = function (...nodes: any[]) {
      for (const n of nodes) {
        if (
          n instanceof HTMLElement &&
          (n.tagName.toLowerCase() === "style" ||
            (n.tagName.toLowerCase() === "link" &&
              (n as HTMLLinkElement).rel === "stylesheet"))
        ) {
          void moveToShadow(n);
        } else {
          orig.append.call(docHead, n);
        }
      }
    };
  }

  if (orig.prepend) {
    (docHead as any).prepend = function (...nodes: any[]) {
      for (const n of nodes) {
        if (
          n instanceof HTMLElement &&
          (n.tagName.toLowerCase() === "style" ||
            (n.tagName.toLowerCase() === "link" &&
              (n as HTMLLinkElement).rel === "stylesheet"))
        ) {
          void moveToShadow(n);
        } else {
          orig.prepend.call(docHead, n);
        }
      }
    };
  }

  // MutationObserver fallback: catch anything that bypasses patched methods
  const headObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const n of Array.from(m.addedNodes)) {
        if (n instanceof HTMLElement) {
          const tag = n.tagName.toLowerCase();
          if (
            tag === "style" ||
            (tag === "link" && (n as HTMLLinkElement).rel === "stylesheet")
          ) {
            void moveToShadow(n);
          }
        }
      }
    }
  });

  headObserver.observe(docHead, { childList: true, subtree: false });

  // initial scan: move existing style/link nodes
  Array.from(docHead.querySelectorAll("style, link[rel='stylesheet']")).forEach(
    (n) => {
      // avoid moving nodes that are obviously injected for the host (optional heuristic could go here)
      void moveToShadow(n as Node);
    }
  );

  // restore function
  return () => {
    headObserver.disconnect();
    docHead.appendChild = orig.appendChild;
    docHead.insertBefore = orig.insertBefore;
    if (orig.append) (docHead as any).append = orig.append;
    if (orig.prepend) (docHead as any).prepend = orig.prepend;

    // teardown any per-node observers and remove cloned nodes from shadow
    for (const [origNode, info] of movedMap.entries()) {
      try {
        if (info.observer) info.observer.disconnect();
        if (info.clone && info.clone.parentNode === shadow) {
          info.clone.parentNode!.removeChild(info.clone);
        }
      } catch {
        // ignore errors during restore
      }
    }
    movedMap.clear();
  };
}

/** -------- remote loader -------- */
async function loadRemote() {
  error.value = null;
  if (!mountPoint) return;

  isLoading.value = true;
  mountPoint.innerHTML = "";

  // Ensure shadow root HEAD patch is active for the *entire* lifetime of the remote
  if (!restoreHeadPatch && shadowRoot) {
    restoreHeadPatch = patchHeadToShadow(shadowRoot);
  }

  try {
    // expose basename for remotes who read window.BASENAME
    (window as any).BASENAME = `/remote/${appName.value}`;

    // reset last module reference
    lastRemoteModule = null;

    if (appName.value === "vite_react_remoteapp") {
      const module = await import(
        "vite_react_remoteapp/ViteReactRemoteComponent"
      );
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
      // prefer mount API: module.mount(el, { basename, memory })
      if (typeof module.mount === "function") {
        const result = await module.mount(mountPoint!, {
          basename: (window as any).BASENAME,
          memory: false,
        });
        // remote may return { app, router } or the app itself
        vueAppInstance = result?.app ?? result ?? null;
      } else {
        // fallback: module.default is a root component (simple remote)
        const component = module.default;
        const { createApp } = await import("vue");
        vueAppInstance = (createApp as any)(component);
        vueAppInstance.mount(mountPoint);
      }
      // } else if (appName.value === "vite_svelte_remoteapp") {
      //   const module = await import(
      //     "vite_svelte_remoteapp/ViteSvelteRemoteComponent"
      //   );
      //   lastRemoteModule = module;
      //   const SvelteComponent = module.default;
      //   svelteInstance = new SvelteComponent({ target: mountPoint! });
      // }

      // In your loader's loadRemote function, update the Svelte section:
    } else if (appName.value === "vite_svelte_remoteapp") {
      const module = await import(
        "vite_svelte_remoteapp/ViteSvelteRemoteComponent"
      );
      lastRemoteModule = module;

      // Check if it's a Svelte 5 component with mount function
      if (typeof module.mount === "function") {
        // Use the exported mount function (Svelte 5 style)
        svelteInstance = module.mount(mountPoint!, {
          props: {
            basename: (window as any).BASENAME,
          },
        });
      } else {
        // Fallback to legacy Svelte constructor
        const SvelteComponent = module.default;
        svelteInstance = new SvelteComponent({
          target: mountPoint!,
          props: {
            basename: (window as any).BASENAME,
          },
        });
      }
    } else if (appName.value === "vite_solidjs_remoteapp") {
      const module = await import(
        "vite_solidjs_remoteapp/ViteSolidRemoteComponent"
      );
      lastRemoteModule = module;
      const SolidComponent = module.default;
      const { render } = await import("solid-js/web");
      // render returns a disposer function
      solidDisposer = render(() => (SolidComponent as any)(), mountPoint!);
    } else if (appName.value === "webpack_react_remoteapp") {
      const module = await import(
        "webpack_react_remoteapp/WebpackReactRemoteComponent"
      );
      lastRemoteModule = module;
      const component = module.default;
      // gather stylesheet texts (best-effort) then adopt into shadow root (opt)
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
          })
        );
        if (shadowRoot && "adoptedStyleSheets" in shadowRoot) {
          const sheet = new CSSStyleSheet();
          await (sheet as any).replace(cssTexts.join("\n"));
          (shadowRoot as any).adoptedStyleSheets = [
            (shadowRoot as any).adoptedStyleSheets?.[0],
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
      const module = await import(
        "webpack_vue_remoteapp/WebpackVueRemoteComponent"
      );
      lastRemoteModule = module;
      // prefer exported mount API if present
      if (typeof module.mount === "function") {
        const result = await module.mount(mountPoint!);
        vueAppInstance = result?.app ?? result ?? null;
      } else if (
        typeof module.default === "function" ||
        typeof module.default === "object"
      ) {
        // fallback: if default is a bootstrap that returns app (webpack remotes often expose a bootstrap)
        try {
          const maybeReturned = module.default(mountPoint);
          vueAppInstance = maybeReturned ?? null;
        } catch {
          // fallback to attempt createApp
          const { createApp } = await import("vue");
          vueAppInstance = (createApp as any)(module.default);
          vueAppInstance.mount(mountPoint);
        }
      } else {
        throw new Error(
          "Cannot bootstrap webpack_vue_remoteapp: no mount or usable default export"
        );
      }
    } else if (appName.value === "angular_remoteapp") {
      const module = await import("angular_remoteapp/Component");
      lastRemoteModule = module;

      if (typeof module.mount === "function") {
        const result = await module.mount(mountPoint!);
        // Store the destroy function if returned
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
    // DO NOT restore head patch here — restore only on cleanup/unmount
  }
}

/** -------- cleanup -------- */
function cleanup() {
  // call remote-provided unmount if available
  try {
    if (lastRemoteModule && typeof lastRemoteModule.unmount === "function") {
      try {
        lastRemoteModule.unmount();
      } catch {
        // ignore remote unmount errors
      }
    }
  } catch {}

  // vue app instance
  try {
    if (vueAppInstance && typeof vueAppInstance.unmount === "function") {
      vueAppInstance.unmount();
      vueAppInstance = null;
    }
  } catch {}

  // react
  try {
    if (reactRoot && typeof reactRoot.unmount === "function") {
      reactRoot.unmount();
      reactRoot = null;
    }
  } catch {}

  // svelte
  try {
    if (svelteInstance) {
      // Svelte 5 mount returns object with unmount method
      if (typeof svelteInstance.unmount === "function") {
        svelteInstance.unmount();
      }
      // Legacy Svelte has $destroy method
      else if (typeof svelteInstance.$destroy === "function") {
        svelteInstance.$destroy();
      }
      svelteInstance = null;
    }
  } catch {}

  // solid
  try {
    if (typeof solidDisposer === "function") {
      solidDisposer();
      solidDisposer = null;
    }
  } catch {}

  // webpack + angular
  try {
    if (lastRemoteModule && typeof lastRemoteModule.unmount === "function") {
      lastRemoteModule.unmount();
    }
  } catch {}

  // clear mount point
  if (mountPoint) {
    mountPoint.innerHTML = "";
  }

  // restore head patch and clear
  try {
    if (restoreHeadPatch) {
      restoreHeadPatch();
      restoreHeadPatch = null;
    }
  } catch {}

  lastRemoteModule = null;
}

/** -------- retry -------- */
async function retryLoad() {
  cleanup();
  await nextTick();
  await loadRemote();
}

/** -------- lifecycle -------- */
onMounted(() => {
  if (hostContainer.value) {
    if (!shadowRoot) {
      // attach once
      shadowRoot = hostContainer.value.attachShadow({ mode: "open" });
      mountPoint = document.createElement("div");
      mountPoint.setAttribute("data-remote-mount", appName.value || "");
      shadowRoot.appendChild(mountPoint);

      // optional: copy root CSS custom properties so :root tokens are available inside shadow
      try {
        const rootStyles = getComputedStyle(document.documentElement);
        let vars = ":host{";
        for (let i = 0; i < rootStyles.length; i++) {
          const prop = rootStyles[i];
          if (prop && prop.startsWith("--")) {
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

    // start loading remote
    void loadRemote();
  }
});

onBeforeUnmount(() => {
  cleanup();
});

// reload when route param changes
watch(
  () => route.params.appName,
  async (newVal, oldVal) => {
    if (String(newVal) !== String(oldVal)) {
      appName.value = String(newVal || "");
      await retryLoad();
    }
  }
);
</script>

<style scoped>
.remote-container {
  flex-grow: 1;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

/* spinner */
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
