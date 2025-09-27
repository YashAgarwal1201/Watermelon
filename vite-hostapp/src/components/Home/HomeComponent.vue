// File: components/Home/HomeComponent.vue

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

      <!-- Introduction Section -->
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
            <div
              class="bg-white dark:bg-gray-900/50 border border-pink-200 dark:border-pink-800 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <h4
                class="font-bold text-blue-600 dark:text-blue-400 text-lg mb-2"
              >
                <a
                  href="https://react.dev/"
                  target="_blank"
                  class="hover:text-blue-700 dark:hover:text-blue-300 underline"
                  >React</a
                >
                Remote
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                React 18 + TypeScript components
              </p>
            </div>
            <div
              class="bg-white dark:bg-gray-900/50 border border-pink-200 dark:border-pink-800 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <h4
                class="font-bold text-green-600 dark:text-green-400 text-lg mb-2"
              >
                <a
                  href="https://vuejs.org/"
                  target="_blank"
                  class="hover:text-green-700 dark:hover:text-green-300 underline"
                  >Vue</a
                >
                Remote
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Vue 3 Composition API components
              </p>
            </div>
            <div
              class="bg-white dark:bg-gray-900/50 border border-pink-200 dark:border-pink-800 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <h4
                class="font-bold text-orange-600 dark:text-orange-400 text-lg mb-2"
              >
                <a
                  href="https://svelte.dev/"
                  target="_blank"
                  class="hover:text-orange-700 dark:hover:text-orange-300 underline"
                  >Svelte</a
                >
                Remote
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Svelte components with stores
              </p>
            </div>
            <div
              class="bg-white dark:bg-gray-900/50 border border-pink-200 dark:border-pink-800 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <h4 class="font-bold text-red-600 dark:text-red-400 text-lg mb-2">
                <a
                  href="https://www.solidjs.com/"
                  target="_blank"
                  class="hover:text-red-700 dark:hover:text-red-300 underline"
                  >SolidJS</a
                >
                Remote
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Solid components with signals
              </p>
            </div>
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

      <!-- Benefits -->
      <div
        class="bg-gradient-to-br from-green-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl lg:rounded-3xl shadow-lg p-6 border border-green-200 dark:border-gray-700"
      >
        <h2
          class="text-3xl font-bold text-green-700 dark:text-green-400 mb-6 font-heading"
        >
          🚀 Why This Architecture?
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
                    Different teams, different frameworks</span
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
                    Deploy remotes without touching host</span
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
                    Mix React, Vue, Svelte, etc.</span
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
                    Add new microfrontends easily</span
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
                    Remote failures don't crash the host</span
                  >
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3
              class="text-2xl font-bold text-red-600 dark:text-red-400 mb-4 flex items-center"
            >
              ⚠️ Considerations
            </h3>
            <div class="space-y-3">
              <div class="flex items-start space-x-3">
                <span class="text-red-500 dark:text-red-400 mt-1">•</span>
                <span class="text-gray-700 dark:text-gray-300"
                  >Network latency for remote loading</span
                >
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-red-500 dark:text-red-400 mt-1">•</span>
                <span class="text-gray-700 dark:text-gray-300"
                  >Shared dependency version management</span
                >
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-red-500 dark:text-red-400 mt-1">•</span>
                <span class="text-gray-700 dark:text-gray-300"
                  >Cross-app state coordination</span
                >
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-red-500 dark:text-red-400 mt-1">•</span>
                <span class="text-gray-700 dark:text-gray-300"
                  >Testing complexity increases</span
                >
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-red-500 dark:text-red-400 mt-1">•</span>
                <span class="text-gray-700 dark:text-gray-300"
                  >Build and deployment orchestration</span
                >
              </div>
            </div>
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
export default {
  name: "HomePage",
};
</script>
