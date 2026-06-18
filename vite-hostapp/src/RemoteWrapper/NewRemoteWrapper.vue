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

<script lang="ts">
// ─── MODULE-LEVEL CSS cache ───────────────────────────────────────────────────
// Declared in a plain <script> block (not <script setup>) so it lives at
// module scope and survives across component mount/unmount cycles.
// <script setup> runs once per instance — navigating away destroys the instance
// and its cssCache with it, so on the way back the bucket is empty and
// replayCssIntoShadow has nothing to replay. Module scope fixes this.
const cssCache = new Map<string, string[]>();
</script>

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

let loadId = 0;

function isStyleOrLink(node: Node): boolean {
  if (!(node instanceof HTMLElement)) return false;
  const t = node.tagName.toLowerCase();
  return (
    t === "style" ||
    (t === "link" && (node as HTMLLinkElement).rel === "stylesheet")
  );
}

// do not delete unless everything is working fine
// function patchHeadToShadow(
//   shadow: ShadowRoot,
//   capturedId: number,
//   remoteName: string,
// ): () => void {
//   const head = document.head as any;
//   const origAppendChild = head.appendChild.bind(head);
//   const origInsertBefore = head.insertBefore.bind(head);
//   const origAppend = head.append?.bind(head);
//   const origPrepend = head.prepend?.bind(head);

//   const isCancelled = () => capturedId !== loadId;

//   if (!cssCache.has(remoteName)) cssCache.set(remoteName, []);
//   const bucket = cssCache.get(remoteName)!;

//   async function fetchAndInject(href: string) {
//     try {
//       const res = await fetch(href, { mode: "cors", cache: "force-cache" });
//       if (!res.ok) return;
//       const css = await res.text();
//       if (isCancelled()) return;
//       const s = document.createElement("style");
//       s.setAttribute("data-remote-src", href);
//       s.textContent = css;
//       shadow.appendChild(s);
//       if (!bucket.includes(css)) bucket.push(css);
//     } catch {}
//   }

//   function intercept(node: Node): boolean {
//     if (!isStyleOrLink(node)) return false;
//     if (isCancelled()) return false;

//     // if (node instanceof HTMLElement && node.tagName.toLowerCase() === "style") {
//     //   const css = node.textContent ?? "";
//     //   const clone = document.createElement("style");
//     //   clone.setAttribute("data-remote-css", remoteName);
//     //   clone.textContent = css;
//     //   shadow.appendChild(clone);
//     //   new MutationObserver(() => {
//     //     clone.textContent = node.textContent;
//     //   }).observe(node, { characterData: true, childList: true, subtree: true });
//     //   if (!bucket.includes(css)) bucket.push(css);
//     //   return true;
//     // }

//     if (node instanceof HTMLElement && node.tagName.toLowerCase() === "style") {
//       const clone = document.createElement("style");
//       clone.setAttribute("data-remote-css", remoteName);
//       clone.textContent = node.textContent ?? "";
//       shadow.appendChild(clone);

//       // Keep clone in sync AND update the cache bucket lazily
//       const bucketIndex = bucket.length;
//       bucket.push(node.textContent ?? ""); // placeholder

//       new MutationObserver(() => {
//         const css = node.textContent ?? "";
//         clone.textContent = css;
//         bucket[bucketIndex] = css; // update in-place as style-loader fills it in
//       }).observe(node, { characterData: true, childList: true, subtree: true });

//       return true;
//     }

//     if (node instanceof HTMLLinkElement && node.rel === "stylesheet") {
//       void fetchAndInject(node.href);
//       return true;
//     }

//     return false;
//   }

//   head.appendChild = function <T extends Node>(node: T): T {
//     if (intercept(node)) return node;
//     return origAppendChild(node);
//   };

//   head.insertBefore = function <T extends Node>(node: T, ref: Node | null): T {
//     if (intercept(node)) return node;
//     return origInsertBefore(node, ref);
//   };

//   if (origAppend) {
//     head.append = function (...nodes: (Node | string)[]) {
//       for (const n of nodes) {
//         if (typeof n !== "string" && intercept(n)) continue;
//         origAppend(n);
//       }
//     };
//   }

//   if (origPrepend) {
//     head.prepend = function (...nodes: (Node | string)[]) {
//       for (const n of nodes) {
//         if (typeof n !== "string" && intercept(n)) continue;
//         origPrepend(n);
//       }
//     };
//   }

//   const mo = new MutationObserver((records) => {
//     for (const r of records)
//       for (const n of Array.from(r.addedNodes))
//         if (isStyleOrLink(n)) intercept(n);
//   });
//   mo.observe(document.head, { childList: true });

//   return () => {
//     mo.disconnect();
//     head.appendChild = origAppendChild;
//     head.insertBefore = origInsertBefore;
//     if (origAppend) head.append = origAppend;
//     if (origPrepend) head.prepend = origPrepend;
//   };
// }

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
  const origInsertAdjacentElement = head.insertAdjacentElement?.bind(head);
  const origInsertAdjacentHTML = head.insertAdjacentHTML?.bind(head);

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
      const clone = document.createElement("style");
      clone.setAttribute("data-remote-css", remoteName);
      clone.textContent = node.textContent ?? "";
      shadow.appendChild(clone);

      // Push a placeholder and update it in-place as style-loader/Angular
      // fills the node content asynchronously after appendChild.
      const bucketIndex = bucket.length;
      bucket.push(node.textContent ?? "");

      new MutationObserver(() => {
        const css = node.textContent ?? "";
        clone.textContent = css;
        bucket[bucketIndex] = css;
      }).observe(node, { characterData: true, childList: true, subtree: true });

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

  if (origInsertAdjacentElement) {
    head.insertAdjacentElement = function (
      position: InsertPosition,
      el: Element,
    ): Element | null {
      if (intercept(el)) return el;
      return origInsertAdjacentElement(position, el);
    };
  }

  if (origInsertAdjacentHTML) {
    head.insertAdjacentHTML = function (
      position: InsertPosition,
      html: string,
    ) {
      // Parse the HTML string, intercept any style/link nodes,
      // and only forward non-style/link content to the real head.
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      const remaining: string[] = [];
      for (const child of Array.from(tmp.children)) {
        if (!intercept(child)) {
          remaining.push(child.outerHTML);
        }
      }
      if (remaining.length) {
        origInsertAdjacentHTML(position, remaining.join(""));
      }
    };
  }

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
    if (origInsertAdjacentElement)
      head.insertAdjacentElement = origInsertAdjacentElement;
    if (origInsertAdjacentHTML)
      head.insertAdjacentHTML = origInsertAdjacentHTML;
  };
}

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

async function sweepExistingHeadLinks(shadow: ShadowRoot, remoteName: string) {
  if (!cssCache.has(remoteName)) cssCache.set(remoteName, []);
  const bucket = cssCache.get(remoteName)!;

  const links = Array.from(
    document.head.querySelectorAll<HTMLLinkElement>("link[rel='stylesheet']"),
  );

  await Promise.all(
    links.map(async (link) => {
      const href = link.href;
      if (!href) return;

      // Skip if already injected into this shadow
      if (shadow.querySelector(`[data-remote-src="${href}"]`)) return;

      try {
        const res = await fetch(href, { mode: "cors", cache: "force-cache" });
        if (!res.ok) return;
        const css = await res.text();
        const s = document.createElement("style");
        s.setAttribute("data-remote-src", href);
        s.textContent = css;
        shadow.appendChild(s);
        if (!bucket.includes(css)) bucket.push(css);
      } catch {}
    }),
  );
}

function buildShadow(): { shadow: ShadowRoot; mount: HTMLElement } {
  if (shadowRoot) {
    while (shadowRoot.firstChild) shadowRoot.removeChild(shadowRoot.firstChild);
  } else {
    shadowRoot = hostContainer.value!.attachShadow({ mode: "open" });
  }

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

async function loadRemote() {
  error.value = null;
  if (!hostContainer.value) return;

  const currentId = ++loadId;

  if (restoreHeadPatch) {
    restoreHeadPatch();
    restoreHeadPatch = null;
  }

  const { shadow, mount } = buildShadow();
  mountPoint = mount;

  isLoading.value = true;

  restoreHeadPatch = patchHeadToShadow(shadow, currentId, appName.value);
  replayCssIntoShadow(appName.value, shadow);

  try {
    (window as any).BASENAME = `/remote/${appName.value}`;
    lastRemoteModule = null;

    if (appName.value === "vite_react_remoteapp") {
      const module =
        await import("vite_react_remoteapp/ViteReactRemoteComponent");
      if (currentId !== loadId) return;
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
      // } else if (appName.value === "angular_remoteapp") {
      //   const module = await import("angular_remoteapp/Component");
      //   if (currentId !== loadId) return;
      //   lastRemoteModule = module;
      //   if (typeof module.mount !== "function")
      //     throw new Error("Angular remote does not export a mount function");
      //   const result = await module.mount(mountPoint!);
      //   if (result?.destroy) lastRemoteModule.unmount = result.destroy;
      // }
    } else if (appName.value === "angular_remoteapp") {
      // Patch head BEFORE the import so Webpack runtime link injection is caught
      restoreHeadPatch = patchHeadToShadow(shadow, currentId, appName.value);
      replayCssIntoShadow(appName.value, shadow);

      const module = await import("angular_remoteapp/Component");
      if (currentId !== loadId) return;
      lastRemoteModule = module;

      // After import, sweep any <link> tags already in head that slipped through
      // (Webpack runtime may have injected them before the patch was active on
      // previous loads, and they won't be re-injected on subsequent imports
      // because Webpack caches the module)
      await sweepExistingHeadLinks(shadow, appName.value);

      if (typeof module.mount !== "function")
        throw new Error("Angular remote does not export a mount function");
      const result = await module.mount(mountPoint!);
      if (result?.destroy) lastRemoteModule.unmount = result.destroy;
    } else {
      throw new Error(`Unknown remote app: ${appName.value}`);
    }

    console.info(`[RemoteWrapper] "${appName.value}" loaded OK`);
  } catch (e: any) {
    if (currentId !== loadId) return;
    console.error(`[RemoteWrapper] Failed to load "${appName.value}"`, e);
    error.value = e?.message ?? String(e);
  } finally {
    if (currentId === loadId) isLoading.value = false;
  }
}

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
