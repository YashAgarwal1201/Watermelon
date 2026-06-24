<template>
  <div
    class="w-full h-full overflow-y-auto bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-200"
  >
    <div class="max-w-5xl mx-auto px-6 py-12 space-y-10">
      <!-- ── Header ── -->
      <section class="space-y-4">
        <div class="flex items-center gap-3">
          <GoBackBtn :to="'/'" />
        </div>

        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <div class="w-8 h-px bg-pink-500"></div>
            <span
              class="text-xs font-semibold uppercase tracking-widest text-pink-500 dark:text-pink-400"
              >Module Federation</span
            >
          </div>
          <h1
            class="font-heading text-4xl md:text-5xl bg-linear-to-r from-pink-500 via-red-500 to-green-500 bg-clip-text text-transparent leading-tight"
          >
            Remote Apps
          </h1>
          <p
            class="text-base text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed"
          >
            Seven independent remotes across four frameworks and two bundlers,
            each exposing its component via
            <code
              class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded"
              >remoteEntry.js</code
            >
            and loaded by this host at runtime.
          </p>
        </div>
      </section>

      <!-- ── Vite Remotes ── -->
      <section class="space-y-4" aria-labelledby="vite-remotes-heading">
        <div class="space-y-1">
          <div class="flex items-center gap-3">
            <div class="w-8 h-px bg-green-500"></div>
            <span
              id="vite-remotes-heading"
              class="text-xs font-semibold uppercase tracking-widest text-green-600 dark:text-green-400"
              >Vite</span
            >
          </div>
          <p class="text-sm text-gray-400 dark:text-gray-600 pl-11">
            Built with
            <code
              class="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded"
              >@originjs/vite-plugin-federation</code
            >
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
          <button
            v-for="app in viteRemotes"
            :key="app.name"
            role="listitem"
            :disabled="app.disabled"
            class="group text-left rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-all bg-white dark:bg-gray-900/30 space-y-1 cursor-pointer disabled:pointer-events-none disabled:opacity-40"
            :class="app.hoverBorderClass"
            :aria-label="`Open ${app.displayName}`"
            @click="goToRemote(app.name)"
          >
            <div class="flex items-center justify-between gap-2">
              <span
                class="text-base font-semibold leading-snug"
                :class="app.accentClass"
              >
                {{ app.framework }}
                <span class="text-gray-400 dark:text-gray-600 font-normal"
                  >/ Vite</span
                >
              </span>
              <span
                class="shrink-0 text-gray-400 dark:text-gray-600 transition-colors"
                :class="app.arrowHoverClass"
                aria-hidden="true"
                >→</span
              >
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ app.description }}
            </p>
          </button>
        </div>
      </section>

      <!-- ── Webpack Remotes ── -->
      <section class="space-y-4" aria-labelledby="webpack-remotes-heading">
        <div class="space-y-1">
          <div class="flex items-center gap-3">
            <div class="w-8 h-px bg-red-500"></div>
            <span
              id="webpack-remotes-heading"
              class="text-xs font-semibold uppercase tracking-widest text-red-500 dark:text-red-400"
              >Webpack</span
            >
          </div>
          <p class="text-sm text-gray-400 dark:text-gray-600 pl-11">
            Built with
            <code
              class="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded"
              >@module-federation/enhanced</code
            >
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
          <button
            v-for="app in webpackRemotes"
            :key="app.name"
            role="listitem"
            :disabled="app.disabled"
            class="group text-left rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-all bg-white dark:bg-gray-900/30 space-y-1 cursor-pointer disabled:pointer-events-none disabled:opacity-40"
            :class="app.hoverBorderClass"
            :aria-label="`Open ${app.displayName}`"
            @click="goToRemote(app.name)"
          >
            <div class="flex items-center justify-between gap-2">
              <span
                class="text-base font-semibold leading-snug"
                :class="app.accentClass"
              >
                {{ app.framework }}
                <span class="text-gray-400 dark:text-gray-600 font-normal"
                  >/ Webpack</span
                >
              </span>
              <span
                class="shrink-0 text-gray-400 dark:text-gray-600 transition-colors"
                :class="app.arrowHoverClass"
                aria-hidden="true"
                >→</span
              >
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ app.description }}
            </p>
          </button>
        </div>
      </section>

      <!-- ── Other Remotes ── -->
      <section class="space-y-4" aria-labelledby="other-remotes-heading">
        <div class="space-y-1">
          <div class="flex items-center gap-3">
            <div class="w-8 h-px bg-pink-500"></div>
            <span
              id="other-remotes-heading"
              class="text-xs font-semibold uppercase tracking-widest text-pink-500 dark:text-pink-400"
              >Other</span
            >
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
          <button
            v-for="app in otherRemotes"
            :key="app.name"
            role="listitem"
            :disabled="app.disabled"
            class="group text-left rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-all bg-white dark:bg-gray-900/30 space-y-1 cursor-pointer disabled:pointer-events-none disabled:opacity-40"
            :class="app.hoverBorderClass"
            :aria-label="`Open ${app.displayName}${app.disabled ? ' – unavailable' : ''}`"
            @click="!app.disabled && goToRemote(app.name)"
          >
            <div class="flex items-center justify-between gap-2">
              <span
                class="text-base font-semibold leading-snug"
                :class="app.accentClass"
              >
                {{ app.framework }}
                <span class="text-gray-400 dark:text-gray-600 font-normal"
                  >/ {{ app.bundler }}</span
                >
              </span>
              <span
                v-if="app.disabled"
                class="shrink-0 text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700"
              >
                WIP
              </span>
              <span
                v-else
                class="shrink-0 text-gray-400 dark:text-gray-600 transition-colors"
                :class="app.arrowHoverClass"
                aria-hidden="true"
                >→</span
              >
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ app.description }}
            </p>
          </button>
        </div>
      </section>

      <!-- ── Footer note ── -->
      <div
        class="border-l-2 border-green-500 pl-4 bg-green-50 dark:bg-green-950/20 py-3 pr-3 rounded-r-lg"
        role="note"
      >
        <p class="text-base text-green-800 dark:text-green-300">
          Each remote runs on its own port and is loaded independently — the
          host picks up remote changes on next load with no redeployment.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import GoBackBtn from "../components/GoBack/GoBackBtn.vue";

const router = useRouter();

const viteRemotes = [
  {
    name: "vite_react_remoteapp",
    displayName: "Vite + React Remote",
    framework: "React",
    description: "React 18 · TypeScript · Tailwind · PrimeReact",
    accentClass: "text-blue-600 dark:text-blue-400",
    hoverBorderClass: "hover:border-blue-400 dark:hover:border-blue-600",
    arrowHoverClass: "group-hover:text-blue-500",
    disabled: false,
  },
  {
    name: "vite_vue_remoteapp",
    displayName: "Vite + Vue Remote",
    framework: "Vue",
    description: "Vue 3 · TypeScript · Tailwind v4 · PrimeVue",
    accentClass: "text-green-600 dark:text-green-400",
    hoverBorderClass: "hover:border-green-400 dark:hover:border-green-600",
    arrowHoverClass: "group-hover:text-green-500",
    disabled: false,
  },
  {
    name: "vite_svelte_remoteapp",
    displayName: "Vite + Svelte Remote",
    framework: "Svelte",
    description: "Svelte 4 · TypeScript · CSS",
    accentClass: "text-orange-600 dark:text-orange-400",
    hoverBorderClass: "hover:border-orange-400 dark:hover:border-orange-600",
    arrowHoverClass: "group-hover:text-orange-500",
    disabled: false,
  },
  {
    name: "vite_solidjs_remoteapp",
    displayName: "Vite + SolidJS Remote",
    framework: "SolidJS",
    description: "SolidJS · TypeScript · CSS Modules",
    accentClass: "text-red-600 dark:text-red-400",
    hoverBorderClass: "hover:border-red-400 dark:hover:border-red-600",
    arrowHoverClass: "group-hover:text-red-500",
    disabled: false,
  },
];

const webpackRemotes = [
  {
    name: "webpack_react_remoteapp",
    displayName: "Webpack + React Remote",
    framework: "React",
    description: "React 19 · TypeScript · Webpack 5",
    accentClass: "text-blue-600 dark:text-blue-400",
    hoverBorderClass: "hover:border-blue-400 dark:hover:border-blue-600",
    arrowHoverClass: "group-hover:text-blue-500",
    disabled: false,
  },
  {
    name: "webpack_vue_remoteapp",
    displayName: "Webpack + Vue Remote",
    framework: "Vue",
    description: "Vue 3 · TypeScript · SCSS · Webpack 5",
    accentClass: "text-green-600 dark:text-green-400",
    hoverBorderClass: "hover:border-green-400 dark:hover:border-green-600",
    arrowHoverClass: "group-hover:text-green-500",
    disabled: false,
  },
];

const otherRemotes = [
  {
    name: "angular_remoteapp",
    displayName: "Angular Remote",
    framework: "Angular",
    bundler: "Native Federation",
    description: "Angular · TypeScript · @angular-architects/native-federation",
    accentClass: "text-pink-600 dark:text-pink-400",
    hoverBorderClass: "hover:border-pink-400 dark:hover:border-pink-600",
    arrowHoverClass: "group-hover:text-pink-500",
    disabled: false,
  },
];

function goToRemote(appName: string) {
  router.push({ name: "RemoteApp", params: { appName } });
}
</script>
