<!-- vite-hostapp/src/components/Architecture/sections/FindingCard.vue -->
<template>
  <article
    class="rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-4 sm:p-6 space-y-4 shadow-xs hover:border-gray-300 dark:hover:border-gray-700 transition-all"
  >
    <!-- Header with ID, Title, Category and Severity -->
    <div class="space-y-2.5">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2.5 min-w-0">
          <span
            class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-xs shrink-0"
            :class="finding.iconClass"
          >
            {{ finding.id }}
          </span>
          <h3 class="text-base sm:text-xl font-bold font-heading text-gray-900 dark:text-white leading-snug">
            {{ finding.title }}
          </h3>
        </div>

        <div class="flex flex-wrap items-center gap-1.5 shrink-0">
          <span
            class="text-xs font-semibold px-2 py-0.5 rounded-md border"
            :class="finding.severityBadgeClass"
          >
            {{ finding.severity }}
          </span>
          <span
            class="text-xs font-mono font-medium px-2 py-0.5 rounded-md border"
            :class="finding.categoryBadgeClass"
          >
            {{ finding.category }}
          </span>
        </div>
      </div>

      <!-- Synopsis -->
      <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-content">
        {{ finding.synopsis }}
      </p>
    </div>

    <!-- Executive Challenge & Resolution Grid -->
    <div class="grid md:grid-cols-2 gap-3 pt-1 text-xs sm:text-sm">
      <!-- Challenge -->
      <div class="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/20 p-3 sm:p-3.5 space-y-1.5">
        <div class="flex items-center gap-1.5 text-red-700 dark:text-red-300 font-semibold uppercase tracking-wider text-xs">
          <AlertCircle :size="14" class="shrink-0" />
          <span>The Challenge</span>
        </div>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          {{ finding.symptoms.description }}
        </p>
      </div>

      <!-- Resolution -->
      <div class="rounded-lg border border-green-200 dark:border-green-900/50 bg-green-50/40 dark:bg-green-950/20 p-3 sm:p-3.5 space-y-1.5">
        <div class="flex items-center gap-1.5 text-green-700 dark:text-green-300 font-semibold uppercase tracking-wider text-xs">
          <CheckCircle2 :size="14" class="shrink-0" />
          <span>The Resolution</span>
        </div>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          {{ finding.solution.description }}
        </p>
      </div>
    </div>

    <!-- Engineering Takeaway Callout -->
    <div class="rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-850/40 p-3 sm:p-3.5 flex items-start gap-2.5">
      <Lightbulb :size="16" class="text-amber-500 shrink-0 mt-0.5" />
      <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong class="text-gray-900 dark:text-white font-semibold">Engineering Takeaway:</strong>
        {{ finding.takeaway }}
      </p>
    </div>

    <!-- Forensic Deep-Dive Expandable Section -->
    <div class="pt-1">
      <button
        type="button"
        @click="isExpanded = !isExpanded"
        class="w-full flex items-center justify-between text-xs sm:text-sm font-medium py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer focus:outline-hidden"
        :aria-expanded="isExpanded"
      >
        <span class="flex items-center gap-2">
          <FileCode :size="15" class="text-pink-600 dark:text-pink-400" />
          <span>{{ isExpanded ? "Hide Forensic Breakdown" : "Inspect Forensic Breakdown & Error Logs" }}</span>
        </span>
        <ChevronDown
          :size="15"
          class="text-gray-400 transform transition-transform duration-200"
          :class="{ 'rotate-180': isExpanded }"
        />
      </button>

      <!-- Expanded Detailed Autopsy -->
      <div v-show="isExpanded" class="mt-3 space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
        <!-- Detailed Symptoms & Console Logs -->
        <div class="rounded-lg border border-red-200/80 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/10 p-3.5 space-y-2">
          <div class="flex items-center gap-1.5 text-xs font-bold text-red-800 dark:text-red-300 uppercase tracking-wider">
            <AlertCircle :size="14" />
            <span>Failure Symptoms</span>
          </div>
          <ul class="space-y-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            <li
              v-for="(detail, idx) in finding.symptoms.details"
              :key="idx"
              class="flex items-start gap-2"
            >
              <span class="text-red-500 font-bold mt-0.5">•</span>
              <span>{{ detail }}</span>
            </li>
          </ul>

          <div v-if="finding.symptoms.errorSignature" class="mt-2.5 pt-2 border-t border-red-200/50 dark:border-red-900/30">
            <span class="text-xs font-mono font-semibold uppercase tracking-wider text-red-700 dark:text-red-300 block mb-1">
              Console Error Signature:
            </span>
            <pre class="bg-gray-950 text-red-400 p-2 sm:p-2.5 rounded text-xs font-mono overflow-x-auto border border-red-950 leading-relaxed"><code>{{ finding.symptoms.errorSignature }}</code></pre>
          </div>
        </div>

        <!-- Attempted Workarounds -->
        <div class="rounded-lg border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/10 p-3.5 space-y-2">
          <div class="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            <XCircle :size="14" />
            <span>Attempted Workarounds That Failed</span>
          </div>
          <ul class="space-y-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            <li
              v-for="(attempt, idx) in finding.failedAttempts.attempts"
              :key="idx"
              class="flex items-start gap-2"
            >
              <XCircle :size="13" class="text-amber-500 mt-1 shrink-0" />
              <span>{{ attempt }}</span>
            </li>
          </ul>
        </div>

        <!-- Architectural Fix Details -->
        <div class="rounded-lg border border-green-200/80 dark:border-green-900/40 bg-green-50/30 dark:bg-green-950/10 p-3.5 space-y-2">
          <div class="flex items-center gap-1.5 text-xs font-bold text-green-800 dark:text-green-300 uppercase tracking-wider">
            <CheckCircle2 :size="14" />
            <span>Architectural Fix & Implementation Details</span>
          </div>
          <ul class="space-y-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            <li
              v-for="(detail, idx) in finding.solution.details"
              :key="idx"
              class="flex items-start gap-2"
            >
              <CheckCircle2 :size="13" class="text-green-500 mt-1 shrink-0" />
              <span>{{ detail }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { AlertCircle, CheckCircle2, XCircle, Lightbulb, FileCode, ChevronDown } from "lucide-vue-next";
import type { EngineeringFinding } from "../types";

defineProps<{
  finding: EngineeringFinding;
}>();

const isExpanded = ref(false);
</script>
