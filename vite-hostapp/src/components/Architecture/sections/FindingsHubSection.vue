<!-- vite-hostapp/src/components/Architecture/sections/FindingsHubSection.vue -->
<template>
  <section id="findings" class="space-y-6 sm:space-y-8 scroll-mt-20 sm:scroll-mt-24">
    <!-- Section Title & Subheading -->
    <div class="space-y-1.5 sm:space-y-2">
      <div class="flex items-center gap-2.5">
        <div class="w-6 sm:w-8 h-px bg-green-500"></div>
        <span class="text-xs sm:text-sm font-semibold uppercase tracking-widest text-green-600 dark:text-green-400">
          Field Discoveries
        </span>
      </div>
      <h2 class="text-xl sm:text-3xl md:text-4xl font-bold font-heading text-gray-900 dark:text-white">
        3. Real-World Engineering Findings & Benchmarks
      </h2>
      <p class="text-xs sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
        Building an 11-remote polyglot microfrontend platform surfaced deep edge cases across browsers, bundlers, and styling frameworks.
        Explore the verified breakdown of technical challenges, failed workarounds, and architectural pivots.
      </p>
    </div>

    <!-- Category Filter Bar & Counter -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
      <div class="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          v-for="cat in categories"
          :key="cat.name"
          type="button"
          @click="selectedCategory = cat.name"
          class="text-xs sm:text-sm font-medium px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border transition-all whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1.5 focus:outline-hidden"
          :class="
            selectedCategory === cat.name
              ? 'bg-pink-600 dark:bg-pink-500 border-pink-600 dark:border-pink-500 text-white shadow-xs font-semibold'
              : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900'
          "
        >
          <component :is="cat.icon" :size="13" class="shrink-0" />
          <span>{{ cat.name }}</span>
          <span
            class="text-xs px-1.5 py-0.2 rounded-full font-mono"
            :class="
              selectedCategory === cat.name
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
            "
          >
            {{ getCategoryCount(cat.name) }}
          </span>
        </button>
      </div>

      <span class="text-xs sm:text-sm font-mono text-gray-500 dark:text-gray-400 shrink-0">
        Showing {{ filteredFindings.length }} of {{ engineeringFindings.length }} case studies
      </span>
    </div>

    <!-- Findings Cards List -->
    <div class="space-y-4 sm:space-y-6">
      <FindingCard
        v-for="finding in filteredFindings"
        :key="finding.id"
        :finding="finding"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  Layers,
  Cpu,
  Palette,
  ShieldCheck,
} from "lucide-vue-next";
import FindingCard from "./FindingCard.vue";
import { engineeringFindings } from "../data/findings";
import type { FindingCategory } from "../types";

const selectedCategory = ref<FindingCategory>("All");

const categories: { name: FindingCategory; icon: unknown }[] = [
  { name: "All", icon: Layers },
  { name: "Runtime & Globals", icon: Cpu },
  { name: "CSS & Shadow DOM", icon: Palette },
  { name: "Security & CSP", icon: ShieldCheck },
];

const getCategoryCount = (catName: FindingCategory) => {
  if (catName === "All") return engineeringFindings.length;
  return engineeringFindings.filter((f) => f.category === catName).length;
};

const filteredFindings = computed(() => {
  if (selectedCategory.value === "All") {
    return engineeringFindings;
  }
  return engineeringFindings.filter((f) => f.category === selectedCategory.value);
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
