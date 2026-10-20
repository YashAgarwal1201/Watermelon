<!-- vite-hostapp/src/components/Home/HomeComponent.vue -->

<template>
  <div
    class="w-full h-full overflow-y-auto bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-200"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16 sm:space-y-20">
      <!-- ── HERO ── -->
      <header class="text-center space-y-6">
        <div
          class="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/80 shadow-xs"
        >
          <span>Polyglot Microfrontend Platform</span>
        </div>

        <h1
          class="font-heading text-5xl sm:text-7xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-tight"
        >
          Watermelon
        </h1>

        <p
          class="text-lg sm:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
        >
          An enterprise polyglot microfrontend platform orchestrating 10 applications across
          <strong>Module Federation</strong>, <strong>W3C Custom Elements</strong>, and
          <strong>Sandboxed Iframes</strong> with unified communication and runtime isolation.
        </p>

        <!-- Primary Action CTAs -->
        <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
          <RouterLink
            to="/remote"
            class="px-6 py-3.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-base transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Remotes</span>
            <ArrowRight :size="18" />
          </RouterLink>

          <RouterLink
            to="/architecture"
            class="px-6 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-gray-800 dark:text-gray-200 font-semibold text-base transition-colors bg-white dark:bg-gray-900 shadow-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <BookOpen :size="18" class="text-pink-600 dark:text-pink-400" />
            <span>Architecture Case Study</span>
          </RouterLink>
        </div>
      </header>

      <!-- ── 3 PARADIGMS AT A GLANCE ── -->
      <section class="space-y-6" aria-labelledby="paradigms-glance-heading">
        <div class="space-y-1">
          <h2
            id="paradigms-glance-heading"
            class="text-2xl sm:text-3xl font-bold font-heading text-gray-900 dark:text-white"
          >
            3 Architectural Paradigms
          </h2>
          <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Real enterprise systems combine multiple isolation strategies depending on trust boundaries, performance requirements, and technology stacks.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <!-- Paradigm 1: MF -->
          <div
            class="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900/40 space-y-4 shadow-xs"
          >
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Zap :size="20" />
              </div>
              <span class="text-sm font-semibold px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                6 Applications
              </span>
            </div>

            <div class="space-y-2">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white font-heading">
                Module Federation
              </h3>
              <p class="text-base font-semibold text-blue-600 dark:text-blue-400">
                Runtime ESM · Vite 7 & Webpack 5
              </p>
              <p class="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Direct JavaScript module sharing in the browser. Deduplicates shared runtime libraries (React, Vue) and executes natively without wrapper overhead.
              </p>
            </div>
          </div>

          <!-- Paradigm 2: Web Components -->
          <div
            class="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900/40 space-y-4 shadow-xs"
          >
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                <ShieldCheck :size="20" />
              </div>
              <span class="text-sm font-semibold px-3 py-1 rounded-lg bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300">
                3 Applications
              </span>
            </div>

            <div class="space-y-2">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white font-heading">
                W3C Custom Elements
              </h3>
              <p class="text-base font-semibold text-pink-600 dark:text-pink-400">
                Shadow DOM · Angular, Lit & Vue CE
              </p>
              <p class="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Native browser custom elements. The Shadow DOM boundary encapsulates CSS styles completely, preventing styling bleed between different framework versions.
              </p>
            </div>
          </div>

          <!-- Paradigm 3: Sandboxed Iframes -->
          <div
            class="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900/40 space-y-4 shadow-xs"
          >
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Box :size="20" />
              </div>
              <span class="text-sm font-semibold px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                2 Applications
              </span>
            </div>

            <div class="space-y-2">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white font-heading">
                Sandboxed Iframes
              </h3>
              <p class="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                Process Isolation · @watermelon/bridge
              </p>
              <p class="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Absolute thread and process boundary with 100% crash immunity. Dynamic height resizing and event sync powered by a typed postMessage bridge.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── REMOTES FLEET DIRECTORY ── -->
      <section class="space-y-8" aria-labelledby="applications-fleet-heading">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div class="space-y-1">
            <h2
              id="applications-fleet-heading"
              class="text-2xl sm:text-3xl font-bold font-heading text-gray-900 dark:text-white"
            >
              Applications Fleet
            </h2>
            <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Select an application to launch and test it live inside the host shell.
            </p>
          </div>

          <RouterLink
            to="/remote"
            class="text-base font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 inline-flex items-center gap-1.5 shrink-0"
          >
            <span>View Full Remote Gallery</span>
            <ArrowRight :size="18" />
          </RouterLink>
        </div>

        <!-- Group 1: Module Federation -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              <h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Module Federation Remotes
              </h3>
            </div>
            <span class="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400">
              Vite 7 & Webpack 5
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <RouterLink
              v-for="app in mfRemotes"
              :key="app.route"
              :to="app.route"
              class="group rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all bg-white dark:bg-gray-900/40 space-y-4 flex flex-col justify-between"
            >
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xl font-bold" :class="app.titleClass">
                    {{ app.name }}
                  </span>
                  <span class="text-sm font-mono font-bold px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                    :{{ app.port }}
                  </span>
                </div>
                <p class="text-base font-semibold text-gray-800 dark:text-gray-200">
                  {{ app.bundler }}
                </p>
                <p class="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {{ app.description }}
                </p>
              </div>

              <div class="pt-3 flex items-center justify-between text-sm font-semibold text-blue-600 dark:text-blue-400 border-t border-gray-100 dark:border-gray-800/80">
                <span>Launch Remote</span>
                <ArrowRight :size="16" class="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </RouterLink>
          </div>
        </div>

        <!-- Group 2: Web Components -->
        <div class="space-y-4 pt-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-2.5 h-2.5 rounded-full bg-pink-500"></div>
              <h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                W3C Custom Element Remotes
              </h3>
            </div>
            <span class="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400">
              Shadow DOM Isolation
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <RouterLink
              v-for="app in wcRemotes"
              :key="app.route"
              :to="app.route"
              class="group rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 hover:border-pink-500 dark:hover:border-pink-500 hover:shadow-md transition-all bg-white dark:bg-gray-900/40 space-y-4 flex flex-col justify-between"
            >
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xl font-bold" :class="app.titleClass">
                    {{ app.name }}
                  </span>
                  <span class="text-sm font-mono font-bold px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                    :{{ app.port }}
                  </span>
                </div>
                <p class="text-base font-semibold text-gray-800 dark:text-gray-200">
                  {{ app.bundler }}
                </p>
                <p class="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {{ app.description }}
                </p>
              </div>

              <div class="pt-3 flex items-center justify-between text-sm font-semibold text-pink-600 dark:text-pink-400 border-t border-gray-100 dark:border-gray-800/80">
                <span>Launch Remote</span>
                <ArrowRight :size="16" class="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </RouterLink>
          </div>
        </div>

        <!-- Group 3: Sandboxed Iframes -->
        <div class="space-y-4 pt-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Sandboxed Iframe Remotes
              </h3>
            </div>
            <span class="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400">
              Hard Process Boundary
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <RouterLink
              v-for="app in iframeRemotes"
              :key="app.route"
              :to="app.route"
              class="group rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all bg-white dark:bg-gray-900/40 space-y-4 flex flex-col justify-between"
            >
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xl font-bold" :class="app.titleClass">
                    {{ app.name }}
                  </span>
                  <span class="text-sm font-mono font-bold px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                    :{{ app.port }}
                  </span>
                </div>
                <p class="text-base font-semibold text-gray-800 dark:text-gray-200">
                  {{ app.bundler }}
                </p>
                <p class="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {{ app.description }}
                </p>
              </div>

              <div class="pt-3 flex items-center justify-between text-sm font-semibold text-emerald-600 dark:text-emerald-400 border-t border-gray-100 dark:border-gray-800/80">
                <span>Launch Remote</span>
                <ArrowRight :size="16" class="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- ── ARCHITECTURE CASE STUDY CALLOUT BANNER ── -->
      <section aria-labelledby="case-study-banner-heading">
        <div
          class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs"
        >
          <div class="space-y-2">
            <div class="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">
              <BookOpen :size="16" />
              <span>Technical Deep Dive</span>
            </div>
            <h3
              id="case-study-banner-heading"
              class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-heading"
            >
              Engineering Case Study & Decision Matrix
            </h3>
            <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
              Explore our comprehensive 3-paradigm evaluation matrix, runtime lifecycles, and real-world findings
              covering Shadow DOM portal styling, CSP security headers, and 80%+ RAM reduction.
            </p>
          </div>

          <RouterLink
            to="/architecture"
            class="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-base transition-colors shrink-0 shadow-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Read Case Study</span>
            <ArrowRight :size="18" />
          </RouterLink>
        </div>
      </section>

      <!-- ── FOOTER ── -->
      <footer
        class="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div class="space-y-1">
          <p class="text-base font-bold text-gray-900 dark:text-white font-heading">
            Watermelon Platform
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Vue 3 Host Shell · 10 Polyglot Remotes · 3 Paradigms · @watermelon/bridge
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-4 text-sm font-medium">
          <RouterLink
            to="/architecture"
            class="text-pink-600 dark:text-pink-400 hover:underline"
          >
            Architecture
          </RouterLink>
          <span class="text-gray-300 dark:text-gray-700">·</span>
          <RouterLink
            to="/remote"
            class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            All Remotes
          </RouterLink>
          <span class="text-gray-300 dark:text-gray-700">·</span>
          <a
            href="https://github.com/originjs/vite-plugin-federation"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Vite Federation
          </a>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { ArrowRight, BookOpen, Box, ShieldCheck, Zap } from "lucide-vue-next";

const mfRemotes = [
  {
    name: "React 19",
    bundler: "Vite 7",
    port: 5251,
    route: "/remote/vite_react_remoteapp",
    titleClass: "text-blue-600 dark:text-blue-400",
    description: "React 19 · TypeScript · Tailwind CSS · PrimeReact UI",
  },
  {
    name: "Vue 3",
    bundler: "Vite 7",
    port: 5252,
    route: "/remote/vite_vue_remoteapp",
    titleClass: "text-green-600 dark:text-green-400",
    description: "Vue 3 · TypeScript · Tailwind v4 · PrimeVue UI",
  },
  {
    name: "Svelte 5",
    bundler: "Vite 7",
    port: 5253,
    route: "/remote/vite_svelte_remoteapp",
    titleClass: "text-orange-600 dark:text-orange-400",
    description: "Svelte 5 Runes · TypeScript · Scoped Component CSS",
  },
  {
    name: "SolidJS",
    bundler: "Vite 7",
    port: 5254,
    route: "/remote/vite_solidjs_remoteapp",
    titleClass: "text-red-600 dark:text-red-400",
    description: "SolidJS · Fine-grained Reactivity · CSS Modules",
  },
  {
    name: "React 19",
    bundler: "Webpack 5",
    port: 5161,
    route: "/remote/webpack_react_remoteapp",
    titleClass: "text-blue-600 dark:text-blue-400",
    description: "React 19 · TypeScript · Webpack 5 Module Federation",
  },
  {
    name: "Vue 3",
    bundler: "Webpack 5",
    port: 5162,
    route: "/remote/webpack_vue_remoteapp",
    titleClass: "text-green-600 dark:text-green-400",
    description: "Vue 3 · TypeScript · Webpack 5 Module Federation",
  },
];

const wcRemotes = [
  {
    name: "Angular 20",
    bundler: "Angular CLI / Element",
    port: 4201,
    route: "/remote/angular_remoteapp",
    titleClass: "text-pink-600 dark:text-pink-400",
    description: "Angular 20 Zoneless · Custom Element (<app-root>)",
  },
  {
    name: "Lit 3",
    bundler: "Vite 7 / Custom Element",
    port: 5302,
    route: "/remote/wc_lit_remoteapp",
    titleClass: "text-cyan-600 dark:text-cyan-400",
    description: "W3C Custom Element Notification Center (<wm-notification-center>)",
  },
  {
    name: "Vue 3 CE",
    bundler: "Vite 7 / defineCustomElement",
    port: 5303,
    route: "/remote/wc_vue_remoteapp",
    titleClass: "text-emerald-600 dark:text-emerald-400",
    description: "Vue 3 defineCustomElement User Profile (<wm-user-profile>)",
  },
];

const iframeRemotes = [
  {
    name: "Vite React 19",
    bundler: "Vite 7 Sandbox",
    port: 5300,
    route: "/remote/iframe_vite_app",
    titleClass: "text-blue-600 dark:text-blue-400",
    description: "Asset Manager · Auto-Resizing · WatermelonBridge Client",
  },
  {
    name: "Next.js 16",
    bundler: "Turbopack App Router",
    port: 5301,
    route: "/remote/iframe_nextjs_app",
    titleClass: "text-indigo-600 dark:text-indigo-400",
    description: "Analytics Dashboard · App Router · CSP Anchored Sandbox",
  },
];
</script>
