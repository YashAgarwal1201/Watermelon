<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
const message = ref("Hello from Vue Remote!");
</script>

<template>
  <div
    class="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 py-8"
  >
    <div class="max-w-4xl mx-auto p-6">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1
          class="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3"
        >
          🟢 Vue Remote App
        </h1>
        <p class="text-lg text-gray-700 dark:text-gray-300 mb-2">
          <strong>Tech Stack:</strong> Vite + Vue 3 + TypeScript + Tailwind +
          PrimeVue
        </p>
        <div
          class="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300"
        >
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span class="text-sm font-medium">Federated Remote Component</span>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Interactive Demo -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-blue-200 dark:border-gray-700"
        >
          <h2
            class="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-4 flex items-center"
          >
            🎮 Interactive Demo
          </h2>

          <div class="space-y-4">
            <!-- Counter -->
            <div
              class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg"
            >
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Counter Value
              </label>
              <div class="flex items-center space-x-3">
                <button
                  @click="count--"
                  class="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
                >
                  -
                </button>
                <span
                  class="text-2xl font-bold text-indigo-600 dark:text-indigo-400 min-w-[3rem] text-center"
                >
                  {{ count }}
                </span>
                <button
                  @click="count++"
                  class="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Message Input -->
            <div
              class="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg"
            >
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Dynamic Message
              </label>
              <input
                v-model="message"
                type="text"
                class="w-full px-3 py-2 border border-purple-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Type your message..."
              />
              <p class="mt-2 text-purple-600 dark:text-purple-400 font-medium">
                {{ message }}
              </p>
            </div>
          </div>
        </div>

        <!-- Features Info -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-purple-200 dark:border-gray-700"
        >
          <h2
            class="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-4 flex items-center"
          >
            ⚡ Vue Remote Features
          </h2>

          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <div
                class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
              >
                <span class="text-blue-600 dark:text-blue-400 font-bold"
                  >1</span
                >
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  Composition API
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Modern Vue 3 reactive patterns
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div
                class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center"
              >
                <span class="text-indigo-600 dark:text-indigo-400 font-bold"
                  >2</span
                >
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  TypeScript Ready
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Full type safety and IntelliSense
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div
                class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center"
              >
                <span class="text-purple-600 dark:text-purple-400 font-bold"
                  >3</span
                >
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  PrimeVue Integration
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Rich component library ready
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div
                class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
              >
                <span class="text-blue-600 dark:text-blue-400 font-bold"
                  >4</span
                >
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  Module Federation
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Runtime component sharing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Status Footer -->
      <div
        class="mt-8 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg border border-indigo-200 dark:border-indigo-800 text-center"
      >
        <p class="text-indigo-700 dark:text-indigo-300 font-medium">
          🚀 <strong>Status:</strong> Successfully loaded as federated remote
          component from Vue host application
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
