<!-- <template>
  <div class="remote-wrapper" style="height: 100%; width: 100%">
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

    <div ref="container" class="remote-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const appName = ref(route.params.appName as string);

const container = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

let vueAppInstance: any = null;
let reactRoot: any = null;

async function loadRemote() {
  error.value = null;
  if (!container.value) return;

  isLoading.value = true;

  try {
    if (appName.value === "vite_react_remoteapp") {
      const module = await import("vite_react_remoteapp/ViteReactRemoteComponent");
      const component = module.default;

      const [React, ReactDOM] = await Promise.all([
        import("react"),
        import("react-dom/client"),
      ]);
      reactRoot = ReactDOM.createRoot(container.value);
      reactRoot.render(React.createElement(component));
    } else if (appName.value === "vite_vue_remoteapp") {
      const module = await import("vite_vue_remoteapp/ViteVueRemoteComponent");
      const component = module.default;

      const { createApp } = await import("vue");
      vueAppInstance = createApp(component);
      vueAppInstance.mount(container.value);
    } else {
      throw new Error(`Unknown remote app: ${appName.value}`);
    }

    console.info(`Remote app "${appName.value}" loaded successfully`);
  } catch (e: any) {
    error.value = e.message || "Error loading remote app";
    console.error(`Failed to load remote app "${appName.value}":`, e);
  } finally {
    isLoading.value = false;
  }
}

function cleanup() {
  if (vueAppInstance) {
    vueAppInstance.unmount();
    vueAppInstance = null;
  }
  if (reactRoot) {
    reactRoot.unmount();
    reactRoot = null;
  }
  if (container.value) {
    container.value.innerHTML = "";
  }
}

async function retryLoad() {
  cleanup();
  await loadRemote();
}

onMounted(() => {
  loadRemote();
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
  }
);
</script>

<style scoped>
.remote-container {
  width: 100%;
  height: 100%;
  /* Ensure child remote app fills this container */
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
</style> -->

<!-- 2 new remote apps -->
<template>
  <div class="remote-wrapper w-full h-full">
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

    <div v-else ref="container" class="remote-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const appName = ref(route.params.appName as string);

const container = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Track instances for cleanup
let vueAppInstance: any = null;
let reactRoot: any = null;
let svelteInstance: any = null;
let solidRoot: any = null;

async function loadRemote() {
  error.value = null;
  if (!container.value) return;

  isLoading.value = true;

  try {
    if (appName.value === "vite_react_remoteapp") {
      // React remote
      const module = await import(
        "vite_react_remoteapp/ViteReactRemoteComponent"
      );
      const component = module.default;
      const [React, ReactDOM] = await Promise.all([
        import("react"),
        import("react-dom/client"),
      ]);
      reactRoot = ReactDOM.createRoot(container.value);
      reactRoot.render(React.createElement(component));
      console.info(`Remote app "vite_react_remoteapp" loaded successfully`);
    } else if (appName.value === "vite_vue_remoteapp") {
      // Vue remote
      const module = await import("vite_vue_remoteapp/ViteVueRemoteComponent");
      const component = module.default;
      const { createApp } = await import("vue");
      vueAppInstance = createApp(component);
      vueAppInstance.mount(container.value);
      console.info(`Remote app "vite_vue_remoteapp" loaded successfully`);
    } else if (appName.value === "vite_svelte_remoteapp") {
      // Svelte remote - more compatible approach
      const module = await import("vite_svelte_remoteapp/RemoteComponent3");
      const SvelteComponent = module.default;

      // Create a clean wrapper element
      const wrapper = document.createElement("div");
      wrapper.style.width = "100%";
      wrapper.style.height = "100%";
      container.value.appendChild(wrapper);

      // Mount with error handling
      try {
        svelteInstance = new SvelteComponent({
          target: wrapper,
          props: {},
          hydrate: false, // Ensure client-side only rendering
        });
        console.info(`Remote app "remoteapp_3" loaded successfully`);
      } catch (mountError) {
        console.error("Svelte mount error:", mountError);
        throw new Error(
          `Failed to mount Svelte component: ${mountError?.message ?? ""}`
        );
      }
    } else if (appName.value === "vite_solidjs_remoteapp") {
      // SolidJS remote
      const module = await import(
        "vite_solidjs_remoteapp/ViteSolidRemoteComponent"
      );
      const SolidComponent = module.default;
      const { render } = await import("solid-js/web");
      // Clean the container before mounting (Solid needs empty node)
      container.value.innerHTML = "";
      solidRoot = render(() => SolidComponent({}), container.value);
      console.info(`Remote app "solid_remote" loaded successfully`);
    } else {
      throw new Error(`Unknown remote app: ${appName.value}`);
    }
  } catch (e: any) {
    error.value = e.message || "Error loading remote app";
    console.error(`Failed to load remote app "${appName.value}":`, e);
  } finally {
    isLoading.value = false;
  }
}

function cleanup() {
  if (vueAppInstance) {
    vueAppInstance.unmount();
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
  if (solidRoot && container.value) {
    // For Solid, remove all children
    container.value.innerHTML = "";
    solidRoot = null;
  }
  if (container.value) {
    container.value.innerHTML = "";
  }
}

async function retryLoad() {
  cleanup();
  await loadRemote();
}

onMounted(() => {
  loadRemote();
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
  }
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
