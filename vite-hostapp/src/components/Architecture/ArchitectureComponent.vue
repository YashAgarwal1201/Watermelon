<!-- vite-hostapp/src/components/Architecture/ArchitectureComponent.vue -->

<template>
  <main
    ref="scrollContainer"
    class="w-full h-full overflow-y-auto bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200"
  >
    <div class="max-w-6xl mx-auto px-3.5 sm:px-6 py-6 sm:py-12 space-y-10 sm:space-y-16">
      <!-- ── HERO ── -->
      <header class="text-center space-y-3 sm:space-y-4">
        <div
          class="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/80 shadow-xs"
        >
          <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-pink-500 animate-pulse"></span>
          Architectural Deep Dive · Polyglot Monorepo Case Study
        </div>

        <h1
          class="font-heading text-2xl sm:text-5xl md:text-6xl font-extrabold text-gray-950 dark:text-white leading-tight tracking-tight"
        >
          Microfrontend Architecture & Insights
        </h1>

        <p
          class="text-xs sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
        >
          A polyglot microfrontend lab demonstrating and comparing 3 integration paradigms:
          <strong>Module Federation</strong>, <strong>W3C Custom Elements</strong>, and
          <strong>Sandboxed Iframes</strong> with verified production isolation boundaries.
        </p>
      </header>

      <!-- ── STICKY QUICK NAVIGATION JUMP BAR ── -->
      <nav
        aria-label="Quick section navigation"
        class="sticky top-0 z-30 py-2 sm:py-2.5 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-y border-gray-200 dark:border-gray-800 -mx-3.5 sm:-mx-6 px-3 sm:px-6 shadow-xs"
      >
        <div class="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar px-1">
          <button
            v-for="section in quickNav"
            :key="section.id"
            :data-nav-section="section.id"
            type="button"
            @click="scrollToSection(section.id)"
            class="text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border transition-all whitespace-nowrap shrink-0 cursor-pointer focus:outline-hidden"
            :class="
              activeSection === section.id
                ? 'bg-pink-600 dark:bg-pink-500 border-pink-600 dark:border-pink-500 text-white shadow-xs font-semibold'
                : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-300 dark:hover:border-pink-700 bg-white dark:bg-gray-900'
            "
            :aria-current="activeSection === section.id ? 'true' : undefined"
          >
            <!-- Responsive labels: short on mobile, full on sm+ -->
            <span class="sm:hidden">{{ section.shortLabel }}</span>
            <span class="hidden sm:inline">{{ section.fullLabel }}</span>
          </button>
        </div>
      </nav>

      <!-- ── SECTION 1: 3-PARADIGM COMPARISON MATRIX ── -->
      <ParadigmMatrixSection />

      <!-- ── SECTION 2: RUNTIME LIFECYCLE MECHANICS ── -->
      <RuntimeLifecycleSection />

      <!-- ── SECTION 3: REAL-WORLD ENGINEERING FINDINGS & BENCHMARKS ── -->
      <FindingsHubSection />

      <!-- ── SECTION 4: ARCHITECTURE Q&A KNOWLEDGE BASE ── -->
      <FaqSection />

      <!-- ── FOOTER CALLOUT ── -->
      <footer
        class="border-t border-gray-200 dark:border-gray-800 pt-8 sm:pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6"
      >
        <div class="space-y-1 text-center sm:text-left">
          <p class="text-sm sm:text-base font-bold text-gray-900 dark:text-white font-heading">
            Ready to explore the live remotes?
          </p>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Switch between React, Vue, Svelte, Solid, Angular, Lit, and Next.js right in the browser.
          </p>
        </div>
        <div class="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-center">
          <RouterLink
            to="/remote"
            class="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Launch All Remotes</span>
            <ArrowRight :size="15" />
          </RouterLink>
          <RouterLink
            to="/"
            class="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Back to Home
          </RouterLink>
        </div>
      </footer>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink } from "vue-router";
import { ArrowRight } from "lucide-vue-next";

import ParadigmMatrixSection from "./sections/ParadigmMatrixSection.vue";
import RuntimeLifecycleSection from "./sections/RuntimeLifecycleSection.vue";
import FindingsHubSection from "./sections/FindingsHubSection.vue";
import FaqSection from "./sections/FaqSection.vue";
import type { QuickNavItem } from "./types";

const scrollContainer = ref<HTMLElement | null>(null);
const activeSection = ref("paradigms");

const quickNav: QuickNavItem[] = [
  { id: "paradigms", shortLabel: "Matrix", fullLabel: "3-Paradigm Matrix" },
  { id: "lifecycle", shortLabel: "Lifecycles", fullLabel: "Runtime Mechanics" },
  { id: "findings", shortLabel: "Findings", fullLabel: "Engineering Findings" },
  { id: "faq", shortLabel: "FAQ", fullLabel: "Architecture Q&A" },
];

const scrollToSection = (id: string) => {
  activeSection.value = id;
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

let observer: IntersectionObserver | null = null;

onMounted(() => {
  const sectionIds = ["paradigms", "lifecycle", "findings", "faq"];
  observer = new IntersectionObserver(
    (entries) => {
      const intersecting = entries.filter((e) => e.isIntersecting);
      if (intersecting.length > 0) {
        intersecting.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
        );
        const topSection = intersecting[0];
        if (topSection?.target?.id) {
          activeSection.value = topSection.target.id;
        }
      }
    },
    {
      root: scrollContainer.value,
      rootMargin: "-10% 0px -60% 0px",
      threshold: [0, 0.25],
    }
  );

  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer?.observe(el);
  });
});

onUnmounted(() => {
  observer?.disconnect();
  observer = null;
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
