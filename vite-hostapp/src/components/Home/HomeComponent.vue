<template>
  <div
    class="w-full h-full overflow-y-auto bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-200"
  >
    <div class="p-4 flex flex-col space-y-8 max-w-7xl mx-auto">
      <!-- Hero Section -->
      <div class="flex flex-col text-center py-8">
        <h1
          class="font-heading text-4xl md:text-6xl bg-gradient-to-r from-pink-500 via-red-500 to-green-500 bg-clip-text text-transparent mb-4"
        >
          Welcome to Watermelon
        </h1>
        <p class="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
          A microfrontend showcase demonstrating Module Federation across
          multiple frameworks with Vite
        </p>
      </div>

      <!-- What is Micro Frontend Section -->
      <div
        class="bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl lg:rounded-3xl shadow-lg p-6 border border-pink-200 dark:border-gray-700"
      >
        <h2
          class="text-3xl font-bold text-pink-700 dark:text-pink-400 mb-4 font-heading"
        >
          🎯 What is Micro Frontend?
        </h2>
        <p class="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
          <strong class="text-pink-600 dark:text-pink-400"
            >Micro Frontend</strong
          >
          is an architectural pattern that extends the concept of microservices
          to the frontend world. It breaks down a large, monolithic frontend
          application into smaller, independently deployable, and maintainable
          pieces. Each piece can be developed, tested, and deployed by separate
          teams using different frameworks or technologies.
        </p>
        <p class="text-gray-800 dark:text-gray-200 leading-relaxed">
          Think of it like building with LEGO blocks - each team creates their
          own block (micro frontend), and these blocks can be assembled together
          to form the complete application.
        </p>
      </div>

      <!-- Introduction Section (Module Federation) -->
      <div
        class="bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl lg:rounded-3xl shadow-lg p-6 border border-pink-200 dark:border-gray-700"
      >
        <h2
          class="text-3xl font-bold text-pink-700 dark:text-pink-400 mb-4 font-heading"
        >
          🍉 What is Module Federation?
        </h2>
        <p class="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
          Module Federation is a revolutionary feature that enables
          <strong class="text-red-600 dark:text-red-400"
            >runtime code sharing</strong
          >
          between multiple JavaScript applications. Unlike traditional
          build-time sharing where all applications must be redeployed to update
          shared components, Module Federation allows applications to
          dynamically load and share code at runtime.
        </p>
        <div
          class="bg-red-100 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-800"
        >
          <p class="text-red-800 dark:text-red-300">
            <strong>🎯 Key Benefit:</strong> Teams can develop, deploy, and
            scale independent microfrontends while still sharing components,
            utilities, and even state between applications seamlessly.
          </p>
        </div>
      </div>

      <!-- Use Cases Section -->
      <div
        class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl lg:rounded-3xl shadow-lg p-6 border border-green-200 dark:border-gray-700"
      >
        <h2
          class="text-3xl font-bold text-green-700 dark:text-green-400 mb-4 font-heading"
        >
          💼 Common Use Cases
        </h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div
            class="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-green-200 dark:border-green-800"
          >
            <h3
              class="font-bold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2"
            >
              <span>🏢</span> Large Enterprise Applications
            </h3>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Multiple teams working on different features that need to be
              composed into a unified application while maintaining team
              autonomy.
            </p>
          </div>
          <div
            class="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-green-200 dark:border-green-800"
          >
            <h3
              class="font-bold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2"
            >
              <span>🎨</span> Design System Distribution
            </h3>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Sharing a common component library across multiple applications
              without requiring redeployment when components update.
            </p>
          </div>
          <div
            class="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-green-200 dark:border-green-800"
          >
            <h3
              class="font-bold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2"
            >
              <span>🔄</span> Gradual Migration
            </h3>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Incrementally migrating from legacy systems by building new
              features in modern frameworks while keeping old code running.
            </p>
          </div>
          <div
            class="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-green-200 dark:border-green-800"
          >
            <h3
              class="font-bold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2"
            >
              <span>⚡</span> Multi-Page Applications
            </h3>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Creating a SPA-like experience by stitching together individual
              pages from different remotes, each managed independently.
            </p>
          </div>
        </div>
      </div>

      <!-- Real-World Companies Section -->
      <div
        class="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl lg:rounded-3xl shadow-lg p-6 border border-blue-200 dark:border-gray-700"
      >
        <h2
          class="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-4 font-heading"
        >
          🏢 Companies Using Module Federation
        </h2>
        <p class="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
          Module Federation is trusted by leading tech companies worldwide. Here
          are verified companies actively using it in production:
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          <div
            class="bg-white dark:bg-gray-900/50 rounded-lg p-3 text-center border border-blue-200 dark:border-blue-800"
          >
            <p class="text-sm font-medium text-blue-700 dark:text-blue-300">
              Indeed
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-400">Job Platform</p>
          </div>
          <div
            class="bg-white dark:bg-gray-900/50 rounded-lg p-3 text-center border border-blue-200 dark:border-blue-800"
          >
            <p class="text-sm font-medium text-blue-700 dark:text-blue-300">
              Cloudflare
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              CDN & Security
            </p>
          </div>
          <div
            class="bg-white dark:bg-gray-900/50 rounded-lg p-3 text-center border border-blue-200 dark:border-blue-800"
          >
            <p class="text-sm font-medium text-blue-700 dark:text-blue-300">
              ByteDance
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Web Infrastructure
            </p>
          </div>
          <div
            class="bg-white dark:bg-gray-900/50 rounded-lg p-3 text-center border border-blue-200 dark:border-blue-800"
          >
            <p class="text-sm font-medium text-blue-700 dark:text-blue-300">
              DigitalOcean
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Cloud Platform
            </p>
          </div>
          <div
            class="bg-white dark:bg-gray-900/50 rounded-lg p-3 text-center border border-blue-200 dark:border-blue-800"
          >
            <p class="text-sm font-medium text-blue-700 dark:text-blue-300">
              Booking.com
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Travel Platform
            </p>
          </div>
          <div
            class="bg-white dark:bg-gray-900/50 rounded-lg p-3 text-center border border-blue-200 dark:border-blue-800"
          >
            <p class="text-sm font-medium text-blue-700 dark:text-blue-300">
              Intuit
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Financial Software
            </p>
          </div>
          <div
            class="bg-white dark:bg-gray-900/50 rounded-lg p-3 text-center border border-blue-200 dark:border-blue-800"
          >
            <p class="text-sm font-medium text-blue-700 dark:text-blue-300">
              Rivian
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              In-Vehicle UI
            </p>
          </div>
          <div
            class="bg-white dark:bg-gray-900/50 rounded-lg p-3 text-center border border-blue-200 dark:border-blue-800"
          >
            <p class="text-sm font-medium text-blue-700 dark:text-blue-300">
              Epic Games
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Gaming Platform
            </p>
          </div>
          <div
            class="bg-white dark:bg-gray-900/50 rounded-lg p-3 text-center border border-blue-200 dark:border-blue-800"
          >
            <p class="text-sm font-medium text-blue-700 dark:text-blue-300">
              PayPal
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Payment Services
            </p>
          </div>
          <div
            class="bg-white dark:bg-gray-900/50 rounded-lg p-3 text-center border border-blue-200 dark:border-blue-800"
          >
            <p class="text-sm font-medium text-blue-700 dark:text-blue-300">
              Shopify
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-400">E-commerce</p>
          </div>
          <div
            class="bg-white dark:bg-gray-900/50 rounded-lg p-3 text-center border border-blue-200 dark:border-blue-800"
          >
            <p class="text-sm font-medium text-blue-700 dark:text-blue-300">
              Best Buy
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Retail Platform
            </p>
          </div>
          <div
            class="bg-white dark:bg-gray-900/50 rounded-lg p-3 text-center border border-blue-200 dark:border-blue-800"
          >
            <p class="text-sm font-medium text-blue-700 dark:text-blue-300">
              Lululemon
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-400">Retail</p>
          </div>
        </div>
        <div
          class="bg-blue-100 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <p class="text-blue-800 dark:text-blue-300 text-sm mb-2">
            <strong>🚗 Notable Implementation:</strong> Rivian uses Module
            Federation directly in their vehicles' user interfaces,
            demonstrating the technology's reliability and real-time performance
            capabilities.
          </p>
          <p class="text-blue-800 dark:text-blue-300 text-sm">
            <strong>🎵 ByteDance Scale:</strong> ByteDance uses Module
            Federation across their entire web infrastructure including TikTok
            website, CapCut video editor, and internal products, with Module
            Federation 2.0 being co-developed with the ByteDance team.
          </p>
        </div>
      </div>

      <!-- Architecture Overview -->
      <div
        class="bg-gradient-to-br from-green-50 to-red-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl lg:rounded-3xl shadow-lg p-6 border border-green-200 dark:border-gray-700"
      >
        <h2
          class="text-3xl font-bold text-green-700 dark:text-green-400 mb-6 font-heading"
        >
          🏗️ Our Project Architecture
        </h2>

        <!-- Host App Info -->
        <div class="mb-8">
          <h3
            class="text-2xl font-bold text-red-600 dark:text-red-400 mb-4 flex items-center"
          >
            🏠 Host Application (This App)
          </h3>
          <div
            class="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-red-200 dark:border-red-800"
          >
            <ul class="space-y-3 text-gray-700 dark:text-gray-300">
              <li class="flex items-center space-x-2">
                <span class="text-green-500 dark:text-green-400">▪</span>
                <span
                  ><strong>Framework:</strong>
                  <a
                    href="https://vuejs.org/"
                    target="_blank"
                    class="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 underline"
                    >Vue 3</a
                  >
                  with
                  <a
                    href="https://www.typescriptlang.org/"
                    target="_blank"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
                    >TypeScript</a
                  ></span
                >
              </li>
              <li class="flex items-center space-x-2">
                <span class="text-green-500 dark:text-green-400">▪</span>
                <span
                  ><strong>Role:</strong> Container that loads and orchestrates
                  remote microfrontends</span
                >
              </li>
              <li class="flex items-center space-x-2">
                <span class="text-green-500 dark:text-green-400">▪</span>
                <span
                  ><strong>Responsibilities:</strong> Routing, shared state
                  management, layout, and consuming remote components</span
                >
              </li>
              <li class="flex items-center space-x-2">
                <span class="text-green-500 dark:text-green-400">▪</span>
                <span
                  ><strong>Development:</strong>
                  <code
                    class="bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 px-2 py-1 rounded"
                    >npm run dev</code
                  ></span
                >
              </li>
            </ul>
          </div>
        </div>

        <!-- Remote Apps Info -->
        <div class="mb-6">
          <h3
            class="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-4 flex items-center"
          >
            🔌 Remote Applications
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RouterLink
              to="/remote/vite_react_remoteapp"
              class="bg-white dark:bg-gray-900/50 border border-pink-200 dark:border-pink-800 rounded-lg p-4 hover:shadow-lg transition-all hover:border-blue-400 dark:hover:border-blue-600 cursor-pointer"
            >
              <h4
                class="font-bold text-blue-600 dark:text-blue-400 text-lg mb-2"
              >
                <a
                  href="https://react.dev/"
                  target="_blank"
                  class="hover:text-blue-700 dark:hover:text-blue-300 underline"
                  @click.stop
                  >React</a
                >
                Remote (Vite)
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                React 18 + TypeScript components built with Vite
              </p>
            </RouterLink>
            <RouterLink
              to="/remote/vite_vue_remoteapp"
              class="bg-white dark:bg-gray-900/50 border border-pink-200 dark:border-pink-800 rounded-lg p-4 hover:shadow-lg transition-all hover:border-green-400 dark:hover:border-green-600 cursor-pointer"
            >
              <h4
                class="font-bold text-green-600 dark:text-green-400 text-lg mb-2"
              >
                <a
                  href="https://vuejs.org/"
                  target="_blank"
                  class="hover:text-green-700 dark:hover:text-green-300 underline"
                  @click.stop
                  >Vue</a
                >
                Remote (Vite)
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Vue 3 Composition API components built with Vite
              </p>
            </RouterLink>
            <RouterLink
              to="/remote/vite_svelte_remoteapp"
              class="bg-white dark:bg-gray-900/50 border border-pink-200 dark:border-pink-800 rounded-lg p-4 hover:shadow-lg transition-all hover:border-orange-400 dark:hover:border-orange-600 cursor-pointer"
            >
              <h4
                class="font-bold text-orange-600 dark:text-orange-400 text-lg mb-2"
              >
                <a
                  href="https://svelte.dev/"
                  target="_blank"
                  class="hover:text-orange-700 dark:hover:text-orange-300 underline"
                  @click.stop
                  >Svelte</a
                >
                Remote (Vite)
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Svelte components with stores built with Vite
              </p>
            </RouterLink>
            <RouterLink
              to="/remote/vite_solidjs_remoteapp"
              class="bg-white dark:bg-gray-900/50 border border-pink-200 dark:border-pink-800 rounded-lg p-4 hover:shadow-lg transition-all hover:border-red-400 dark:hover:border-red-600 cursor-pointer"
            >
              <h4 class="font-bold text-red-600 dark:text-red-400 text-lg mb-2">
                <a
                  href="https://www.solidjs.com/"
                  target="_blank"
                  class="hover:text-red-700 dark:hover:text-red-300 underline"
                  @click.stop
                  >SolidJS</a
                >
                Remote (Vite)
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Solid components with signals built with Vite
              </p>
            </RouterLink>
            <RouterLink
              to="/remote/webpack_react_remoteapp"
              class="bg-white dark:bg-gray-900/50 border border-pink-200 dark:border-pink-800 rounded-lg p-4 hover:shadow-lg transition-all hover:border-blue-400 dark:hover:border-blue-600 cursor-pointer"
            >
              <h4
                class="font-bold text-blue-600 dark:text-blue-400 text-lg mb-2"
              >
                <a
                  href="https://react.dev/"
                  target="_blank"
                  class="hover:text-blue-700 dark:hover:text-blue-300 underline"
                  @click.stop
                  >React</a
                >
                Remote (Webpack)
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                React 18 + TypeScript components built with Webpack 5
              </p>
            </RouterLink>
            <RouterLink
              to="/remote/webpack_vue_remoteapp"
              class="bg-white dark:bg-gray-900/50 border border-pink-200 dark:border-pink-800 rounded-lg p-4 hover:shadow-lg transition-all hover:border-green-400 dark:hover:border-green-600 cursor-pointer"
            >
              <h4
                class="font-bold text-green-600 dark:text-green-400 text-lg mb-2"
              >
                <a
                  href="https://vuejs.org/"
                  target="_blank"
                  class="hover:text-green-700 dark:hover:text-green-300 underline"
                  @click.stop
                  >Vue</a
                >
                Remote (Webpack)
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Vue 3 Composition API components built with Webpack 5
              </p>
            </RouterLink>
          </div>
        </div>

        <div
          class="bg-gradient-to-r from-pink-100 to-red-100 dark:from-pink-950/20 dark:to-red-950/20 p-4 rounded-lg border border-pink-300 dark:border-pink-700"
        >
          <p class="text-pink-800 dark:text-pink-300">
            <strong>🔄 Federation Workflow:</strong> Each remote app exposes
            specific components via
            <code class="bg-pink-200 dark:bg-pink-900/50 px-2 py-1 rounded"
              >remoteEntry.js</code
            >, and this host dynamically imports and renders them at runtime.
          </p>
        </div>
      </div>

      <!-- Plugin Information -->
      <div
        class="bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl lg:rounded-3xl shadow-lg p-6 border border-red-200 dark:border-gray-700"
      >
        <h2
          class="text-3xl font-bold text-red-700 dark:text-red-400 mb-6 font-heading"
        >
          🛠️ Technology Stack
        </h2>

        <div class="mb-6">
          <h3 class="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-3">
            <a
              href="https://github.com/originjs/vite-plugin-federation"
              target="_blank"
              class="hover:text-pink-700 dark:hover:text-pink-300 underline"
            >
              @originjs/vite-plugin-federation
            </a>
          </h3>
          <p class="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
            This project uses the
            <strong class="text-red-600 dark:text-red-400"
              >@originjs/vite-plugin-federation</strong
            >
            plugin, which brings
            <a
              href="https://webpack.js.org/concepts/module-federation/"
              target="_blank"
              class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
              >Webpack 5's Module Federation</a
            >
            capabilities to
            <a
              href="https://vitejs.dev/"
              target="_blank"
              class="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline"
              >Vite</a
            >. This plugin enables:
          </p>
          <ul class="space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li class="flex items-center space-x-2">
              <span class="text-green-500 dark:text-green-400">✓</span>
              <span>Dynamic remote module loading at runtime</span>
            </li>
            <li class="flex items-center space-x-2">
              <span class="text-green-500 dark:text-green-400">✓</span>
              <span>Shared dependency optimization (React, Vue, etc.)</span>
            </li>
            <li class="flex items-center space-x-2">
              <span class="text-green-500 dark:text-green-400">✓</span>
              <span
                >Framework-agnostic federation (React ↔ Vue ↔ Svelte ↔
                SolidJS)</span
              >
            </li>
            <li class="flex items-center space-x-2">
              <span class="text-green-500 dark:text-green-400">✓</span>
              <span>Hot module replacement (HMR) support in development</span>
            </li>
          </ul>
        </div>

        <div
          class="bg-white dark:bg-gray-900/50 p-4 rounded-lg border border-red-200 dark:border-red-800"
        >
          <h4 class="font-bold text-red-700 dark:text-red-400 mb-3">
            Development vs Federation Modes
          </h4>
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <span class="text-pink-500 dark:text-pink-400">▪</span>
              <span
                ><strong>Standalone Development:</strong>
                <code
                  class="bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 px-2 py-1 rounded"
                  >npm run dev</code
                >
                (uses vite.dev.config.ts)</span
              >
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-pink-500 dark:text-pink-400">▪</span>
              <span
                ><strong>Federation Mode:</strong>
                <code
                  class="bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 px-2 py-1 rounded"
                  >npm run build && npm run preview</code
                >
                (uses vite.config.ts)</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- How It Works -->
      <div
        class="bg-gradient-to-br from-pink-50 to-green-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl lg:rounded-3xl shadow-lg p-6 border border-pink-200 dark:border-gray-700"
      >
        <h2
          class="text-3xl font-bold text-pink-700 dark:text-pink-400 mb-6 font-heading"
        >
          ⚙️ How Federation Works Here
        </h2>

        <div class="space-y-6">
          <div class="flex items-start space-x-4">
            <div
              class="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg"
            >
              1
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-red-600 dark:text-red-400 text-lg mb-2">
                Remote Apps Expose Components
              </h4>
              <p class="text-gray-700 dark:text-gray-300">
                Each remote app builds and serves a
                <code
                  class="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded"
                  >remoteEntry.js</code
                >
                that exposes specific components
              </p>
            </div>
          </div>

          <div class="flex items-start space-x-4">
            <div
              class="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg"
            >
              2
            </div>
            <div class="flex-1">
              <h4
                class="font-bold text-pink-600 dark:text-pink-400 text-lg mb-2"
              >
                Host App Consumes Remotes
              </h4>
              <p class="text-gray-700 dark:text-gray-300">
                This host app dynamically imports components from remote apps
                using their URLs
              </p>
            </div>
          </div>

          <div class="flex items-start space-x-4">
            <div
              class="bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg"
            >
              3
            </div>
            <div class="flex-1">
              <h4
                class="font-bold text-green-600 dark:text-green-400 text-lg mb-2"
              >
                Runtime Integration
              </h4>
              <p class="text-gray-700 dark:text-gray-300">
                Components render seamlessly despite being from different
                frameworks and deployments
              </p>
            </div>
          </div>
        </div>

        <div
          class="mt-8 p-4 bg-gradient-to-r from-green-100 to-red-100 dark:from-green-950/20 dark:to-red-950/20 rounded-lg border border-green-300 dark:border-green-700"
        >
          <p class="text-green-800 dark:text-green-300 font-medium">
            <strong>🎉 Result:</strong> Independent teams can work on different
            parts of the application using their preferred frameworks, while the
            host orchestrates everything into a cohesive user experience.
          </p>
        </div>
      </div>

      <!-- Benefits & Downsides -->
      <div
        class="bg-gradient-to-br from-green-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl lg:rounded-3xl shadow-lg p-6 border border-green-200 dark:border-gray-700"
      >
        <h2
          class="text-3xl font-bold text-green-700 dark:text-green-400 mb-6 font-heading"
        >
          ⚖️ Benefits & Downsides
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3
              class="text-2xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center"
            >
              ✅ Benefits
            </h3>
            <div class="space-y-3">
              <div class="flex items-start space-x-3">
                <span class="text-green-500 dark:text-green-400 mt-1">•</span>
                <div>
                  <strong class="text-green-700 dark:text-green-300"
                    >Team Independence:</strong
                  >
                  <span class="text-gray-700 dark:text-gray-300">
                    Different teams, different frameworks, autonomous
                    deployment</span
                  >
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-green-500 dark:text-green-400 mt-1">•</span>
                <div>
                  <strong class="text-green-700 dark:text-green-300"
                    >Incremental Updates:</strong
                  >
                  <span class="text-gray-700 dark:text-gray-300">
                    Deploy remotes without touching host or other remotes</span
                  >
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-green-500 dark:text-green-400 mt-1">•</span>
                <div>
                  <strong class="text-green-700 dark:text-green-300"
                    >Technology Diversity:</strong
                  >
                  <span class="text-gray-700 dark:text-gray-300">
                    Mix React, Vue, Svelte seamlessly in one application</span
                  >
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-green-500 dark:text-green-400 mt-1">•</span>
                <div>
                  <strong class="text-green-700 dark:text-green-300"
                    >Scalability:</strong
                  >
                  <span class="text-gray-700 dark:text-gray-300">
                    Add new microfrontends easily without affecting existing
                    ones</span
                  >
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-green-500 dark:text-green-400 mt-1">•</span>
                <div>
                  <strong class="text-green-700 dark:text-green-300"
                    >Fault Isolation:</strong
                  >
                  <span class="text-gray-700 dark:text-gray-300">
                    Remote failures don't crash the entire application</span
                  >
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-green-500 dark:text-green-400 mt-1">•</span>
                <div>
                  <strong class="text-green-700 dark:text-green-300"
                    >Optimized Bundles:</strong
                  >
                  <span class="text-gray-700 dark:text-gray-300">
                    Shared dependencies loaded once and reused</span
                  >
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-green-500 dark:text-green-400 mt-1">•</span>
                <div>
                  <strong class="text-green-700 dark:text-green-300"
                    >Faster Development:</strong
                  >
                  <span class="text-gray-700 dark:text-gray-300">
                    Smaller codebases lead to faster builds and testing</span
                  >
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-green-500 dark:text-green-400 mt-1">•</span>
                <div>
                  <strong class="text-green-700 dark:text-green-300"
                    >Gradual Migration:</strong
                  >
                  <span class="text-gray-700 dark:text-gray-300">
                    Modernize legacy apps incrementally</span
                  >
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3
              class="text-2xl font-bold text-red-600 dark:text-red-400 mb-4 flex items-center"
            >
              ⚠️ Downsides & Challenges
            </h3>
            <div class="space-y-3">
              <div class="flex items-start space-x-3">
                <span class="text-red-500 dark:text-red-400 mt-1">•</span>
                <div>
                  <strong class="text-red-700 dark:text-red-300"
                    >Increased Complexity:</strong
                  >
                  <span class="text-gray-700 dark:text-gray-300">
                    Managing multiple repos, builds, and deployments</span
                  >
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-red-500 dark:text-red-400 mt-1">•</span>
                <div>
                  <strong class="text-red-700 dark:text-red-300"
                    >Network Overhead:</strong
                  >
                  <span class="text-gray-700 dark:text-gray-300">
                    Each remote requires separate HTTP requests</span
                  >
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-red-500 dark:text-red-400 mt-1">•</span>
                <div>
                  <strong class="text-red-700 dark:text-red-300"
                    >Dependency Hell:</strong
                  >
                  <span class="text-gray-700 dark:text-gray-300">
                    Version mismatches can cause runtime errors</span
                  >
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-red-500 dark:text-red-400 mt-1">•</span>
                <div>
                  <strong class="text-red-700 dark:text-red-300"
                    >No Versioning Control:</strong
                  >
                  <span class="text-gray-700 dark:text-gray-300">
                    Apps always get latest version, can break
                    functionality</span
                  >
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-red-500 dark:text-red-400 mt-1">•</span>
                <div>
                  <strong class="text-red-700 dark:text-red-300"
                    >Testing Complexity:</strong
                  >
                  <span class="text-gray-700 dark:text-gray-300">
                    Integration testing across federated apps is
                    challenging</span
                  >
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-red-500 dark:text-red-400 mt-1">•</span>
                <div>
                  <strong class="text-red-700 dark:text-red-300"
                    >Debugging Difficulty:</strong
                  >
                  <span class="text-gray-700 dark:text-gray-300">
                    Tracing issues across multiple deployments</span
                  >
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-red-500 dark:text-red-400 mt-1">•</span>
                <div>
                  <strong class="text-red-700 dark:text-red-300"
                    >TypeScript Challenges:</strong
                  >
                  <span class="text-gray-700 dark:text-gray-300">
                    Sharing types requires additional tooling</span
                  >
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-red-500 dark:text-red-400 mt-1">•</span>
                <div>
                  <strong class="text-red-700 dark:text-red-300"
                    >Limited Tooling:</strong
                  >
                  <span class="text-gray-700 dark:text-gray-300">
                    Fewer resources and community support</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="mt-6 p-4 bg-red-100 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800"
        >
          <p class="text-red-800 dark:text-red-300 text-sm">
            <strong>Important Note:</strong> Module Federation is not suitable
            for smaller projects or teams without DevOps expertise. The
            complexity overhead often outweighs benefits unless dealing with
            large-scale applications with multiple independent teams.
          </p>
        </div>
      </div>

      <!-- Alternatives Section (Moved after Benefits) -->
      <div
        class="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl lg:rounded-3xl shadow-lg p-6 border border-purple-200 dark:border-gray-700"
      >
        <h2
          class="text-3xl font-bold text-purple-700 dark:text-purple-400 mb-4 font-heading"
        >
          🔄 Alternatives to Module Federation
        </h2>
        <div class="space-y-4">
          <div class="border-l-4 border-purple-500 dark:border-purple-400 pl-4">
            <h3
              class="text-xl font-bold text-purple-700 dark:text-purple-300 mb-2"
            >
              <a
                href="https://single-spa.js.org/"
                target="_blank"
                class="hover:text-purple-600 dark:hover:text-purple-400 underline"
              >
                1. Single-SPA
              </a>
            </h3>
            <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              A JavaScript framework for frontend microservices. It acts as a
              meta-framework that orchestrates multiple frameworks to work
              together. Provides lifecycle management and routing for micro
              frontends but requires build-time integration.
            </p>
          </div>
          <div class="border-l-4 border-indigo-500 dark:border-indigo-400 pl-4">
            <h3
              class="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-2"
            >
              <a
                href="https://www.angulararchitects.io/blog/announcing-native-federation-1-0/"
                target="_blank"
                class="hover:text-indigo-600 dark:hover:text-indigo-400 underline"
              >
                2. Native Federation
              </a>
            </h3>
            <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              A build-tool-agnostic implementation that works with esbuild,
              Rollup, and other bundlers. Uses browser-native EcmaScript modules
              and Import Maps, offering the same mental model as Module
              Federation without webpack dependency.
            </p>
          </div>
          <div class="border-l-4 border-blue-500 dark:border-blue-400 pl-4">
            <h3 class="text-xl font-bold text-blue-700 dark:text-blue-300 mb-2">
              3. iFrames
            </h3>
            <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              The traditional approach using isolated iframe elements. Provides
              strong isolation but suffers from performance overhead,
              communication complexity, and SEO challenges.
            </p>
          </div>
          <div class="border-l-4 border-cyan-500 dark:border-cyan-400 pl-4">
            <h3 class="text-xl font-bold text-cyan-700 dark:text-cyan-300 mb-2">
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components"
                target="_blank"
                class="hover:text-cyan-600 dark:hover:text-cyan-400 underline"
              >
                4. Web Components
              </a>
            </h3>
            <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              Browser-native custom elements that encapsulate functionality.
              Framework-agnostic and use Shadow DOM for style isolation. Best
              for smaller, reusable components rather than full applications.
            </p>
          </div>
          <div class="border-l-4 border-teal-500 dark:border-teal-400 pl-4">
            <h3 class="text-xl font-bold text-teal-700 dark:text-teal-300 mb-2">
              <a
                href="https://bit.dev/"
                target="_blank"
                class="hover:text-teal-600 dark:hover:text-teal-400 underline"
              >
                5. Bit
              </a>
            </h3>
            <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              A component-driven development platform that enables teams to
              share and collaborate on components across projects. Focuses on
              component distribution and versioning at build time.
            </p>
          </div>
        </div>
      </div>

      <!-- Footer Links -->
      <div
        class="bg-gradient-to-r from-pink-100 to-red-100 dark:from-pink-950/20 dark:to-red-950/20 rounded-2xl lg:rounded-3xl p-6 text-center border border-pink-200 dark:border-pink-700"
      >
        <h3 class="text-xl font-bold text-pink-700 dark:text-pink-400 mb-4">
          🔗 Learn More
        </h3>
        <div class="flex flex-wrap justify-center gap-4">
          <a
            href="https://vitejs.dev/"
            target="_blank"
            class="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
          >
            Vite Documentation
          </a>
          <a
            href="https://github.com/originjs/vite-plugin-federation"
            target="_blank"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Plugin Repository
          </a>
          <a
            href="https://webpack.js.org/concepts/module-federation/"
            target="_blank"
            class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            Module Federation Docs
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RouterLink } from "vue-router";

export default {
  name: "HomePage",
  components: {
    RouterLink,
  },
};
</script>
