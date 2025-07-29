<template>
  <div ref="reactRoot" />
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import React from "react";
import ReactDOM from "react-dom/client";

// Import the remote React component dynamically
const reactRoot = ref<HTMLElement | null>(null);

let root: ReactDOM.Root | null = null;

onMounted(async () => {
  const RemoteComponent = (await import("remoteapp_1/RemoteComponent")).default;
  if (reactRoot.value) {
    root = ReactDOM.createRoot(reactRoot.value);
    root.render(React.createElement(RemoteComponent));
  }
});

onBeforeUnmount(() => {
  root?.unmount();
});
</script>
