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

// shadowRoot is attached once to hostContainer and never detached.
// We clear its children on each navigation instead.
let shadowRoot: ShadowRoot | null = null;
let mountPoint: HTMLElement | null = null;

const isLoading = ref(false);
const error = ref<string | null>(null);

// Remote framework instances
let vueAppInstance: any = null;
let reactRoot: any = null;
let svelteInstance: any = null;
let solidDisposer: any = null;
let lastRemoteModule: any = null;

// Dark mode bridge
let darkModeStyleNode: HTMLStyleElement | null = null;
let darkModeObserver: MutationObserver | null = null;

// ─── Dark Mode Bridge ────────────────────────────────────────────────────────
// Injects a live <style> into the shadow root that mirrors the host's .dark
// class onto the shadow's :host and the mountPoint div. This lets remote apps
// use Tailwind's class-based dark: utilities inside the shadow DOM.

function injectDarkModeBridge(shadow: ShadowRoot) {
  // Clean up any previous bridge
  teardownDarkModeBridge();

  darkModeStyleNode = document.createElement("style");
  darkModeStyleNode.setAttribute("data-wm-dark-bridge", "1");
  // Insert before everything else in the shadow so it has lowest specificity
  shadow.insertBefore(darkModeStyleNode, shadow.firstChild);

  function syncDark() {
    const isDark = document.documentElement.classList.contains("dark");

    // 1. Tailwind v4 @custom-variant dark (&:where(.dark, .dark *)) won't
    //    pierce the shadow boundary — so we toggle .dark on the mountPoint
    //    itself so that dark: utilities inside the remote work correctly.
    if (mountPoint) {
      if (isDark) {
        mountPoint.classList.add("dark");
      } else {
        mountPoint.classList.remove("dark");
      }
    }

    // 2. color-scheme on :host — lets native browser controls (scrollbars,
    //    inputs) also respect dark mode inside the shadow.
    darkModeStyleNode!.textContent = isDark
      ? `:host { color-scheme: dark; }`
      : `:host { color-scheme: light; }`;
  }

  syncDark(); // immediate sync on mount

  darkModeObserver = new MutationObserver(syncDark);
  darkModeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
}

function teardownDarkModeBridge() {
  if (darkModeObserver) {
    darkModeObserver.disconnect();
    darkModeObserver = null;
  }
  darkModeStyleNode = null;
}

// ─── Shadow Setup ────────────────────────────────────────────────────────────
// Called once on mount (attaches shadowRoot) and then again on every
// navigation (clears shadow content, creates a fresh mountPoint).

function setupShadowRoot() {
  if (!hostContainer.value) return;

  // Attach shadow root once — ShadowRoot cannot be detached or re-attached.
  if (!shadowRoot) {
    shadowRoot = hostContainer.value.attachShadow({ mode: "open" });
  }

  // Wipe ALL previous shadow content (styles, mountPoint, dark bridge).
  // This is the key fix: each remote gets a completely clean slate.
  while (shadowRoot.firstChild) {
    shadowRoot.removeChild(shadowRoot.firstChild);
  }

  // Fresh mount point
  mountPoint = document.createElement("div");
  mountPoint.setAttribute("data-remote-mount", appName.value);
  mountPoint.style.cssText = "width:100%;height:100%;display:contents;";
  shadowRoot.appendChild(mountPoint);

  // Live dark mode bridge (always after mountPoint so syncDark can find it)
  injectDarkModeBridge(shadowRoot);
}

// ─── Remote Loader ───────────────────────────────────────────────────────────

async function loadRemote() {
  error.value = null;
  if (!mountPoint || !shadowRoot) return;

  isLoading.value = true;
  mountPoint.innerHTML = "";

  try {
    // Expose basename for remotes that read window.BASENAME
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

    // After the remote has mounted and (potentially) injected <style> nodes
    // into document.head via cssInjectedByJs, move those remote-owned styles
    // into the shadow root so they don't pollute the host document.
    await nextTick();
    relocateRemoteStyles(shadowRoot!);

    console.info(`Remote app "${appName.value}" loaded successfully`);
  } catch (e: any) {
    console.error(`Failed to load remote "${appName.value}"`, e);
    error.value = e?.message ?? String(e);
  } finally {
    isLoading.value = false;
  }
}

// ─── Style Relocation ────────────────────────────────────────────────────────
// After a remote mounts, any <style data-remote-css> nodes it injected into
// document.head are moved into the shadow root. This keeps the host document
// clean and scopes each remote's styles inside its own shadow boundary.

function relocateRemoteStyles(shadow: ShadowRoot) {
  const remoteStyles = Array.from(
    document.head.querySelectorAll("style[data-remote-css]"),
  );
  for (const node of remoteStyles) {
    shadow.appendChild(node); // moves the node out of head into shadow
  }
}

// ─── Cleanup ─────────────────────────────────────────────────────────────────

function cleanup() {
  // Call remote-provided unmount if available
  try {
    if (lastRemoteModule && typeof lastRemoteModule.unmount === "function") {
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

  // Svelte
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
  mountPoint = null;

  // Tear down dark mode bridge observer (style node lives in shadow which
  // we're about to wipe, so no need to remove it separately)
  teardownDarkModeBridge();

  // Wipe shadow content — this removes ALL remote styles, the mountPoint,
  // and the dark bridge style node in one sweep
  if (shadowRoot) {
    while (shadowRoot.firstChild) {
      shadowRoot.removeChild(shadowRoot.firstChild);
    }
  }
}

// ─── Retry ───────────────────────────────────────────────────────────────────

async function retryLoad() {
  cleanup();
  setupShadowRoot();
  await nextTick();
  await loadRemote();
}

// ─── Lifecycle ───────────────────────────────────────────────────────────────

onMounted(() => {
  if (hostContainer.value) {
    setupShadowRoot();
    void loadRemote();
  }
});

onBeforeUnmount(() => {
  cleanup();
});

// Reload when navigating between remote apps
watch(
  () => route.params.appName,
  async (newVal, oldVal) => {
    if (String(newVal) !== String(oldVal)) {
      appName.value = String(newVal || "");
      cleanup();
      setupShadowRoot();
      await nextTick();
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
