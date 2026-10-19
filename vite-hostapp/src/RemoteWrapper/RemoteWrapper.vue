<template>
  <div class="remote-wrapper w-full h-full flex flex-col">
    <div
      class="shrink-0 py-3 flex items-center gap-x-3 border-b border-pink-200 dark:border-red-800"
    >
      <GoBackBtn :to="'/remote'" />
      <h1 class="text-2xl sm:text-3xl capitalize">
        {{ (appName ?? "Remote App").replace(/_/g, " ") }}
      </h1>
    </div>
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

    <div
      v-if="error"
      class="p-6 m-4 bg-amber-50 dark:bg-zinc-900 border border-amber-200 dark:border-amber-800 rounded-xl shadow-sm"
    >
      <div class="flex items-start gap-4">
        <div
          class="p-2 bg-amber-100 dark:bg-amber-950/50 rounded-lg text-amber-600 dark:text-amber-400"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div class="flex-1">
          <h3
            class="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100"
          >
            Remote Application Offline or Unreachable
          </h3>
          <p class="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Could not connect to
            <code
              class="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded font-mono text-xs"
              >{{ appName }}</code
            >:
            <span class="text-red-500 font-mono text-xs block mt-1">{{
              error
            }}</span>
          </p>

          <div
            class="mt-4 p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-mono text-zinc-700 dark:text-zinc-300"
          >
            <p
              class="font-bold mb-1 font-sans text-zinc-800 dark:text-zinc-200"
            >
              To run this remote in live dev mode:
            </p>
            <p class="text-emerald-700 dark:text-emerald-400 font-semibold mb-2">
              $ npm run dev -- --remote={{ getCliFlag(appName) }}
            </p>
            <p class="font-sans text-zinc-600 dark:text-zinc-400">
              Or serve all prebuilt remotes in 1 lightweight process (~40 MB
              RAM):
            </p>
            <p class="text-blue-600 dark:text-blue-400 font-semibold mt-1">
              $ npm run serve:remotes
            </p>
          </div>

          <div class="mt-4 flex items-center gap-3">
            <button
              @click="retryLoad"
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Retry Connection</span>
            </button>
            <RouterLink
              to="/remote"
              class="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-sm font-medium rounded-lg transition-colors"
            >
              Back to Remote Gallery
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <div
      ref="hostContainer"
      class="remote-container grow overflow-y-auto"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import GoBackBtn from "../components/GoBack/GoBackBtn.vue";
import { buildShadow } from "./shadow";
import { resolveAdapter, type RemoteAdapter } from "./adapters";

const route = useRoute();
const appName = ref(String(route.params.appName ?? ""));

function getCliFlag(app: string): string {
  switch (app) {
    case "vite_react_remoteapp": return "v-react";
    case "vite_vue_remoteapp": return "v-vue";
    case "vite_svelte_remoteapp": return "v-svelte";
    case "vite_solidjs_remoteapp": return "v-solid";
    case "webpack_react_remoteapp": return "w-react";
    case "webpack_vue_remoteapp": return "w-vue";
    case "angular_remoteapp": return "angular";
    case "wc_lit_remoteapp": return "wc-lit";
    case "wc_vue_remoteapp": return "wc-vue";
    case "iframe_vite_app": return "iframe-vite";
    case "iframe_nextjs_app": return "iframe-nextjs";
    default: return app;
  }
}

const hostContainer = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

let shadowRoot: ShadowRoot | null = null;
let mountPoint: HTMLElement | null = null;
let currentAdapter: RemoteAdapter | null = null;
let loadId = 0;

async function loadRemote() {
  error.value = null;
  if (!hostContainer.value) return;

  const currentId = ++loadId;
  cleanup();

  const { shadow, mount } = buildShadow(
    hostContainer.value,
    shadowRoot,
    appName.value,
  );
  shadowRoot = shadow;
  mountPoint = mount;

  isLoading.value = true;

  try {
    const adapter = resolveAdapter(appName.value);
    currentAdapter = adapter;

    await adapter.mount({
      mountPoint,
      shadowRoot,
      appName: appName.value,
      basename: `/remote/${appName.value}`,
      isCancelled: () => currentId !== loadId,
    });

    console.info(
      `[RemoteWrapper] "${appName.value}" loaded OK via ${adapter.strategy}`,
    );
  } catch (e: any) {
    if (currentId !== loadId) return;
    console.error(`[RemoteWrapper] Failed to load "${appName.value}"`, e);
    error.value = e?.message ?? String(e);
  } finally {
    if (currentId === loadId) isLoading.value = false;
  }
}

function cleanup() {
  if (currentAdapter) {
    try {
      currentAdapter.unmount();
    } catch {}
    currentAdapter = null;
  }
  if (mountPoint) {
    mountPoint.innerHTML = "";
  }
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
