<!-- vite-hostapp/src/components/Home/HomeComponent.vue -->

<template>
  <div
    class="w-full h-full overflow-y-auto bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-200"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-14 sm:space-y-18">
      <!-- HERO -->
      <header class="text-center space-y-5">
        <div
          class="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full bg-pink-100 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/80 shadow-xs"
        >
          <span class="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
          <span>Enterprise Polyglot Architecture</span>
        </div>

        <h1
          class="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-tight"
        >
          Watermelon
        </h1>

        <p
          class="text-base sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
        >
          An enterprise polyglot microfrontend platform orchestrating 11 distributed applications across
          <strong class="text-blue-600 dark:text-blue-400">Module Federation</strong>,
          <strong class="text-pink-600 dark:text-pink-400">W3C Custom Elements</strong>, and
          <strong class="text-emerald-600 dark:text-emerald-400">Sandboxed Iframes</strong>
          with hardened security, runtime fault isolation, and cross-paradigm event routing.
        </p>

        <!-- Metric Telemetry Chips -->
        <div class="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800">
            <span class="font-bold text-gray-900 dark:text-white">11</span> Remotes
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800">
            <span class="font-bold text-gray-900 dark:text-white">3</span> Isolation Paradigms
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800">
            <span class="font-bold text-gray-900 dark:text-white">6</span> UI Frameworks
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800">
            <span class="font-bold text-emerald-600 dark:text-emerald-400">Live</span> Event Bus
          </span>
        </div>

        <!-- Primary Action CTAs -->
        <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
          <RouterLink
            to="/remote"
            class="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm sm:text-base transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Remote Gallery</span>
            <ArrowRight :size="18" />
          </RouterLink>

          <RouterLink
            to="/architecture"
            class="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-gray-800 dark:text-gray-200 font-semibold text-sm sm:text-base transition-colors bg-white dark:bg-gray-900 shadow-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <BookOpen :size="18" class="text-pink-600 dark:text-pink-400" />
            <span>Architecture Deep Dive</span>
          </RouterLink>
        </div>
      </header>

      <!-- 3 ARCHITECTURAL PARADIGMS -->
      <section class="space-y-6" aria-labelledby="paradigms-glance-heading">
        <div class="space-y-1">
          <h2
            id="paradigms-glance-heading"
            class="text-xl sm:text-3xl font-bold font-heading text-gray-900 dark:text-white"
          >
            3 Architectural Paradigms
          </h2>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Real enterprise systems combine multiple isolation strategies depending on trust boundaries, performance requirements, and technology stacks.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <!-- Paradigm 1: MF -->
          <div
            class="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900/40 space-y-4 shadow-xs flex flex-col justify-between"
          >
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Zap :size="20" />
                </div>
                <span class="text-xs sm:text-sm font-semibold px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                  6 Applications
                </span>
              </div>

              <div class="space-y-2">
                <h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white font-heading">
                  Module Federation
                </h3>
                <p class="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Runtime ESM : Vite 7 & Webpack 5
                </p>
                <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Direct JavaScript module sharing in the browser. Deduplicates shared runtime libraries (React 19, Vue 3) and executes natively with sub-millisecond mounting.
                </p>
              </div>

              <ul class="space-y-1.5 text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                <li class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  React 19, Vue 3, Svelte 5, SolidJS
                </li>
                <li class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Dynamic React Error Boundaries & Vue handlers
                </li>
                <li class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Zero iframe wrapper memory overhead
                </li>
              </ul>
            </div>

            <div class="pt-4">
              <RouterLink
                to="/remote"
                class="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1"
              >
                <span>View Federated Apps</span>
                <ArrowRight :size="14" />
              </RouterLink>
            </div>
          </div>

          <!-- Paradigm 2: Web Components -->
          <div
            class="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900/40 space-y-4 shadow-xs flex flex-col justify-between"
          >
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                  <ShieldCheck :size="20" />
                </div>
                <span class="text-xs sm:text-sm font-semibold px-3 py-1 rounded-lg bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300">
                  3 Applications
                </span>
              </div>

              <div class="space-y-2">
                <h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white font-heading">
                  W3C Custom Elements
                </h3>
                <p class="text-xs sm:text-sm font-semibold text-pink-600 dark:text-pink-400">
                  Shadow DOM : Angular, Lit & Vue CE
                </p>
                <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Native browser custom elements. The Shadow DOM boundary encapsulates CSS styles completely, preventing stylesheet collisions across framework versions.
                </p>
              </div>

              <ul class="space-y-1.5 text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                <li class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                  Angular 20 Zoneless, Lit 3, Vue 3 CE
                </li>
                <li class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                  Dynamic Head CSS scoping engine
                </li>
                <li class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                  Live theme attribute binding & custom events
                </li>
              </ul>
            </div>

            <div class="pt-4">
              <RouterLink
                to="/remote"
                class="text-xs sm:text-sm font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 inline-flex items-center gap-1"
              >
                <span>View Custom Elements</span>
                <ArrowRight :size="14" />
              </RouterLink>
            </div>
          </div>

          <!-- Paradigm 3: Sandboxed Iframes -->
          <div
            class="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900/40 space-y-4 shadow-xs flex flex-col justify-between"
          >
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Box :size="20" />
                </div>
                <span class="text-xs sm:text-sm font-semibold px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  2 Applications
                </span>
              </div>

              <div class="space-y-2">
                <h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white font-heading">
                  Sandboxed Iframes
                </h3>
                <p class="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  Hard Process Boundary : @watermelon/bridge
                </p>
                <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Isolated browsing context with process fault containment. Dynamic height resizing, origin verification, and event synchronization over postMessage.
                </p>
              </div>

              <ul class="space-y-1.5 text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                <li class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Vite SPA Asset Manager & Next.js 16 Analytics
                </li>
                <li class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Strict origin validation & sandbox restrictions
                </li>
                <li class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Auto-resizing via ResizeObserver bridge
                </li>
              </ul>
            </div>

            <div class="pt-4">
              <RouterLink
                to="/remote"
                class="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 inline-flex items-center gap-1"
              >
                <span>View Iframe Remotes</span>
                <ArrowRight :size="14" />
              </RouterLink>
            </div>
          </div>
        </div>
      </section>

      <!-- SYSTEM GUARANTEES & ARCHITECTURAL HIGHLIGHTS -->
      <section class="space-y-6" aria-labelledby="system-guarantees-heading">
        <div class="space-y-1">
          <h2
            id="system-guarantees-heading"
            class="text-xl sm:text-3xl font-bold font-heading text-gray-900 dark:text-white"
          >
            Engineering Guarantees
          </h2>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Core mechanisms ensuring reliability, security, and scalability across independent release cycles.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- Pillar 1 -->
          <div class="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-gray-900/40 space-y-3 shadow-xs">
            <div class="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
              <ShieldCheck :size="18" />
            </div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">
              Blast Radius Isolation
            </h3>
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Remote exceptions are isolated by React Error Boundaries, Vue error handlers, and iframe process barriers. Host navigation remains uninterrupted.
            </p>
          </div>

          <!-- Pillar 2 -->
          <div class="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-gray-900/40 space-y-3 shadow-xs">
            <div class="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Zap :size="18" />
            </div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">
              Resilient Event Bus
            </h3>
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Decoupled pub/sub with window CustomEvent dispatching. Synchronizes theme, auth, and state across iframes and custom elements safely.
            </p>
          </div>

          <!-- Pillar 3 -->
          <div class="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-gray-900/40 space-y-3 shadow-xs">
            <div class="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Box :size="18" />
            </div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">
              Zero-Leak Lifecycles
            </h3>
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Deterministic unmount hooks clean up ResizeObservers, postMessage listeners, and shadow DOM stylesheets on route changes.
            </p>
          </div>

          <!-- Pillar 4 -->
          <div class="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-gray-900/40 space-y-3 shadow-xs">
            <div class="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <BookOpen :size="18" />
            </div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">
              Dynamic Head Scoping
            </h3>
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Intercepts runtime head stylesheet injections from CSS-in-JS libraries and diverts them into Shadow DOM to prevent global style pollution.
            </p>
          </div>
        </div>
      </section>

      <!-- FLEET MATRIX OVERVIEW (Compact Scannable Grid) -->
      <section class="space-y-6" aria-labelledby="fleet-summary-heading">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div class="space-y-1">
            <h2
              id="fleet-summary-heading"
              class="text-xl sm:text-3xl font-bold font-heading text-gray-900 dark:text-white"
            >
              Applications Fleet (11 Remotes)
            </h2>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Overview of all active applications across ports, bundlers, and integration strategies.
            </p>
          </div>

          <RouterLink
            to="/remote"
            class="text-sm sm:text-base font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 inline-flex items-center gap-1.5 shrink-0"
          >
            <span>Open Interactive Gallery</span>
            <ArrowRight :size="18" />
          </RouterLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <RouterLink
            v-for="app in allFleetSummary"
            :key="app.route"
            :to="app.route"
            class="group rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-pink-500 dark:hover:border-pink-500 hover:shadow-xs transition-all bg-white dark:bg-gray-900/40 flex items-center justify-between"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full" :class="app.dotColor"></span>
                <span class="text-sm sm:text-base font-bold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                  {{ app.name }}
                </span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ app.paradigm }} : {{ app.bundler }}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                :{{ app.port }}
              </span>
              <ArrowRight :size="14" class="text-gray-400 group-hover:text-pink-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </RouterLink>
        </div>
      </section>

      <!-- ARCHITECTURE CASE STUDY CALLOUT BANNER -->
      <section aria-labelledby="case-study-banner-heading">
        <div
          class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs"
        >
          <div class="space-y-2">
            <div class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">
              <BookOpen :size="16" />
              <span>Technical Deep Dive</span>
            </div>
            <h3
              id="case-study-banner-heading"
              class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white font-heading"
            >
              Forensic Case Studies & Trade-Off Matrix
            </h3>
            <p class="text-xs sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
              Explore 5 concrete engineering findings with root causes, failed attempts, and code-verified fixes covering Shadow DOM head interception, Vite CSS-in-JS assets, Next.js frame CSP, unmount lifecycle leaks, and Angular Zone.js runtime collisions.
            </p>
          </div>

          <RouterLink
            to="/architecture"
            class="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm sm:text-base transition-colors shrink-0 shadow-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Read Case Study</span>
            <ArrowRight :size="18" />
          </RouterLink>
        </div>
      </section>

      <!-- FOOTER -->
      <footer
        class="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div class="space-y-1">
          <p class="text-sm sm:text-base font-bold text-gray-900 dark:text-white font-heading">
            Watermelon Platform
          </p>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Vue 3 Host Shell : 11 Polyglot Remotes : 3 Paradigms : @watermelon/bridge
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium">
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

const allFleetSummary = [
  {
    name: "React 19 (Vite)",
    paradigm: "Module Federation",
    bundler: "Vite 7",
    port: 5251,
    route: "/remote/vite_react_remoteapp",
    dotColor: "bg-blue-500",
  },
  {
    name: "Vue 3 (Vite)",
    paradigm: "Module Federation",
    bundler: "Vite 7",
    port: 5252,
    route: "/remote/vite_vue_remoteapp",
    dotColor: "bg-blue-500",
  },
  {
    name: "Svelte 5 (Vite)",
    paradigm: "Module Federation",
    bundler: "Vite 7",
    port: 5253,
    route: "/remote/vite_svelte_remoteapp",
    dotColor: "bg-blue-500",
  },
  {
    name: "SolidJS (Vite)",
    paradigm: "Module Federation",
    bundler: "Vite 7",
    port: 5254,
    route: "/remote/vite_solidjs_remoteapp",
    dotColor: "bg-blue-500",
  },
  {
    name: "React 19 (Webpack)",
    paradigm: "Module Federation",
    bundler: "Webpack 5",
    port: 5161,
    route: "/remote/webpack_react_remoteapp",
    dotColor: "bg-blue-500",
  },
  {
    name: "Vue 3 (Webpack)",
    paradigm: "Module Federation",
    bundler: "Webpack 5",
    port: 5162,
    route: "/remote/webpack_vue_remoteapp",
    dotColor: "bg-blue-500",
  },
  {
    name: "Angular 20 Zoneless",
    paradigm: "Custom Element",
    bundler: "Angular CLI",
    port: 4201,
    route: "/remote/angular_remoteapp",
    dotColor: "bg-pink-500",
  },
  {
    name: "Lit 3 Notifications",
    paradigm: "Custom Element",
    bundler: "Vite 7",
    port: 5302,
    route: "/remote/wc_lit_remoteapp",
    dotColor: "bg-pink-500",
  },
  {
    name: "Vue 3 User Profile",
    paradigm: "Custom Element",
    bundler: "Vite 7",
    port: 5303,
    route: "/remote/wc_vue_remoteapp",
    dotColor: "bg-pink-500",
  },
  {
    name: "Vite Asset Manager",
    paradigm: "Sandboxed Iframe",
    bundler: "Vite 7",
    port: 5300,
    route: "/remote/iframe_vite_app",
    dotColor: "bg-emerald-500",
  },
  {
    name: "Next.js 16 Analytics",
    paradigm: "Sandboxed Iframe",
    bundler: "Turbopack",
    port: 5301,
    route: "/remote/iframe_nextjs_app",
    dotColor: "bg-emerald-500",
  },
];
</script>
