<template>
  <div
    class="w-full h-full overflow-y-auto bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-200"
  >
    <div class="max-w-5xl mx-auto px-6 py-12 space-y-20">
      <!-- ── Hero ── -->
      <section class="text-center space-y-4 pb-4">
        <div
          class="inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 mb-2"
        >
          <span
            class="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse inline-block"
          ></span>
          Module Federation · Proof of Concept
        </div>
        <h1
          class="font-heading text-5xl md:text-7xl bg-gradient-to-r from-pink-500 via-red-500 to-green-500 bg-clip-text text-transparent leading-tight"
        >
          Watermelon
        </h1>
        <p
          class="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          A multi-framework micro-frontend built with Vite — four independent
          remotes, one host, zero coordination overhead.
        </p>
      </section>

      <!-- ── What / Why ── -->
      <section class="space-y-12">
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Micro Frontend -->
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-px bg-pink-500"></div>
              <h2
                class="text-xs font-semibold uppercase tracking-widest text-pink-500 dark:text-pink-400"
              >
                Concept
              </h2>
            </div>
            <h3
              class="text-2xl font-bold text-gray-900 dark:text-white font-heading"
            >
              Micro Frontends
            </h3>
            <p
              class="text-base text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              The same way microservices split a backend into independently
              deployable services, micro frontends apply that principle to the
              UI layer. Each slice of the interface — owned by a separate team,
              built in a separate codebase — is deployed on its own schedule and
              composed at runtime.
            </p>
            <p
              class="text-base text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              There's no shared build step, no coordinated release, no monorepo
              required. Each team moves at its own pace.
            </p>
          </div>

          <!-- Module Federation -->
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-px bg-green-500"></div>
              <h2
                class="text-xs font-semibold uppercase tracking-widest text-green-600 dark:text-green-400"
              >
                Mechanism
              </h2>
            </div>
            <h3
              class="text-2xl font-bold text-gray-900 dark:text-white font-heading"
            >
              Module Federation
            </h3>
            <p
              class="text-base text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              Module Federation is the Webpack 5 feature — ported to Vite via
              <code
                class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded"
                >@originjs/vite-plugin-federation</code
              >
              — that makes this possible. It lets one application expose
              JavaScript modules that other applications import
              <em>at runtime</em>, not at build time.
            </p>
            <div
              class="border-l-2 border-green-500 pl-4 bg-green-50 dark:bg-green-950/20 py-3 pr-3 rounded-r-lg"
            >
              <p class="text-base text-green-800 dark:text-green-300">
                Teams can deploy independently. The host picks up remote changes
                on next load — no redeployment required.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Architecture ── -->
      <section class="space-y-8">
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <div class="w-8 h-px bg-red-500"></div>
            <span
              class="text-xs font-semibold uppercase tracking-widest text-red-500 dark:text-red-400"
              >This project</span
            >
          </div>
          <h2
            class="text-3xl font-bold font-heading text-gray-900 dark:text-white"
          >
            Architecture
          </h2>
          <p class="text-base text-gray-500 dark:text-gray-400 max-w-2xl">
            One host application orchestrates six federated remotes across four
            different frameworks and two bundlers.
          </p>
        </div>

        <!-- Host -->
        <div
          class="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
          <div
            class="px-5 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between"
          >
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >Host Application
              <span class="text-gray-400 dark:text-gray-500 font-normal"
                >— this app</span
              ></span
            >
            <span
              class="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
              >:5150</span
            >
          </div>
          <div class="p-5 grid sm:grid-cols-2 gap-x-8 gap-y-3 text-base">
            <div class="flex gap-3">
              <span class="text-gray-400 dark:text-gray-600 shrink-0 mt-0.5"
                >▸</span
              >
              <span class="text-gray-700 dark:text-gray-300"
                ><strong class="text-gray-900 dark:text-white"
                  >Framework:</strong
                >
                <a
                  href="https://vuejs.org/"
                  target="_blank"
                  class="text-green-600 dark:text-green-400 underline hover:text-green-700 dark:hover:text-green-300"
                  >Vue 3</a
                >
                + TypeScript + PrimeVue</span
              >
            </div>
            <div class="flex gap-3">
              <span class="text-gray-400 dark:text-gray-600 shrink-0 mt-0.5"
                >▸</span
              >
              <span class="text-gray-700 dark:text-gray-300"
                ><strong class="text-gray-900 dark:text-white">Role:</strong>
                Routing, layout, remote orchestration</span
              >
            </div>
            <div class="flex gap-3">
              <span class="text-gray-400 dark:text-gray-600 shrink-0 mt-0.5"
                >▸</span
              >
              <span class="text-gray-700 dark:text-gray-300"
                ><strong class="text-gray-900 dark:text-white">Dev:</strong>
                <code
                  class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded"
                  >npm run dev</code
                ></span
              >
            </div>
            <div class="flex gap-3">
              <span class="text-gray-400 dark:text-gray-600 shrink-0 mt-0.5"
                >▸</span
              >
              <span class="text-gray-700 dark:text-gray-300"
                ><strong class="text-gray-900 dark:text-white"
                  >Federation:</strong
                >
                <code
                  class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded"
                  >npm run build && npm run preview</code
                ></span
              >
            </div>
          </div>
        </div>

        <!-- Remotes grid -->
        <div>
          <p
            class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4"
          >
            Remote Applications
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <RouterLink
              to="/remote/vite_react_remoteapp"
              class="group rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all bg-white dark:bg-gray-900/30 space-y-1"
            >
              <div class="flex items-center justify-between">
                <span
                  class="text-base font-semibold text-blue-600 dark:text-blue-400"
                >
                  <a
                    href="https://react.dev/"
                    target="_blank"
                    class="hover:underline"
                    @click.stop
                    >React</a
                  >
                  <span class="text-gray-400 dark:text-gray-600 font-normal">
                    / Vite</span
                  >
                </span>
                <span
                  class="text-xs text-gray-400 dark:text-gray-600 group-hover:text-blue-500 transition-colors"
                  >→</span
                >
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                React 18 · TypeScript · Tailwind · PrimeReact
              </p>
            </RouterLink>

            <RouterLink
              to="/remote/vite_vue_remoteapp"
              class="group rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-green-400 dark:hover:border-green-600 hover:shadow-md transition-all bg-white dark:bg-gray-900/30 space-y-1"
            >
              <div class="flex items-center justify-between">
                <span
                  class="text-base font-semibold text-green-600 dark:text-green-400"
                >
                  <a
                    href="https://vuejs.org/"
                    target="_blank"
                    class="hover:underline"
                    @click.stop
                    >Vue</a
                  >
                  <span class="text-gray-400 dark:text-gray-600 font-normal">
                    / Vite</span
                  >
                </span>
                <span
                  class="text-xs text-gray-400 dark:text-gray-600 group-hover:text-green-500 transition-colors"
                  >→</span
                >
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Vue 3 · TypeScript · Tailwind v4 · PrimeVue
              </p>
            </RouterLink>

            <RouterLink
              to="/remote/vite_svelte_remoteapp"
              class="group rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-orange-400 dark:hover:border-orange-600 hover:shadow-md transition-all bg-white dark:bg-gray-900/30 space-y-1"
            >
              <div class="flex items-center justify-between">
                <span
                  class="text-base font-semibold text-orange-600 dark:text-orange-400"
                >
                  <a
                    href="https://svelte.dev/"
                    target="_blank"
                    class="hover:underline"
                    @click.stop
                    >Svelte</a
                  >
                  <span class="text-gray-400 dark:text-gray-600 font-normal">
                    / Vite</span
                  >
                </span>
                <span
                  class="text-xs text-gray-400 dark:text-gray-600 group-hover:text-orange-500 transition-colors"
                  >→</span
                >
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Svelte 4 · TypeScript · CSS
              </p>
            </RouterLink>

            <RouterLink
              to="/remote/vite_solidjs_remoteapp"
              class="group rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-red-400 dark:hover:border-red-600 hover:shadow-md transition-all bg-white dark:bg-gray-900/30 space-y-1"
            >
              <div class="flex items-center justify-between">
                <span
                  class="text-base font-semibold text-red-600 dark:text-red-400"
                >
                  <a
                    href="https://www.solidjs.com/"
                    target="_blank"
                    class="hover:underline"
                    @click.stop
                    >SolidJS</a
                  >
                  <span class="text-gray-400 dark:text-gray-600 font-normal">
                    / Vite</span
                  >
                </span>
                <span
                  class="text-xs text-gray-400 dark:text-gray-600 group-hover:text-red-500 transition-colors"
                  >→</span
                >
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                SolidJS · TypeScript · CSS Modules
              </p>
            </RouterLink>

            <RouterLink
              to="/remote/webpack_react_remoteapp"
              class="group rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all bg-white dark:bg-gray-900/30 space-y-1"
            >
              <div class="flex items-center justify-between">
                <span
                  class="text-base font-semibold text-blue-600 dark:text-blue-400"
                >
                  <a
                    href="https://react.dev/"
                    target="_blank"
                    class="hover:underline"
                    @click.stop
                    >React</a
                  >
                  <span class="text-gray-400 dark:text-gray-600 font-normal">
                    / Webpack</span
                  >
                </span>
                <span
                  class="text-xs text-gray-400 dark:text-gray-600 group-hover:text-blue-500 transition-colors"
                  >→</span
                >
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                React 18 · TypeScript · Webpack 5
              </p>
            </RouterLink>

            <RouterLink
              to="/remote/webpack_vue_remoteapp"
              class="group rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-green-400 dark:hover:border-green-600 hover:shadow-md transition-all bg-white dark:bg-gray-900/30 space-y-1"
            >
              <div class="flex items-center justify-between">
                <span
                  class="text-base font-semibold text-green-600 dark:text-green-400"
                >
                  <a
                    href="https://vuejs.org/"
                    target="_blank"
                    class="hover:underline"
                    @click.stop
                    >Vue</a
                  >
                  <span class="text-gray-400 dark:text-gray-600 font-normal">
                    / Webpack</span
                  >
                </span>
                <span
                  class="text-xs text-gray-400 dark:text-gray-600 group-hover:text-green-500 transition-colors"
                  >→</span
                >
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Vue 3 · TypeScript · Webpack 5
              </p>
            </RouterLink>
          </div>

          <p class="text-sm text-gray-400 dark:text-gray-600 mt-3 pl-1">
            Each remote exposes its component via
            <code
              class="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded"
              >remoteEntry.js</code
            >, dynamically loaded by this host at runtime.
          </p>
        </div>
      </section>

      <!-- ── How it works ── -->
      <section class="space-y-8">
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <div class="w-8 h-px bg-pink-500"></div>
            <span
              class="text-xs font-semibold uppercase tracking-widest text-pink-500 dark:text-pink-400"
              >Under the hood</span
            >
          </div>
          <h2
            class="text-3xl font-bold font-heading text-gray-900 dark:text-white"
          >
            How Federation Works
          </h2>
        </div>

        <div
          class="space-y-0 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-200 dark:divide-gray-800"
        >
          <div class="flex gap-5 p-6">
            <div
              class="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-red-500 text-white flex items-center justify-center text-base font-bold shrink-0"
            >
              1
            </div>
            <div class="space-y-1 pt-1">
              <h4 class="text-base font-semibold text-gray-900 dark:text-white">
                Remotes expose modules
              </h4>
              <p class="text-base text-gray-600 dark:text-gray-300">
                Each remote app builds a
                <code
                  class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded"
                  >remoteEntry.js</code
                >
                that publicly declares its exposed components — essentially a
                manifest the host can read at runtime.
              </p>
            </div>
          </div>
          <div class="flex gap-5 p-6">
            <div
              class="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white flex items-center justify-center text-base font-bold shrink-0"
            >
              2
            </div>
            <div class="space-y-1 pt-1">
              <h4 class="text-base font-semibold text-gray-900 dark:text-white">
                Host imports on demand
              </h4>
              <p class="text-base text-gray-600 dark:text-gray-300">
                This host uses dynamic
                <code
                  class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded"
                  >import()</code
                >
                to fetch remote modules at runtime via their URLs — not bundled
                in, but loaded live from the remote's own deployment.
              </p>
            </div>
          </div>
          <div class="flex gap-5 p-6">
            <div
              class="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-green-500 text-white flex items-center justify-center text-base font-bold shrink-0"
            >
              3
            </div>
            <div class="space-y-1 pt-1">
              <h4 class="text-base font-semibold text-gray-900 dark:text-white">
                Shared dependencies deduplicated
              </h4>
              <p class="text-base text-gray-600 dark:text-gray-300">
                Frameworks declared as <em>shared</em> in the federation config
                are loaded once. A React remote and a React component in the
                host share the same React instance — no double-loading.
              </p>
            </div>
          </div>
          <div class="flex gap-5 p-6">
            <div
              class="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-teal-500 text-white flex items-center justify-center text-base font-bold shrink-0"
            >
              4
            </div>
            <div class="space-y-1 pt-1">
              <h4 class="text-base font-semibold text-gray-900 dark:text-white">
                Remotes render natively
              </h4>
              <p class="text-base text-gray-600 dark:text-gray-300">
                Components mount into the DOM using their own framework's
                runtime. A Vue component and a Svelte component coexist in the
                same page without knowing about each other.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Plugin ── -->
      <section class="space-y-6">
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <div class="w-8 h-px bg-purple-500"></div>
            <span
              class="text-xs font-semibold uppercase tracking-widest text-purple-500 dark:text-purple-400"
              >Tooling</span
            >
          </div>
          <h2
            class="text-3xl font-bold font-heading text-gray-900 dark:text-white"
          >
            <a
              href="https://github.com/originjs/vite-plugin-federation"
              target="_blank"
              class="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >@originjs/vite-plugin-federation</a
            >
          </h2>
          <p
            class="text-base text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed"
          >
            This project uses the <strong>vite-plugin-federation</strong> plugin
            to bring Webpack 5's Module Federation capabilities to Vite. It
            handles all the wiring: remote discovery, shared dependency
            negotiation, and dynamic import resolution.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div
            class="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-3"
          >
            <p
              class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
            >
              Plugin capabilities
            </p>
            <ul class="space-y-2">
              <li class="flex gap-2 text-base text-gray-600 dark:text-gray-300">
                <span class="text-green-500 shrink-0 mt-0.5">✓</span>Dynamic
                remote module loading at runtime
              </li>
              <li class="flex gap-2 text-base text-gray-600 dark:text-gray-300">
                <span class="text-green-500 shrink-0 mt-0.5">✓</span>Shared
                dependency deduplication
              </li>
              <li class="flex gap-2 text-base text-gray-600 dark:text-gray-300">
                <span class="text-green-500 shrink-0 mt-0.5">✓</span
                >Cross-framework federation (React ↔ Vue ↔ Svelte ↔ SolidJS)
              </li>
              <li class="flex gap-2 text-base text-gray-600 dark:text-gray-300">
                <span class="text-green-500 shrink-0 mt-0.5">✓</span>HMR in
                standalone development mode
              </li>
            </ul>
          </div>
          <div
            class="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-3"
          >
            <p
              class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
            >
              Run modes
            </p>
            <div class="space-y-3">
              <div class="space-y-1">
                <p
                  class="text-base font-medium text-gray-800 dark:text-gray-200"
                >
                  Standalone dev
                </p>
                <code
                  class="block text-sm bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300"
                  >npm run dev</code
                >
                <p class="text-sm text-gray-500 dark:text-gray-500">
                  Uses
                  <code
                    class="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded"
                    >vite.dev.config.ts</code
                  >
                  — no federation
                </p>
              </div>
              <div class="space-y-1">
                <p
                  class="text-base font-medium text-gray-800 dark:text-gray-200"
                >
                  Federation mode
                </p>
                <code
                  class="block text-sm bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300"
                  >npm run build && npm run preview</code
                >
                <p class="text-sm text-gray-500 dark:text-gray-500">
                  Uses
                  <code
                    class="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded"
                    >vite.config.ts</code
                  >
                  — remotes active
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Use Cases ── -->
      <section class="space-y-6">
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <div class="w-8 h-px bg-green-500"></div>
            <span
              class="text-xs font-semibold uppercase tracking-widest text-green-600 dark:text-green-400"
              >When to use it</span
            >
          </div>
          <h2
            class="text-3xl font-bold font-heading text-gray-900 dark:text-white"
          >
            Common Use Cases
          </h2>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div
            class="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-2"
          >
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">
              Large enterprise applications
            </h3>
            <p class="text-base text-gray-600 dark:text-gray-300">
              Multiple product teams building different features that need to
              coexist in one app — each deploying on its own cadence without
              coordinating releases.
            </p>
          </div>
          <div
            class="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-2"
          >
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">
              Design system distribution
            </h3>
            <p class="text-base text-gray-600 dark:text-gray-300">
              A component library team ships updates to consumers at runtime —
              no downstream rebuilds or version bumps required.
            </p>
          </div>
          <div
            class="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-2"
          >
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">
              Incremental migration
            </h3>
            <p class="text-base text-gray-600 dark:text-gray-300">
              New features built in a modern framework run alongside legacy
              code. Migrate page by page without a big-bang rewrite.
            </p>
          </div>
          <div
            class="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-2"
          >
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">
              Multi-team SPAs
            </h3>
            <p class="text-base text-gray-600 dark:text-gray-300">
              A single-page experience composed from independently managed route
              segments — each team owns its own slice of the URL tree.
            </p>
          </div>
        </div>
      </section>

      <!-- ── Companies ── -->
      <section class="space-y-6">
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <div class="w-8 h-px bg-blue-500"></div>
            <span
              class="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400"
              >In production</span
            >
          </div>
          <h2
            class="text-3xl font-bold font-heading text-gray-900 dark:text-white"
          >
            Companies Using Module Federation
          </h2>
          <p class="text-base text-gray-500 dark:text-gray-400">
            A non-exhaustive list of companies with verified production usage.
          </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          <div
            v-for="company in companies"
            :key="company.name"
            class="rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-3 bg-white dark:bg-gray-900/30"
          >
            <p class="text-base font-medium text-gray-800 dark:text-gray-200">
              {{ company.name }}
            </p>
            <p class="text-sm text-gray-400 dark:text-gray-500">
              {{ company.type }}
            </p>
          </div>
        </div>

        <div
          class="space-y-3 border-l-2 border-blue-300 dark:border-blue-700 pl-5"
        >
          <p class="text-base text-gray-600 dark:text-gray-300">
            <strong class="text-gray-800 dark:text-gray-200">Rivian</strong>
            runs Module Federation directly in vehicle UI — one of the more
            unusual production deployments, demonstrating the technology's
            real-time reliability at a hardware level.
          </p>
          <p class="text-base text-gray-600 dark:text-gray-300">
            <strong class="text-gray-800 dark:text-gray-200">ByteDance</strong>
            uses it across TikTok web, CapCut editor, and internal tooling at
            massive scale — and co-developed Module Federation 2.0 with the
            Webpack team.
          </p>
        </div>
      </section>

      <!-- ── Benefits & Downsides ── -->
      <section class="space-y-6">
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <div class="w-8 h-px bg-amber-500"></div>
            <span
              class="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400"
              >Trade-offs</span
            >
          </div>
          <h2
            class="text-3xl font-bold font-heading text-gray-900 dark:text-white"
          >
            Benefits & Downsides
          </h2>
        </div>

        <div class="grid lg:grid-cols-2 gap-6">
          <!-- Benefits -->
          <div
            class="rounded-2xl border border-green-200 dark:border-green-900 overflow-hidden"
          >
            <div
              class="px-5 py-3 bg-green-50 dark:bg-green-950/30 border-b border-green-200 dark:border-green-900"
            >
              <h3
                class="text-base font-semibold text-green-800 dark:text-green-300"
              >
                Benefits
              </h3>
            </div>
            <ul class="divide-y divide-gray-100 dark:divide-gray-800">
              <li
                v-for="b in benefits"
                :key="b.title"
                class="px-5 py-3 flex gap-3"
              >
                <span class="text-green-500 shrink-0 mt-0.5 text-base">✓</span>
                <div>
                  <span
                    class="text-base font-medium text-gray-900 dark:text-white"
                    >{{ b.title }}:</span
                  >
                  <span class="text-base text-gray-600 dark:text-gray-300">
                    {{ b.desc }}</span
                  >
                </div>
              </li>
            </ul>
          </div>

          <!-- Downsides -->
          <div
            class="rounded-2xl border border-red-200 dark:border-red-900 overflow-hidden"
          >
            <div
              class="px-5 py-3 bg-red-50 dark:bg-red-950/30 border-b border-red-200 dark:border-red-900"
            >
              <h3
                class="text-base font-semibold text-red-800 dark:text-red-300"
              >
                Downsides & Challenges
              </h3>
            </div>
            <ul class="divide-y divide-gray-100 dark:divide-gray-800">
              <li
                v-for="d in downsides"
                :key="d.title"
                class="px-5 py-3 flex gap-3"
              >
                <span class="text-red-400 shrink-0 mt-0.5 text-base">✕</span>
                <div>
                  <span
                    class="text-base font-medium text-gray-900 dark:text-white"
                    >{{ d.title }}:</span
                  >
                  <span class="text-base text-gray-600 dark:text-gray-300">
                    {{ d.desc }}</span
                  >
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div
          class="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 rounded-xl px-5 py-4"
        >
          <p class="text-base text-amber-800 dark:text-amber-300">
            <strong>Worth noting:</strong> Module Federation adds real
            operational complexity. For small teams or projects without DevOps
            investment, that overhead rarely pays off. It shines when you have
            multiple independent teams who genuinely cannot afford to coordinate
            deployments.
          </p>
        </div>
      </section>

      <!-- ── Alternatives ── -->
      <section class="space-y-6">
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <div class="w-8 h-px bg-purple-500"></div>
            <span
              class="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400"
              >Ecosystem</span
            >
          </div>
          <h2
            class="text-3xl font-bold font-heading text-gray-900 dark:text-white"
          >
            Alternatives
          </h2>
        </div>

        <div class="space-y-4">
          <div
            v-for="alt in alternatives"
            :key="alt.name"
            class="flex gap-5 border-l-2 pl-5 py-1"
            :class="alt.borderColor"
          >
            <div class="space-y-1 flex-1">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                <a
                  v-if="alt.href"
                  :href="alt.href"
                  target="_blank"
                  class="hover:underline"
                  :class="alt.linkColor"
                  >{{ alt.name }}</a
                >
                <span v-else>{{ alt.name }}</span>
              </h3>
              <p
                class="text-base text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                {{ alt.desc }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Footer ── -->
      <section
        class="border-t border-gray-200 dark:border-gray-800 pt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div>
          <p
            class="text-base font-semibold text-gray-900 dark:text-white font-heading"
          >
            Watermelon
          </p>
          <p class="text-sm text-gray-400 dark:text-gray-600">
            Vue 3 + Vite + Module Federation
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <a
            href="https://vitejs.dev/"
            target="_blank"
            class="text-sm px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-pink-400 dark:hover:border-pink-600 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
          >
            Vite Docs
          </a>
          <a
            href="https://github.com/originjs/vite-plugin-federation"
            target="_blank"
            class="text-sm px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-red-400 dark:hover:border-red-600 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            Plugin Repo
          </a>
          <a
            href="https://webpack.js.org/concepts/module-federation/"
            target="_blank"
            class="text-sm px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-green-400 dark:hover:border-green-600 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            Module Federation Docs
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterLink } from "vue-router";

export default defineComponent({
  name: "HomePage",
  components: { RouterLink },
  setup() {
    const companies = [
      { name: "Indeed", type: "Job Platform" },
      { name: "Cloudflare", type: "CDN & Security" },
      { name: "ByteDance", type: "Web Infrastructure" },
      { name: "DigitalOcean", type: "Cloud Platform" },
      { name: "Booking.com", type: "Travel Platform" },
      { name: "Intuit", type: "Financial Software" },
      { name: "Rivian", type: "In-Vehicle UI" },
      { name: "Epic Games", type: "Gaming Platform" },
      { name: "PayPal", type: "Payment Services" },
      { name: "Shopify", type: "E-commerce" },
      { name: "Best Buy", type: "Retail Platform" },
      { name: "Lululemon", type: "Retail" },
    ];

    const benefits = [
      {
        title: "Team independence",
        desc: "Different teams, different frameworks, autonomous deployment cycles.",
      },
      {
        title: "Incremental updates",
        desc: "Deploy a remote without touching the host or any other remote.",
      },
      {
        title: "Technology diversity",
        desc: "Mix React, Vue, and Svelte in a single page without conflict.",
      },
      {
        title: "Scalability",
        desc: "Add new microfrontends without affecting existing ones.",
      },
      {
        title: "Fault isolation",
        desc: "A failing remote doesn't crash the entire application.",
      },
      {
        title: "Optimized bundles",
        desc: "Shared dependencies are loaded once and reused across remotes.",
      },
      {
        title: "Faster iteration",
        desc: "Smaller codebases mean faster local builds and test runs.",
      },
      {
        title: "Gradual migration",
        desc: "Modernize legacy applications incrementally, one feature at a time.",
      },
    ];

    const downsides = [
      {
        title: "Operational complexity",
        desc: "Managing multiple repos, CI pipelines, and deployments simultaneously.",
      },
      {
        title: "Network overhead",
        desc: "Each remote requires its own HTTP request at load time.",
      },
      {
        title: "Dependency version skew",
        desc: "Mismatched shared library versions cause silent runtime errors.",
      },
      {
        title: "No version pinning",
        desc: "Consumers always get the latest deployed version — breaking changes ship immediately.",
      },
      {
        title: "Integration testing",
        desc: "Testing across independently deployed apps is significantly harder.",
      },
      {
        title: "Debugging difficulty",
        desc: "Tracing issues across multiple deployments requires distributed tooling.",
      },
      {
        title: "TypeScript across boundaries",
        desc: "Sharing types between remotes requires additional tooling and discipline.",
      },
      {
        title: "Ecosystem immaturity",
        desc: "Fewer battle-tested patterns and community resources than monolithic setups.",
      },
    ];

    const alternatives = [
      {
        name: "Single-SPA",
        href: "https://single-spa.js.org/",
        desc: "A meta-framework that orchestrates multiple frameworks with lifecycle management and routing. Requires build-time integration rather than runtime loading.",
        borderColor: "border-purple-300 dark:border-purple-700",
        linkColor: "text-purple-600 dark:text-purple-400",
      },
      {
        name: "Native Federation",
        href: "https://www.angulararchitects.io/blog/announcing-native-federation-1-0/",
        desc: "A build-tool-agnostic implementation using browser-native ES modules and Import Maps. Same mental model as Module Federation, no Webpack dependency.",
        borderColor: "border-indigo-300 dark:border-indigo-700",
        linkColor: "text-indigo-600 dark:text-indigo-400",
      },
      {
        name: "iFrames",
        href: null,
        desc: "The traditional isolation approach. Strong encapsulation but with real costs: performance overhead, cross-frame communication complexity, and poor SEO.",
        borderColor: "border-blue-300 dark:border-blue-700",
        linkColor: "",
      },
      {
        name: "Web Components",
        href: "https://developer.mozilla.org/en-US/docs/Web/API/Web_components",
        desc: "Browser-native custom elements with Shadow DOM style isolation. Framework-agnostic and well-suited for leaf-level reusable components, less so for full application slices.",
        borderColor: "border-cyan-300 dark:border-cyan-700",
        linkColor: "text-cyan-600 dark:text-cyan-400",
      },
      {
        name: "Bit",
        href: "https://bit.dev/",
        desc: "A component-driven platform focused on build-time sharing and versioning. Excellent for component distribution, but doesn't provide runtime federation.",
        borderColor: "border-teal-300 dark:border-teal-700",
        linkColor: "text-teal-600 dark:text-teal-400",
      },
    ];

    return { companies, benefits, downsides, alternatives };
  },
});
</script>
