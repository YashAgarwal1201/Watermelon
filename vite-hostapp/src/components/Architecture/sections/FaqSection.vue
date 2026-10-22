<!-- vite-hostapp/src/components/Architecture/sections/FaqSection.vue -->
<template>
  <section id="faq" class="space-y-6 sm:space-y-8 scroll-mt-20 sm:scroll-mt-24">
    <div class="space-y-1.5 sm:space-y-2">
      <div class="flex items-center gap-2.5">
        <div class="w-6 sm:w-8 h-px bg-purple-500"></div>
        <span class="text-xs sm:text-sm font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
          Knowledge Base
        </span>
      </div>
      <h2 class="text-xl sm:text-3xl md:text-4xl font-bold font-heading text-gray-900 dark:text-white">
        4. Architecture Q&A & FAQ
      </h2>
      <p class="text-xs sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
        Common questions software engineers, architects, and product leads ask when evaluating polyglot microfrontends.
      </p>
    </div>

    <div class="space-y-2.5 sm:space-y-3">
      <div
        v-for="(item, idx) in faqItems"
        :key="idx"
        class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/30 overflow-hidden transition-colors"
      >
        <button
          type="button"
          class="w-full px-4 sm:px-6 py-3.5 sm:py-4 text-left flex items-center justify-between gap-3 cursor-pointer focus:outline-hidden focus:bg-gray-50 dark:focus:bg-gray-900"
          @click="toggleFaq(idx)"
          :aria-expanded="expandedFaq === idx"
        >
          <span class="text-xs sm:text-base font-semibold text-gray-900 dark:text-white leading-snug">
            {{ item.question }}
          </span>
          <ChevronDown
            :size="16"
            class="text-gray-400 transform transition-transform duration-200 shrink-0"
            :class="{ 'rotate-180': expandedFaq === idx }"
          />
        </button>
        <div
          v-show="expandedFaq === idx"
          class="px-4 sm:px-6 pb-4 pt-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800 font-content"
        >
          {{ item.answer }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ChevronDown } from "lucide-vue-next";
import { faqItems } from "../data/faq";

const expandedFaq = ref<number | null>(0);

const toggleFaq = (idx: number) => {
  expandedFaq.value = expandedFaq.value === idx ? null : idx;
};
</script>
