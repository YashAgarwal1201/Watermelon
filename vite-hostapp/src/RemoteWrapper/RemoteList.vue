<template>
  <div class="remote-list p-6 max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">Available Remote Apps</h2>
    <ul class="space-y-3">
      <li
        v-for="app in remoteApps"
        :key="app.name"
        class="cursor-pointer p-4 border rounded hover:bg-gray-100"
        @click="goToRemote(app.name)"
      >
        {{ app.displayName }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const remoteApps = [
  { name: "remoteapp_1", displayName: "Remote App 1 (React)" },
  { name: "remoteapp_2", displayName: "Remote App 2 (Vue)" },
];

function goToRemote(appName: string) {
  router.push({ name: "RemoteApp", params: { appName } });
}
</script>

<style scoped>
.remote-list ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
</style>
