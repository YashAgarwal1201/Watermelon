<!-- vite-hostapp/src/components/Architecture/sections/ParadigmMatrixSection.vue -->
<template>
  <section id="paradigms" class="space-y-6 sm:space-y-8 scroll-mt-20 sm:scroll-mt-24">
    <!-- Header -->
    <div class="space-y-1.5 sm:space-y-2">
      <div class="flex items-center gap-2.5">
        <div class="w-6 sm:w-8 h-px bg-pink-500"></div>
        <span class="text-xs sm:text-sm font-semibold uppercase tracking-widest text-pink-600 dark:text-pink-400">
          Architectural Decisions
        </span>
      </div>
      <h2 class="text-xl sm:text-3xl md:text-4xl font-bold font-heading text-gray-900 dark:text-white">
        1. The 3-Paradigm Comparison Matrix
      </h2>
      <p class="text-xs sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
        There is no single silver-bullet microfrontend technology. Watermelon demonstrates how three distinct paradigms
        complement each other across real-world organizational and technical requirements.
      </p>
    </div>

    <!-- Detailed Feature & Trade-off Matrix Container -->
    <div class="rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900/30">
      <div class="px-4 sm:px-6 py-3.5 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h3 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white font-heading">
          Detailed Feature & Trade-off Matrix
        </h3>
        <span class="text-xs font-mono text-gray-500 dark:text-gray-400">
          6 Core Dimensions
        </span>
      </div>

      <!-- Desktop Table View (md+) -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-gray-50/50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 font-bold text-xs uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th scope="col" class="py-3 px-4 sm:px-6 whitespace-nowrap">Evaluation Criteria</th>
              <th scope="col" class="py-3 px-4 sm:px-6">Module Federation</th>
              <th scope="col" class="py-3 px-4 sm:px-6">Web Components</th>
              <th scope="col" class="py-3 px-4 sm:px-6">Sandboxed Iframes</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800 font-content">
            <tr
              v-for="row in matrixRows"
              :key="row.criteria"
              class="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors"
            >
              <th scope="row" class="py-3 sm:py-3.5 px-4 sm:px-6 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                {{ row.criteria }}
              </th>
              <td class="py-3 sm:py-3.5 px-4 sm:px-6 text-gray-700 dark:text-gray-300">
                {{ row.mf }}
              </td>
              <td class="py-3 sm:py-3.5 px-4 sm:px-6 text-gray-700 dark:text-gray-300">
                {{ row.wc }}
              </td>
              <td class="py-3 sm:py-3.5 px-4 sm:px-6 text-gray-700 dark:text-gray-300">
                {{ row.iframe }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Responsive Card View (< md) -->
      <div class="md:hidden divide-y divide-gray-100 dark:divide-gray-800 p-3 space-y-3">
        <article
          v-for="row in matrixRows"
          :key="row.criteria"
          class="pt-3 first:pt-0 space-y-2.5"
        >
          <h4 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            {{ row.criteria }}
          </h4>
          <div class="grid grid-cols-1 gap-2 text-xs">
            <div class="rounded-lg p-2.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-0.5">
              <span class="font-semibold text-blue-700 dark:text-blue-300 block">Module Federation</span>
              <p class="text-gray-700 dark:text-gray-300">{{ row.mf }}</p>
            </div>
            <div class="rounded-lg p-2.5 bg-pink-50/50 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/40 space-y-0.5">
              <span class="font-semibold text-pink-700 dark:text-pink-300 block">Web Components</span>
              <p class="text-gray-700 dark:text-gray-300">{{ row.wc }}</p>
            </div>
            <div class="rounded-lg p-2.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-0.5">
              <span class="font-semibold text-emerald-700 dark:text-emerald-300 block">Sandboxed Iframes</span>
              <p class="text-gray-700 dark:text-gray-300">{{ row.iframe }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { matrixRows } from "../data/paradigms";
</script>
