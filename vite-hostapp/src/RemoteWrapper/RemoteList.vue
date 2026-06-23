// File: RemoteWrapper/RemoteList.vue

<template>
  <div class="w-full h-full bg-white dark:bg-gray-950 p-3 sm:p-5">
    <div class="">
      <!-- Header -->
      <div class="w-full flex flex-col mb-6">
        <div class="flex items-center justify-start gap-x-2">
          <GoBackBtn />
          <h2
            class="text-3xl font-bold bg-linear-to-r from-pink-500 via-red-500 to-green-500 bg-clip-text text-transparent font-heading"
          >
            Remote Apps
          </h2>
        </div>

        <p class="text-gray-600 dark:text-gray-400">
          Click on any remote app to load its components
        </p>
      </div>

      <!-- Remote Apps List -->
      <div class="space-y-4">
        <button
          v-for="app in remoteApps"
          :key="app.name"
          class="w-full group cursor-pointer disabled:pointer-events-none disabled:opacity-50 p-6 bg-linear-to-r from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.02] transform transition-all duration-200 hover:from-pink-100 hover:to-red-100 dark:hover:from-gray-800 dark:hover:to-gray-700"
          @click="goToRemote(app.name)"
          :disabled="app.name === 'angular_remoteapp'"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <!-- Framework Icon -->
              <div
                class="w-12 h-12 rounded-full bg-linear-to-r from-pink-500 to-red-500 flex items-center justify-center text-white font-bold text-lg shadow-lg"
              >
                {{ app.icon }}
              </div>

              <!-- App Info -->
              <div>
                <h3
                  class="text-left font-heading text-xl font-bold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors"
                >
                  {{ app.displayName }}
                </h3>
                <p class="text-left text-sm text-gray-600 dark:text-gray-400">
                  {{ app.description }}
                </p>
              </div>
            </div>

            <!-- Arrow Icon -->
            <div
              class="text-pink-400 dark:text-pink-500 group-hover:text-pink-600 dark:group-hover:text-pink-400 group-hover:translate-x-1 transition-all"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </div>
          </div>
        </button>
      </div>

      <!-- Footer Note -->
      <div
        class="mt-8 p-4 bg-linear-to-r from-green-50 to-pink-50 dark:from-green-950/20 dark:to-pink-950/20 rounded-lg border border-green-200 dark:border-green-800 text-center"
      >
        <p class="text-sm text-green-700 dark:text-green-400">
          <strong>💡 POC Demo:</strong> Each remote app runs independently and
          is federated at runtime
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import GoBackBtn from "../components/GoBack/GoBackBtn.vue";

const router = useRouter();

const remoteApps = [
  {
    name: "vite_react_remoteapp",
    displayName: "Vite + React Remote",
    description: "React 18 + TypeScript components",
    icon: "⚛️",
  },
  {
    name: "vite_vue_remoteapp",
    displayName: "Vite + Vue Remote",
    description: "Vue 3 Composition API components",
    icon: "🟢",
  },
  {
    name: "vite_svelte_remoteapp",
    displayName: "Vite + Svelte Remote",
    description: "Svelte components with stores",
    icon: "🔶",
  },
  {
    name: "vite_solidjs_remoteapp",
    displayName: "Vite + SolidJS Remote",
    description: "Solid components with signals",
    icon: "🔷",
  },
  {
    name: "webpack_react_remoteapp",
    displayName: "Webpack + React Remote",
    description: "React 19 + Module Federation",
    icon: "⚛️",
  },
  {
    name: "webpack_vue_remoteapp",
    displayName: "Webpack + Vue Remote",
    description: "Vue 3 + TypeScript + SCSS + Module Federation",
    icon: "🟢",
  },
  {
    name: "angular_remoteapp",
    displayName: "Angular Remote",
    description: "Angular + TypeScript + Module Federation",
    icon: "🔴",
  },
];

function goToRemote(appName: string) {
  router.push({ name: "RemoteApp", params: { appName } });
}
</script>
