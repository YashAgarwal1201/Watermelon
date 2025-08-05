<template>
  <div v-if="remoteName && componentPath">
    <div ref="reactRoot" />
  </div>
  <div v-else class="p-6 text-red-600 text-xl font-bold">
    Unknown remote app: {{ appName }}
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRoute } from "vue-router";
import React from "react";
import ReactDOM from "react-dom/client";

// Get route param
const route = useRoute();
const appName = computed(() => route.params.appName as string);

// Mapping from route param to actual remote info
const remoteMap: Record<string, { remoteName: string; componentPath: string }> =
  {
    remoteapp_1: {
      remoteName: "remoteapp_1",
      componentPath: "RemoteComponent1",
    },
    remoteapp_2: {
      remoteName: "remoteapp_2",
      componentPath: "RemoteComponent2",
    },
  };

const config = computed(() => remoteMap[appName?.value]);
const remoteName = computed(() => config.value?.remoteName);
const componentPath = computed(() => config.value?.componentPath);

const reactRoot = ref<HTMLElement | null>(null);
let root: ReactDOM.Root | null = null;

// Function to load remote component
async function loadRemoteComponent(remoteName: string, componentPath: string) {
  try {
    // For @originjs/vite-plugin-federation, use direct import with proper path
    const moduleSpecifier = `${remoteName}/${componentPath}`;
    console.log(`Attempting to load: ${moduleSpecifier}`);

    // Direct dynamic import for Vite federation
    const module = await import(/* @vite-ignore */ moduleSpecifier);
    return module.default || module;
  } catch (error) {
    console.error(
      `Failed to load remote component ${remoteName}/${componentPath}:`,
      error
    );

    // Fallback: Try alternative import patterns
    try {
      const altModuleSpecifier = `./${remoteName}/${componentPath}`;
      console.log(`Trying alternative: ${altModuleSpecifier}`);
      const module = await import(/* @vite-ignore */ altModuleSpecifier);
      return module.default || module;
    } catch (altError) {
      console.error(`Alternative import also failed:`, altError);
      throw new Error(
        `Could not load ${remoteName}/${componentPath}. Make sure the remote app is running on the correct port and the component is properly exported.`
      );
    }
  }
}

onMounted(async () => {
  if (!remoteName.value || !componentPath.value || !reactRoot.value) return;

  try {
    const RemoteComponent = await loadRemoteComponent(
      remoteName.value,
      componentPath.value
    );
    root = ReactDOM.createRoot(reactRoot.value);
    root.render(React.createElement(RemoteComponent));
  } catch (error) {
    console.error("Error loading remote component:", error);
    // Render error state
    root = ReactDOM.createRoot(reactRoot.value);
    root.render(
      React.createElement(
        "div",
        { className: "p-6 text-red-600" },
        `Failed to load remote component: ${error ?? ""}`
      )
    );
  }
});

onBeforeUnmount(() => {
  root?.unmount();
});
</script>
