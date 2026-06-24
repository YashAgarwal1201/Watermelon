<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";

// ── State ─────────────────────────────────────────────────────────────────
const elapsedMs = ref(0);
const running = ref(false);
const laps = ref<{ index: number; elapsed: number; split: number }[]>([]);

let ticker: ReturnType<typeof setInterval> | null = null;
let startTime = 0;
let baseMs = 0;

// ── Computed ──────────────────────────────────────────────────────────────
const pad = (n: number) => String(n).padStart(2, "0");
// const padMs = (n: number) => String(n).padStart(3, "0");

function msToDisplay(ms: number) {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1_000);
  const cs = Math.floor((ms % 1_000) / 10);
  return { h, m, s, cs };
}

const display = computed(() => msToDisplay(elapsedMs.value));
const showHours = computed(() => elapsedMs.value >= 3_600_000);

const lastLapMs = computed(() =>
  laps.value.length > 0 ? laps.value[laps.value.length - 1].elapsed : 0,
);

// ── Controls ──────────────────────────────────────────────────────────────
function start() {
  startTime = Date.now();
  baseMs = elapsedMs.value;
  running.value = true;
  ticker = setInterval(() => {
    elapsedMs.value = baseMs + (Date.now() - startTime);
  }, 30);
}

function pause() {
  running.value = false;
  baseMs = elapsedMs.value;
  if (ticker) clearInterval(ticker);
}

function reset() {
  running.value = false;
  elapsedMs.value = 0;
  baseMs = 0;
  laps.value = [];
  if (ticker) clearInterval(ticker);
}

function lap() {
  if (!running.value) return;
  const split = elapsedMs.value - lastLapMs.value;
  laps.value.push({
    index: laps.value.length + 1,
    elapsed: elapsedMs.value,
    split,
  });
}

function formatMs(ms: number) {
  const { h, m, s, cs } = msToDisplay(ms);
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(cs)}`;
  return `${pad(m)}:${pad(s)}.${pad(cs)}`;
}

// Highlight fastest/slowest splits
const fastestLap = computed(() => {
  if (laps.value.length < 2) return -1;
  return laps.value.reduce(
    (best, l, i) => (l.split < laps.value[best].split ? i : best),
    0,
  );
});
const slowestLap = computed(() => {
  if (laps.value.length < 2) return -1;
  return laps.value.reduce(
    (worst, l, i) => (l.split > laps.value[worst].split ? i : worst),
    0,
  );
});

onUnmounted(() => {
  if (ticker) clearInterval(ticker);
});
</script>

<template>
  <div class="w-full min-h-full px-6 py-10 md:px-10 space-y-10">
    <!-- Header -->
    <div class="space-y-1">
      <p
        class="text-xs uppercase tracking-widest font-medium"
        style="color: #475569; letter-spacing: 0.18em"
      >
        Elapsed Time
      </p>
      <h1 class="text-2xl md:text-3xl font-bold" style="color: #e2e8f0">
        Stopwatch
      </h1>
    </div>

    <div class="max-w-md space-y-8">
      <!-- Display -->
      <div
        class="font-mono font-bold tabular-nums tracking-tight"
        :class="showHours ? 'text-5xl md:text-6xl' : 'text-6xl md:text-7xl'"
        style="color: #60a5fa"
      >
        <span v-if="showHours">{{ pad(display.h) }}:</span
        >{{ pad(display.m) }}:{{ pad(display.s)
        }}<span class="text-3xl md:text-4xl" style="color: #334155"
          >.{{ pad(display.cs) }}</span
        >
      </div>

      <!-- Controls -->
      <div class="flex items-center gap-3">
        <button
          v-if="!running"
          @click="start"
          class="px-5 py-2 rounded-lg text-sm font-medium transition-all"
          style="background-color: #1d4ed8; color: #fff"
          :class="'hover:bg-blue-500'"
        >
          {{ elapsedMs > 0 ? "Resume" : "Start" }}
        </button>
        <button
          v-else
          @click="pause"
          class="px-5 py-2 rounded-lg text-sm font-medium transition-all"
          style="background-color: #1e293b; color: #e2e8f0"
          :class="'hover:bg-slate-700'"
        >
          Pause
        </button>

        <button
          @click="lap"
          :disabled="!running"
          class="px-5 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style="background-color: #1e293b; color: #94a3b8"
          :class="running ? 'hover:bg-slate-700' : ''"
        >
          Lap
        </button>

        <button
          v-if="elapsedMs > 0"
          @click="reset"
          class="px-5 py-2 rounded-lg text-sm font-medium transition-all"
          style="background-color: #1e293b; color: #94a3b8"
          :class="'hover:bg-slate-700'"
        >
          Reset
        </button>
      </div>

      <!-- Lap table -->
      <div v-if="laps.length > 0" class="space-y-2">
        <div class="h-px" style="background-color: #1e293b" />

        <div class="flex items-center justify-between px-1 pb-1">
          <span
            class="text-xs font-medium uppercase tracking-wider"
            style="color: #475569"
            >Lap</span
          >
          <span
            class="text-xs font-medium uppercase tracking-wider"
            style="color: #475569"
            >Split</span
          >
          <span
            class="text-xs font-medium uppercase tracking-wider"
            style="color: #475569"
            >Total</span
          >
        </div>

        <div
          v-for="lap in [...laps].reverse()"
          :key="lap.index"
          class="flex items-center justify-between px-3 py-2.5 rounded-lg"
          :style="
            laps.indexOf(lap) === fastestLap
              ? 'background-color: #052e16; border: 1px solid #14532d;'
              : laps.indexOf(lap) === slowestLap
                ? 'background-color: #2d0a0a; border: 1px solid #450a0a;'
                : 'background-color: #131c2e; border: 1px solid transparent;'
          "
        >
          <span
            class="text-sm font-medium w-8"
            :style="
              laps.indexOf(lap) === fastestLap
                ? 'color: #4ade80;'
                : laps.indexOf(lap) === slowestLap
                  ? 'color: #f87171;'
                  : 'color: #64748b;'
            "
          >
            {{ lap.index }}
          </span>
          <span
            class="font-mono text-sm tabular-nums"
            :style="
              laps.indexOf(lap) === fastestLap
                ? 'color: #4ade80;'
                : laps.indexOf(lap) === slowestLap
                  ? 'color: #f87171;'
                  : 'color: #e2e8f0;'
            "
          >
            {{ formatMs(lap.split) }}
          </span>
          <span class="font-mono text-sm tabular-nums" style="color: #475569">
            {{ formatMs(lap.elapsed) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
