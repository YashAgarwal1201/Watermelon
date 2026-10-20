<!-- vite-hostapp/src/components/Architecture/ArchitectureComponent.vue -->

<template>
  <main
    class="w-full h-full overflow-y-auto bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16 sm:space-y-24">
      <!-- ── HERO ── -->
      <header class="text-center space-y-5">
        <div
          class="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/80 shadow-xs"
        >
          <span class="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
          Architectural Deep Dive · Polyglot Monorepo Case Study
        </div>

        <h1
          class="font-heading text-4xl sm:text-6xl md:text-7xl font-extrabold text-gray-950 dark:text-white leading-tight tracking-tight"
        >
          Microfrontend Architecture & Insights
        </h1>

        <p
          class="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
        >
          An engineering breakdown of orchestrating 10 polyglot remotes across
          <strong>Module Federation</strong>, <strong>W3C Custom Elements</strong>, and
          <strong>Sandboxed Iframes</strong> with production-grade isolation, communication, and performance.
        </p>

        <!-- Stats Bar -->
        <div
          class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-4 text-left"
        >
          <div
            v-for="stat in summaryStats"
            :key="stat.label"
            class="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/40 p-4 transition-all hover:border-pink-300 dark:hover:border-pink-800"
          >
            <p class="text-2xl sm:text-3xl font-bold font-heading text-gray-900 dark:text-white">
              {{ stat.value }}
            </p>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
              {{ stat.label }}
            </p>
          </div>
        </div>
      </header>

      <!-- ── STICKY QUICK NAVIGATION JUMP BAR ── -->
      <nav
        aria-label="Quick section navigation"
        class="sticky top-0 z-30 py-2.5 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-y border-gray-200 dark:border-gray-800 -mx-4 sm:-mx-6 px-3 sm:px-6 shadow-xs"
      >
        <div class="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-3 overflow-x-auto no-scrollbar px-1">
          <button
            v-for="section in quickNav"
            :key="section.id"
            :data-nav-section="section.id"
            type="button"
            @click="scrollToSection(section.id)"
            class="text-sm font-medium px-3.5 sm:px-4 py-1.5 rounded-full border transition-all whitespace-nowrap shrink-0 cursor-pointer focus:outline-hidden"
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
      <section id="paradigms" class="space-y-8 scroll-mt-24">
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <div class="w-8 h-px bg-pink-500"></div>
            <span class="text-sm font-semibold uppercase tracking-widest text-pink-600 dark:text-pink-400">
              Architectural Decisions
            </span>
          </div>
          <h2 class="text-2xl sm:text-4xl font-bold font-heading text-gray-900 dark:text-white">
            1. The 3-Paradigm Comparison Matrix
          </h2>
          <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
            There is no single "silver bullet" microfrontend technology. Watermelon demonstrates how three distinct paradigms
            complement each other across real-world organizational and technical requirements.
          </p>
        </div>

        <!-- Paradigm Cards Grid -->
        <div class="grid md:grid-cols-3 gap-6">
          <article
            v-for="paradigm in paradigms"
            :key="paradigm.title"
            class="rounded-2xl border p-6 flex flex-col justify-between transition-all bg-white dark:bg-gray-900/40 shadow-xs"
            :class="paradigm.borderClass"
          >
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span
                  class="text-sm font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md"
                  :class="paradigm.badgeClass"
                >
                  {{ paradigm.tag }}
                </span>
                <span class="text-sm font-mono text-gray-500 dark:text-gray-400">
                  {{ paradigm.remotesCount }} Remotes
                </span>
              </div>

              <h3 class="text-xl font-bold text-gray-900 dark:text-white font-heading">
                {{ paradigm.title }}
              </h3>

              <p class="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {{ paradigm.description }}
              </p>

              <div class="space-y-2.5 pt-2 border-t border-gray-100 dark:border-gray-800">
                <p class="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Key Strengths
                </p>
                <ul class="text-sm sm:text-base text-gray-700 dark:text-gray-300 space-y-2">
                  <li v-for="strength in paradigm.strengths" :key="strength" class="flex gap-2 items-start">
                    <Check :size="18" class="text-green-500 font-bold shrink-0 mt-0.5" />
                    <span>{{ strength }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 text-sm">
              <span class="font-semibold text-gray-700 dark:text-gray-300">Used for: </span>
              <span class="text-gray-600 dark:text-gray-400">{{ paradigm.usedFor }}</span>
            </div>
          </article>
        </div>

        <!-- Comprehensive Evaluation Table -->
        <div class="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900/30">
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white font-heading">
              Detailed Feature & Trade-off Matrix
            </h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm sm:text-base">
              <thead class="bg-gray-50/50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 font-bold text-sm uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th scope="col" class="py-3.5 px-6">Evaluation Criteria</th>
                  <th scope="col" class="py-3.5 px-6">Module Federation</th>
                  <th scope="col" class="py-3.5 px-6">Web Components</th>
                  <th scope="col" class="py-3.5 px-6">Sandboxed Iframes</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800 font-content">
                <tr v-for="row in matrixRows" :key="row.criteria" class="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                  <th scope="row" class="py-4 px-6 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    {{ row.criteria }}
                  </th>
                  <td class="py-4 px-6 text-gray-700 dark:text-gray-300">
                    {{ row.mf }}
                  </td>
                  <td class="py-4 px-6 text-gray-700 dark:text-gray-300">
                    {{ row.wc }}
                  </td>
                  <td class="py-4 px-6 text-gray-700 dark:text-gray-300">
                    {{ row.iframe }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ── SECTION 2: RUNTIME LIFECYCLE MECHANICS ── -->
      <section id="lifecycle" class="space-y-8 scroll-mt-24">
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <div class="w-8 h-px bg-red-500"></div>
            <span class="text-sm font-semibold uppercase tracking-widest text-red-600 dark:text-red-400">
              Under The Hood
            </span>
          </div>
          <h2 class="text-2xl sm:text-4xl font-bold font-heading text-gray-900 dark:text-white">
            2. Runtime Lifecycle Mechanics
          </h2>
          <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
            The host application abstracts mounting details behind a polymorphic <code class="text-xs sm:text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">BaseAdapter</code> contract.
            Here is how each paradigm executes behind the scenes.
          </p>
        </div>

        <div class="grid lg:grid-cols-3 gap-6">
          <!-- Flow 1: MF -->
          <div class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/30 p-6 space-y-4">
            <div class="flex items-center gap-2.5">
              <span class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                A
              </span>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white font-heading">
                Module Federation Flow
              </h3>
            </div>
            <ol class="space-y-3.5 text-sm sm:text-base text-gray-700 dark:text-gray-300">
              <li class="flex gap-2">
                <span class="font-bold text-blue-500 shrink-0">1.</span>
                <span><strong>Remote Resolution:</strong> Host dynamically requests <code class="font-mono text-xs sm:text-sm bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">remoteEntry.js</code> at runtime from remote origin.</span>
              </li>
              <li class="flex gap-2">
                <span class="font-bold text-blue-500 shrink-0">2.</span>
                <span><strong>Container Handshake:</strong> Host initializes container scope with its shared dependencies registry.</span>
              </li>
              <li class="flex gap-2">
                <span class="font-bold text-blue-500 shrink-0">3.</span>
                <span><strong>Module Factory:</strong> Remote resolves exposed module factory (e.g. React root, Vue component, Svelte root).</span>
              </li>
              <li class="flex gap-2">
                <span class="font-bold text-blue-500 shrink-0">4.</span>
                <span><strong>DOM Attachment:</strong> Mounts natively into target DOM container with framework unmount lifecycle hook registered.</span>
              </li>
            </ol>
          </div>

          <!-- Flow 2: Web Component -->
          <div class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/30 p-6 space-y-4">
            <div class="flex items-center gap-2.5">
              <span class="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-950/80 text-pink-600 dark:text-pink-400 font-bold flex items-center justify-center text-sm">
                B
              </span>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white font-heading">
                Custom Element Flow
              </h3>
            </div>
            <ol class="space-y-3.5 text-sm sm:text-base text-gray-700 dark:text-gray-300">
              <li class="flex gap-2">
                <span class="font-bold text-pink-500 shrink-0">1.</span>
                <span><strong>Script Injection:</strong> Host dynamically loads standalone custom element bundle (Angular, Lit, Vue CE).</span>
              </li>
              <li class="flex gap-2">
                <span class="font-bold text-pink-500 shrink-0">2.</span>
                <span><strong>Registry Verification:</strong> Checks <code class="font-mono text-xs sm:text-sm bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">customElements.get(tagName)</code> to avoid duplicate definitions.</span>
              </li>
              <li class="flex gap-2">
                <span class="font-bold text-pink-500 shrink-0">3.</span>
                <span><strong>Shadow Encapsulation:</strong> Instantiates DOM tag; styles stay scoped inside Shadow Root via custom CSS caches.</span>
              </li>
              <li class="flex gap-2">
                <span class="font-bold text-pink-500 shrink-0">4.</span>
                <span><strong>Style Portaling:</strong> <code class="font-mono text-xs sm:text-sm bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">patchHeadToShadow.ts</code> monitors head injections and replicates styles into active shadow trees.</span>
              </li>
            </ol>
          </div>

          <!-- Flow 3: Sandboxed Iframe -->
          <div class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/30 p-6 space-y-4">
            <div class="flex items-center gap-2.5">
              <span class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
                C
              </span>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white font-heading">
                Sandboxed Iframe & Bridge
              </h3>
            </div>
            <ol class="space-y-3.5 text-sm sm:text-base text-gray-700 dark:text-gray-300">
              <li class="flex gap-2">
                <span class="font-bold text-emerald-500 shrink-0">1.</span>
                <span><strong>Sandboxed Frame:</strong> Host renders <code class="font-mono text-xs sm:text-sm bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">&lt;iframe&gt;</code> with strict sandbox attributes and CSP validation.</span>
              </li>
              <li class="flex gap-2">
                <span class="font-bold text-emerald-500 shrink-0">2.</span>
                <span><strong>Handshake Protocol:</strong> Remote client calls <code class="font-mono text-xs sm:text-sm bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">bridge.ready()</code> dispatching guarded <code class="font-mono text-xs sm:text-sm">WM_READY</code>.</span>
              </li>
              <li class="flex gap-2">
                <span class="font-bold text-emerald-500 shrink-0">3.</span>
                <span><strong>Auto-Resizing:</strong> Client-side <code class="font-mono text-xs sm:text-sm bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">ResizeObserver</code> sends <code class="font-mono text-xs sm:text-sm">WM_RESIZE</code>; host adjusts height with zero iframe scrollbars.</span>
              </li>
              <li class="flex gap-2">
                <span class="font-bold text-emerald-500 shrink-0">4.</span>
                <span><strong>Context Sync:</strong> Host broadcasts theme changes (<code class="font-mono text-xs sm:text-sm">WM_THEME</code>) and auth tokens; remote responds seamlessly.</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <!-- ── SECTION 3: REAL-WORLD ENGINEERING FINDINGS ── -->
      <section id="findings" class="space-y-8 scroll-mt-24">
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <div class="w-8 h-px bg-green-500"></div>
            <span class="text-sm font-semibold uppercase tracking-widest text-green-600 dark:text-green-400">
              Field Discoveries
            </span>
          </div>
          <h2 class="text-2xl sm:text-4xl font-bold font-heading text-gray-900 dark:text-white">
            3. Real-World Engineering Findings & Benchmarks
          </h2>
          <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
            Building a polyglot microfrontend platform surfaced unexpected edge cases across browsers, bundlers, and styling libraries.
            Here are the primary lessons learned and how we solved them.
          </p>
        </div>

        <div class="space-y-6">
          <article
            v-for="finding in engineeringFindings"
            :key="finding.title"
            class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-6 sm:p-8 space-y-4 shadow-xs"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-3">
                <span
                  class="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                  :class="finding.iconClass"
                >
                  {{ finding.id }}
                </span>
                <h3 class="text-xl font-bold font-heading text-gray-900 dark:text-white">
                  {{ finding.title }}
                </h3>
              </div>
              <span class="text-sm font-mono font-medium px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                {{ finding.category }}
              </span>
            </div>

            <div class="grid md:grid-cols-2 gap-6 pt-2 text-base">
              <div class="space-y-2 border-l-2 border-red-400 dark:border-red-600 pl-4 bg-red-50/50 dark:bg-red-950/20 py-3 pr-3 rounded-r-lg">
                <p class="font-bold text-red-900 dark:text-red-300 text-sm uppercase tracking-wider">
                  The Problem & Challenge
                </p>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {{ finding.problem }}
                </p>
              </div>

              <div class="space-y-2 border-l-2 border-green-400 dark:border-green-600 pl-4 bg-green-50/50 dark:bg-green-950/20 py-3 pr-3 rounded-r-lg">
                <p class="font-bold text-green-900 dark:text-green-300 text-sm uppercase tracking-wider">
                  The Watermelon Solution
                </p>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {{ finding.solution }}
                </p>
              </div>
            </div>

            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 pt-3 border-t border-gray-100 dark:border-gray-800">
              <strong class="text-gray-900 dark:text-white">Engineering Takeaway:</strong> {{ finding.takeaway }}
            </p>
          </article>
        </div>
      </section>

      <!-- ── SECTION 4: ARCHITECTURE Q&A KNOWLEDGE BASE ── -->
      <section id="faq" class="space-y-8 scroll-mt-24">
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <div class="w-8 h-px bg-purple-500"></div>
            <span class="text-sm font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
              Knowledge Base
            </span>
          </div>
          <h2 class="text-2xl sm:text-4xl font-bold font-heading text-gray-900 dark:text-white">
            4. Architecture Q&A & FAQ
          </h2>
          <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
            Common questions software engineers, architects, and product leads ask when evaluating polyglot microfrontends.
          </p>
        </div>

        <div class="space-y-3">
          <div
            v-for="(item, idx) in faqItems"
            :key="idx"
            class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/30 overflow-hidden transition-colors"
          >
            <button
              class="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden focus:bg-gray-50 dark:focus:bg-gray-900"
              @click="toggleFaq(idx)"
              :aria-expanded="expandedFaq === idx"
            >
              <span class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {{ item.question }}
              </span>
              <ChevronDown
                :size="18"
                class="text-gray-400 transform transition-transform duration-200 shrink-0"
                :class="{ 'rotate-180': expandedFaq === idx }"
              />
            </button>
            <div
              v-show="expandedFaq === idx"
              class="px-6 pb-5 pt-1 text-base text-gray-700 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800"
            >
              {{ item.answer }}
            </div>
          </div>
        </div>
      </section>

      <!-- ── FOOTER CALLOUT ── -->
      <footer
        class="border-t border-gray-200 dark:border-gray-800 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div class="space-y-1 text-center sm:text-left">
          <p class="text-base sm:text-lg font-bold text-gray-900 dark:text-white font-heading">
            Ready to explore the live remotes?
          </p>
          <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Switch between React, Vue, Svelte, Solid, Angular, Lit, and Next.js right in the browser.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <RouterLink
            to="/remote"
            class="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-base transition-colors shadow-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Launch All Remotes</span>
            <ArrowRight :size="16" />
          </RouterLink>
          <RouterLink
            to="/"
            class="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-700 dark:text-gray-300 text-base font-semibold transition-colors cursor-pointer"
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
import { ArrowRight, Check, ChevronDown } from "lucide-vue-next";

const activeSection = ref("paradigms");
const expandedFaq = ref<number | null>(0);

const toggleFaq = (idx: number) => {
  expandedFaq.value = expandedFaq.value === idx ? null : idx;
};

const quickNav = [
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
      const visible = entries.find((e) => e.isIntersecting);
      if (visible && visible.target.id) {
        activeSection.value = visible.target.id;
      }
    },
    {
      rootMargin: "-10% 0px -70% 0px",
      threshold: 0,
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

const summaryStats = [
  { value: "10", label: "Polyglot Remotes" },
  { value: "3", label: "Core Paradigms" },
  { value: "57 MB", label: "Unified Dev RAM" },
  { value: "100%", label: "Test Coverage" },
];

const paradigms = [
  {
    title: "Module Federation",
    tag: "Runtime JS",
    remotesCount: "5",
    borderClass: "border-blue-200 dark:border-blue-900/60",
    badgeClass: "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300",
    description: "Webpack 5 & Vite federation exporting ESM chunks dynamically. Components mount directly into the host DOM with zero runtime wrapper overhead.",
    strengths: [
      "Shared dependencies deduplication (React, Vue)",
      "Zero iframe performance penalty",
      "Seamless browser history & deep linking",
      "Fastest initial mount time"
    ],
    usedFor: "High-performance inner-loop features, design systems, and cohesive app workflows."
  },
  {
    title: "Web Components",
    tag: "W3C Standard",
    remotesCount: "3",
    borderClass: "border-pink-200 dark:border-pink-900/60",
    badgeClass: "bg-pink-100 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300",
    description: "Browser-native Custom Elements with Shadow DOM encapsulation. Standard DOM properties, attributes, and CustomEvent dispatching.",
    strengths: [
      "Bulletproof style scoping (Shadow DOM)",
      "Framework-agnostic standard lifecycle",
      "No shared bundle negotiation required",
      "Self-contained reusable custom tags"
    ],
    usedFor: "Angular 20 Zoneless, Lit 3 notification centers, and Vue 3 reactive custom elements."
  },
  {
    title: "Sandboxed Iframes",
    tag: "Process Isolated",
    remotesCount: "2",
    borderClass: "border-emerald-200 dark:border-emerald-900/60",
    badgeClass: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300",
    description: "Native browser sandboxed browsing contexts communicating via the typed @watermelon/bridge postMessage protocol.",
    strengths: [
      "100% crash immunity (host cannot crash)",
      "Supports complex SSR runtimes (Next.js 16)",
      "Absolute global CSS & JS isolation",
      "Seamless dynamic auto-resizing"
    ],
    usedFor: "Third-party extensions, Next.js App Router analytics, and isolated asset managers."
  }
];

const matrixRows = [
  {
    criteria: "CSS Isolation",
    mf: "Shared DOM (relies on prefixing / CSS modules)",
    wc: "Shadow DOM (native browser boundary)",
    iframe: "Total Document Isolation (zero leaks possible)"
  },
  {
    criteria: "Fault Boundary",
    mf: "Host ErrorBoundary (unhandled crash can bubble)",
    wc: "Component Boundary (custom element fails safely)",
    iframe: "Process Isolation (frame crash never impacts host)"
  },
  {
    criteria: "Shared Dependencies",
    mf: "Yes (automatic deduplication across remotes)",
    wc: "Bundled inside custom element or shared globally",
    iframe: "No (each frame loads its own runtime)"
  },
  {
    criteria: "Communication",
    mf: "Direct JS callbacks, Props, Pinia / Redux store",
    wc: "HTML Attributes, Props, and CustomEvents",
    iframe: "Typed @watermelon/bridge postMessage protocol"
  },
  {
    criteria: "SSR Compatibility",
    mf: "Complex (requires Node federation streaming)",
    wc: "Declarative Shadow DOM or Client Hydration",
    iframe: "Native & Effortless (Next.js 16 App Router)"
  },
  {
    criteria: "Dev RAM Footprint",
    mf: "Minimal (shared modules in browser memory)",
    wc: "Lightweight (W3C standard browser runtime)",
    iframe: "Independent document memory per frame"
  }
];

const engineeringFindings = [
  {
    id: "1",
    title: "Shadow DOM Portal Leaks with UI Libraries",
    category: "CSS Scoping",
    iconClass: "bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300",
    problem: "When remotes use UI libraries like PrimeReact or PrimeVue, modal dialogs, tooltips, and popups are rendered into document.body outside the Shadow Root via portals, stripping all scoped styles.",
    solution: "We built patchHeadToShadow.ts with a MutationObserver on document.head. It detects dynamically injected stylesheets from portal libraries and clones them into the active remote's Shadow Root.",
    takeaway: "Shadow DOM is excellent for leaf components, but third-party portal libraries require head-mutation interception to preserve styling."
  },
  {
    id: "2",
    title: "Vite CSS-in-JS vs External Asset Paths",
    category: "Bundling & Assets",
    iconClass: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300",
    problem: "Federated Vite remotes exporting separate external CSS files trigger CORS issues and fail to resolve relative asset paths (fonts, SVG icons) when mounted into foreign-origin host shells.",
    solution: "We configured vite-plugin-css-injected-by-js across all Vite remotes. Styles are bundled directly into the JavaScript module and injected dynamically upon mounting.",
    takeaway: "In multi-origin federation architectures, bundling styles into JS creates atomic, self-contained bundles that eliminate cross-origin stylesheet network failures."
  },
  {
    id: "3",
    title: "Next.js 16 Security Headers & Frame Embedding",
    category: "Security & CSP",
    iconClass: "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300",
    problem: "Next.js 16 includes default security headers with X-Frame-Options: SAMEORIGIN, causing parent host shells running on https://localhost:5150 to be blocked by browser security.",
    solution: "We configured next.config.ts headers to replace X-Frame-Options with Content-Security-Policy: frame-ancestors 'self' https://localhost:5150 *, granting exact embedding rights to the host.",
    takeaway: "Legacy X-Frame-Options cannot allowlist specific parent domains; Content-Security-Policy frame-ancestors is mandatory for secure iframe microfrontends."
  },
  {
    id: "4",
    title: "Monorepo RAM Explosion vs Unified Static Serving",
    category: "DevOps & Memory",
    iconClass: "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300",
    problem: "Starting 10 independent dev servers simultaneously consumed over 1.2 GB of RAM and 10 separate Node.js processes, causing developer laptops and CI runners to throttle.",
    solution: "We engineered scripts/serve-remotes.mjs, which serves all prebuilt static bundles across all 10 independent ports (5251-5303) within a single Node.js HTTPS server consuming just ~57 MB RAM.",
    takeaway: "In large microfrontend monorepos, use selective HMR for the app actively being developed, and serve all other remotes via a single lightweight static server."
  },
  {
    id: "5",
    title: "Unmount Lifecycle Hygiene & Memory Leaks",
    category: "Performance",
    iconClass: "bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300",
    problem: "Navigating between remotes without rigorous unmounting left orphaned ResizeObservers, window message listeners, and detached DOM subtrees in browser memory.",
    solution: "We established the BaseAdapter lifecycle contract. Every adapter (MF, WebComponent, Iframe) guarantees full cleanup of DOM roots, bridge listeners, and MutationObservers upon route transition.",
    takeaway: "Microfrontend hosts must treat unmounting as a first-class citizen; without explicit teardown hooks, Single Page Applications will leak memory rapidly."
  }
];

const faqItems = [
  {
    question: "When should our team choose Web Components over Module Federation?",
    answer: "Choose Web Components when you need strict CSS isolation without worrying about conflicting class names (e.g. two teams using different versions of Tailwind), or when packaging reusable widgets for consumers on unknown tech stacks. Choose Module Federation when you need maximum performance, shared dependency deduplication (e.g. loading React only once), and deep history/routing integration."
  },
  {
    question: "Can an unhandled runtime error in a remote crash the host application?",
    answer: "In Sandboxed Iframes, it is physically impossible for a remote crash to crash the host shell—the browser treats the iframe as a separate browsing context. In Web Components and Module Federation, Watermelon encapsulates each remote within an adapter-level error boundary. If a remote throws an unhandled error, the adapter catches it, renders an inline recovery card, and keeps the host alive."
  },
  {
    question: "How does @watermelon/bridge protect against cross-site scripting (XSS)?",
    answer: "The bridge uses strict message structure guards: every message must contain an internal __wm namespace tag, a known remote ID, and an allowable message type (WM_READY, WM_RESIZE, WM_THEME, etc.). Additionally, iframe attributes use strict sandbox permissions (sandbox='allow-scripts allow-same-origin') and explicit frame-ancestor CSP restrictions."
  },
  {
    question: "How are shared dependencies handled between Vite and Webpack remotes?",
    answer: "Webpack 5 and Vite use compatible Module Federation sharing semantics. Packages declared as shared (such as react and react-dom) register their version in the global window share scope. The host negotiates the highest semver-compatible version and provides it as a singleton to both Vite and Webpack remotes, preventing redundant downloads."
  },
  {
    question: "Why use Next.js App Router as a microfrontend if it is primarily an SSR framework?",
    answer: "Many enterprise systems have existing Next.js web applications, analytics dashboards, or server-rendered admin tools. By embedding them via sandboxed iframes with dynamic height resizing and postMessage bridge sync, teams can integrate entire Next.js applications into an overarching portal without needing to rewrite them as client-side libraries."
  },
  {
    question: "How do you prevent CSS collisions between multiple remotes using different versions of Tailwind?",
    answer: "Watermelon uses two complementary defenses: (1) In Web Component remotes, styles are encapsulated inside the Shadow DOM, making cross-boundary CSS bleeding impossible. (2) In Module Federation remotes, PostCSS prefixing scopes utility classes to remote-specific wrapper containers."
  }
];
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
