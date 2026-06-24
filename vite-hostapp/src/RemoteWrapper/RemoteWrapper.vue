<!-- vite-hostapp/src/RemoteWrapper/RemoteWrapper.vue -->

<template>
  <div class="w-full h-full flex flex-col bg-white dark:bg-gray-950 p-3 sm:p-5">
    <div class="w-full flex flex-col mb-8 shrink-0">
      <div class="flex items-center justify-start gap-x-2">
        <GoBackBtn />
        <h2
          class="text-3xl font-bold bg-linear-to-r from-pink-500 via-red-500 to-green-500 bg-clip-text text-transparent font-heading"
        >
          Available Remote Apps
        </h2>
      </div>

      <p class="text-gray-600 dark:text-gray-400">
        Click on any remote app to load its components
      </p>
    </div>

    <div class="remote-wrapper w-full h-full p-2 grow">
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
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute } from "vue-router";
import GoBackBtn from "../components/GoBack/GoBackBtn.vue";

const route = useRoute();
const appName = ref(route.params.appName as string);

const hostContainer = ref<HTMLElement | null>(null);
let shadowRoot: ShadowRoot | null = null;
let mountPoint: HTMLElement | null = null;

const isLoading = ref(false);
const error = ref<string | null>(null);

// Instances for cleanup
let vueAppInstance: any = null;
let reactRoot: any = null;
let svelteInstance: any = null;
let solidRoot: any = null;

// restore fn for head patch
let restoreHeadPatch: (() => void) | null = null;

/** -------- style interception utils -------- */
function shouldIntercept(node: Node) {
  if (!(node instanceof HTMLElement)) return false;
  const tag = node.tagName.toLowerCase();
  return (
    tag === "style" ||
    (tag === "link" && (node as HTMLLinkElement).rel === "stylesheet")
  );
}

function patchHeadToShadow(shadow: ShadowRoot) {
  const docHead: any = document.head;
  const origAppend = docHead.appendChild;
  const origInsertBefore = docHead.insertBefore;

  async function moveToShadow(node: HTMLElement) {
    if (node.tagName.toLowerCase() === "style") {
      const s = document.createElement("style");
      s.textContent = node.textContent;
      shadow.appendChild(s);
    } else if (node.tagName.toLowerCase() === "link") {
      const link = node as HTMLLinkElement;
      try {
        const res = await fetch(link.href, { mode: "cors" });
        if (res.ok) {
          const css = await res.text();
          const s = document.createElement("style");
          s.textContent = css;
          shadow.appendChild(s);
        } else {
          origAppend.call(docHead, node);
        }
      } catch {
        origAppend.call(docHead, node);
      }
    } else {
      origAppend.call(docHead, node);
    }
  }

  docHead.appendChild = function (node: Node) {
    if (shouldIntercept(node)) {
      moveToShadow(node as HTMLElement);
      return node;
    }
    return origAppend.call(this, node);
  };

  docHead.insertBefore = function (node: Node, refNode: Node | null) {
    if (shouldIntercept(node)) {
      moveToShadow(node as HTMLElement);
      return node;
    }
    return origInsertBefore.call(this, node, refNode);
  };

  return () => {
    docHead.appendChild = origAppend;
    docHead.insertBefore = origInsertBefore;
  };
}

/** -------- remote loader -------- */
async function loadRemote() {
  error.value = null;
  if (!mountPoint) return;

  isLoading.value = true;
  mountPoint.innerHTML = ""; // clear old content

  // patch head styles during load
  restoreHeadPatch = patchHeadToShadow(shadowRoot!);

  try {
    window.BASENAME = `/remote/${appName.value}`;

    if (appName.value === "vite_react_remoteapp") {
      const module =
        await import("vite_react_remoteapp/ViteReactRemoteComponent");
      const component = module.default;
      const [React, ReactDOM] = await Promise.all([
        import("react"),
        import("react-dom/client"),
      ]);
      reactRoot = ReactDOM.createRoot(mountPoint);
      reactRoot.render(React.createElement(component));

      await new Promise((resolve) => setTimeout(resolve, 50));
    } else if (appName.value === "vite_vue_remoteapp") {
      const module = await import("vite_vue_remoteapp/ViteVueRemoteComponent");
      const component = module.default;
      const { createApp } = await import("vue");

      vueAppInstance = createApp(component);
      // In the vite_vue_remoteapp case, add this line:
      vueAppInstance.config.globalProperties.$shadowRoot = shadowRoot;

      vueAppInstance.mount(mountPoint);
    } else if (appName.value === "vite_svelte_remoteapp") {
      const module =
        await import("vite_svelte_remoteapp/ViteSvelteRemoteComponent");
      const SvelteComponent = module.default;
      svelteInstance = new SvelteComponent({ target: mountPoint });
    } else if (appName.value === "vite_solidjs_remoteapp") {
      const module =
        await import("vite_solidjs_remoteapp/ViteSolidRemoteComponent");
      const SolidComponent = module.default;
      const { render } = await import("solid-js/web");
      solidRoot = render(() => SolidComponent({}), mountPoint);
    } else if (appName.value === "webpack_react_remoteapp") {
      const module =
        await import("webpack_react_remoteapp/WebpackReactRemoteComponent");
      const component = module.default;

      // Get all stylesheets as text
      const stylesheets = Array.from(document.styleSheets);
      const cssTexts = await Promise.all(
        stylesheets.map(async (sheet) => {
          try {
            return Array.from(sheet.cssRules)
              .map((rule) => rule.cssText)
              .join("\n");
          } catch (e) {
            // For external stylesheets, fetch the CSS
            if (sheet.href) {
              const response = await fetch(sheet.href);
              return response.text();
            }
            return "";
          }
        }),
      );

      // Create adopted stylesheet for shadow DOM
      const adoptedSheet = new CSSStyleSheet();
      await adoptedSheet.replace(cssTexts.join("\n"));
      shadowRoot!.adoptedStyleSheets = [adoptedSheet];

      const [React, ReactDOM] = await Promise.all([
        import("react"),
        import("react-dom/client"),
      ]);

      reactRoot = ReactDOM.createRoot(mountPoint);
      reactRoot.render(React.createElement(component));
    } // In your loadRemote() function, add this case:
    else if (appName.value === "webpack_vue_remoteapp") {
      try {
        // Import the Vue remote
        const module =
          await import("webpack_vue_remoteapp/WebpackVueRemoteComponent");
        const remoteBootstrap = module.default;

        // Mount the remote Vue app
        const remoteApp = remoteBootstrap.mount(mountPoint);

        // Store reference for cleanup
        vueAppInstance = remoteApp;

        console.info('Remote app "webpack_vue_remoteapp" loaded successfully');
      } catch (e: any) {
        error.value = e.message || "Error loading webpack vue remote";
        console.error(`Failed to load remote app "${appName.value}":`, e);
      }
    } else {
      throw new Error(`Unknown remote app: ${appName.value}`);
    }

    console.info(`Remote app "${appName?.value}" loaded successfully`);
  } catch (e: any) {
    error.value = e.message || "Error loading remote app";
    console.error(`Failed to load remote app "${appName?.value}":`, e);
  } finally {
    if (restoreHeadPatch) {
      restoreHeadPatch();
      restoreHeadPatch = null;
    }
    isLoading.value = false;
  }
}

/** -------- cleanup -------- */
function cleanup() {
  // if (vueAppInstance) {
  //   vueAppInstance.unmount();
  //   vueAppInstance = null;
  // }
  if (vueAppInstance) {
    // For regular Vue remotes
    if (typeof vueAppInstance.unmount === "function") {
      vueAppInstance.unmount();
    } else {
      // For webpack Vue remotes with custom unmount
      vueAppInstance.unmount();
    }
    vueAppInstance = null;
  }
  if (reactRoot) {
    reactRoot.unmount();
    reactRoot = null;
  }
  if (svelteInstance) {
    svelteInstance.$destroy();
    svelteInstance = null;
  }
  if (solidRoot) {
    mountPoint!.innerHTML = "";
    solidRoot = null;
  }
  if (mountPoint) mountPoint.innerHTML = "";
}

/** -------- retry -------- */
async function retryLoad() {
  cleanup();
  await loadRemote();
}

/** -------- lifecycle -------- */
onMounted(() => {
  if (hostContainer.value) {
    // attach shadow root once
    if (!shadowRoot) {
      shadowRoot = hostContainer.value.attachShadow({ mode: "open" });
      mountPoint = document.createElement("div");
      shadowRoot.appendChild(mountPoint);
    }
    loadRemote();
  }
});

onBeforeUnmount(() => {
  cleanup();
});

watch(
  () => route.params.appName,
  async (newVal, oldVal) => {
    if (newVal !== oldVal) {
      appName.value = newVal as string;
      cleanup();
      await loadRemote();
    }
  },
);
</script>

<style scoped>
.remote-container {
  flex-grow: 1;
  width: 100%;
  height: 100%;
  /* Ensure child remote app fills this container */
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
