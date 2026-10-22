<!-- vite-hostapp/src/components/Architecture/sections/RuntimeLifecycleSection.vue -->
<template>
  <section id="lifecycle" class="space-y-6 sm:space-y-8 scroll-mt-20 sm:scroll-mt-24">
    <div class="space-y-1.5 sm:space-y-2">
      <div class="flex items-center gap-2.5">
        <div class="w-6 sm:w-8 h-px bg-rose-500"></div>
        <span class="text-xs sm:text-sm font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
          Under The Hood
        </span>
      </div>
      <h2 class="text-xl sm:text-3xl md:text-4xl font-bold font-heading text-gray-900 dark:text-white">
        2. Runtime Lifecycle Mechanics
      </h2>
      <p class="text-xs sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
        Every remote implements an adapter contract for mounting, event synchronization, and clean teardown.
        Here is how each paradigm executes behind the scenes.
      </p>
    </div>

    <div class="grid lg:grid-cols-3 gap-4 sm:gap-6">
      <!-- Flow 1: MF -->
      <div class="rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/30 p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div class="flex items-center gap-2.5">
          <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-xs sm:text-sm">
            A
          </span>
          <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white font-heading">
            Module Federation Flow
          </h3>
        </div>
        <ol class="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          <li class="flex gap-2">
            <span class="font-bold text-blue-500 shrink-0">1.</span>
            <span><strong>Remote Resolution:</strong> Host dynamically requests <code class="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">remoteEntry.js</code> at runtime from the remote origin.</span>
          </li>
          <li class="flex gap-2">
            <span class="font-bold text-blue-500 shrink-0">2.</span>
            <span><strong>Shared Scope Negotiation:</strong> Host and remote negotiate shared vendor versions (React, Vue) to prevent duplicate downloads.</span>
          </li>
          <li class="flex gap-2">
            <span class="font-bold text-blue-500 shrink-0">3.</span>
            <span><strong>Module Factory:</strong> Remote resolves the exposed component factory (React root, Vue component, or Svelte root).</span>
          </li>
          <li class="flex gap-2">
            <span class="font-bold text-blue-500 shrink-0">4.</span>
            <span><strong>DOM Attachment & Teardown:</strong> Mounts natively into the target container with explicit unmount hooks registered.</span>
          </li>
        </ol>
      </div>

      <!-- Flow 2: Web Component -->
      <div class="rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/30 p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div class="flex items-center gap-2.5">
          <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-pink-100 dark:bg-pink-950/80 text-pink-600 dark:text-pink-400 font-bold flex items-center justify-center text-xs sm:text-sm">
            B
          </span>
          <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white font-heading">
            Custom Element Flow
          </h3>
        </div>
        <ol class="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          <li class="flex gap-2">
            <span class="font-bold text-pink-500 shrink-0">1.</span>
            <span><strong>Script Injection:</strong> Host dynamically loads the standalone custom element bundle (Angular, Lit, Vue CE).</span>
          </li>
          <li class="flex gap-2">
            <span class="font-bold text-pink-500 shrink-0">2.</span>
            <span><strong>Registry Verification:</strong> Checks <code class="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">customElements.get(tagName)</code> to avoid duplicate definitions.</span>
          </li>
          <li class="flex gap-2">
            <span class="font-bold text-pink-500 shrink-0">3.</span>
            <span><strong>Shadow Encapsulation:</strong> Instantiates custom tag; component styles remain scoped inside the Shadow Root.</span>
          </li>
          <li class="flex gap-2">
            <span class="font-bold text-pink-500 shrink-0">4.</span>
            <span><strong>Head Mutation Interception:</strong> <code class="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">patchHeadToShadow.ts</code> diverts runtime head stylesheet injections directly into the active shadow tree.</span>
          </li>
        </ol>
      </div>

      <!-- Flow 3: Sandboxed Iframe -->
      <div class="rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/30 p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div class="flex items-center gap-2.5">
          <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs sm:text-sm">
            C
          </span>
          <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white font-heading">
            Sandboxed Iframe & Bridge
          </h3>
        </div>
        <ol class="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          <li class="flex gap-2">
            <span class="font-bold text-emerald-500 shrink-0">1.</span>
            <span><strong>Sandboxed Frame:</strong> Host renders <code class="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">&lt;iframe&gt;</code> with strict sandbox attributes and CSP validation.</span>
          </li>
          <li class="flex gap-2">
            <span class="font-bold text-emerald-500 shrink-0">2.</span>
            <span><strong>Handshake Protocol:</strong> Remote client calls <code class="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">bridge.ready()</code> dispatching guarded <code class="font-mono text-xs">WM_READY</code>.</span>
          </li>
          <li class="flex gap-2">
            <span class="font-bold text-emerald-500 shrink-0">3.</span>
            <span><strong>Auto-Resizing:</strong> Client-side <code class="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">ResizeObserver</code> sends <code class="font-mono text-xs">WM_RESIZE</code>; host adjusts height seamlessly.</span>
          </li>
          <li class="flex gap-2">
            <span class="font-bold text-emerald-500 shrink-0">4.</span>
            <span><strong>Context Sync:</strong> Host broadcasts theme changes (<code class="font-mono text-xs">WM_THEME</code>) and auth tokens; remote responds seamlessly.</span>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Static lifecycle breakdown
</script>
