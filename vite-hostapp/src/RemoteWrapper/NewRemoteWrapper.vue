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

function patchHeadToShadow(shadow: ShadowRoot) {
  const docHead = document.head as any;

  const orig = {
    appendChild: docHead.appendChild,
    insertBefore: docHead.insertBefore,
    append: (docHead as any).append?.bind(docHead),
    prepend: (docHead as any).prepend?.bind(docHead),
  };

  const movedMap = new Map<
    Node,
    { clone: HTMLElement; observer?: MutationObserver }
  >();

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
    if (movedMap.has(node)) return;

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
        return orig.appendChild.call(docHead, node);
      }
    }

    return orig.appendChild.call(docHead, node);
  }

  docHead.appendChild = function (node: Node) {
    if (
      node instanceof HTMLElement &&
      (node.tagName.toLowerCase() === "style" ||
        (node.tagName.toLowerCase() === "link" &&
          (node as HTMLLinkElement).rel === "stylesheet"))
    ) {
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

  // FIX 1: Initial scan removed — was vacuuming host styles into shadow,
  // breaking host app styles after every remote navigation.

  return () => {
    headObserver.disconnect();
    docHead.appendChild = orig.appendChild;
    docHead.insertBefore = orig.insertBefore;
    if (orig.append) (docHead as any).append = orig.append;
    if (orig.prepend) (docHead as any).prepend = orig.prepend;

    for (const [, info] of movedMap.entries()) {
      try {
        if (info.observer) info.observer.disconnect();
        if (info.clone && info.clone.parentNode === shadow) {
          info.clone.parentNode!.removeChild(info.clone);
        }
      } catch {}
    }
    movedMap.clear();
  };
}

async function loadRemote() {
  error.value = null;
  if (!hostContainer.value) return;

  // FIX 2: Wipe and rebuild shadow on every navigation so previous remote's
  // styles never bleed into the next remote.
  if (restoreHeadPatch) {
    restoreHeadPatch();
    restoreHeadPatch = null;
  }

  if (shadowRoot) {
    while (shadowRoot.firstChild) shadowRoot.removeChild(shadowRoot.firstChild);
  } else {
    shadowRoot = hostContainer.value.attachShadow({ mode: "open" });
  }

  mountPoint = document.createElement("div");
  mountPoint.setAttribute("data-remote-mount", appName.value || "");
  shadowRoot.appendChild(mountPoint);

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
  } catch {}

  isLoading.value = true;
  mountPoint.innerHTML = "";

  restoreHeadPatch = patchHeadToShadow(shadowRoot);

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
            (shadowRoot as any).adoptedStyleSheets?.[0],
            sheet,
          ].filter(Boolean);
        }
      } catch {}

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
    if (lastRemoteModule && typeof lastRemoteModule.unmount === "function") {
      try {
        lastRemoteModule.unmount();
      } catch {}
    }
  } catch {}

  try {
    if (vueAppInstance && typeof vueAppInstance.unmount === "function") {
      vueAppInstance.unmount();
      vueAppInstance = null;
    }
  } catch {}

  try {
    if (reactRoot && typeof reactRoot.unmount === "function") {
      reactRoot.unmount();
      reactRoot = null;
    }
  } catch {}

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

  try {
    if (typeof solidDisposer === "function") {
      solidDisposer();
      solidDisposer = null;
    }
  } catch {}

  try {
    if (lastRemoteModule && typeof lastRemoteModule.unmount === "function") {
      lastRemoteModule.unmount();
    }
  } catch {}

  if (mountPoint) {
    mountPoint.innerHTML = "";
  }

  try {
    if (restoreHeadPatch) {
      restoreHeadPatch();
      restoreHeadPatch = null;
    }
  } catch {}

  lastRemoteModule = null;
}

async function retryLoad() {
  cleanup();
  await nextTick();
  await loadRemote();
}

onMounted(() => {
  if (hostContainer.value) {
    void loadRemote();
  }
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
