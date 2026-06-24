<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";

// ── State ─────────────────────────────────────────────────────────────────
const inputHours = ref(0);
const inputMinutes = ref(5);
const inputSeconds = ref(0);

const totalMs = ref(0);
const remainingMs = ref(0);
const running = ref(false);
const finished = ref(false);

let ticker: ReturnType<typeof setInterval> | null = null;
let endTime = 0;

// ── Computed ──────────────────────────────────────────────────────────────
const displayHours = computed(() => Math.floor(remainingMs.value / 3_600_000));
const displayMinutes = computed(() =>
  Math.floor((remainingMs.value % 3_600_000) / 60_000),
);
const displaySeconds = computed(() =>
  Math.floor((remainingMs.value % 60_000) / 1_000),
);

const pad = (n: number) => String(n).padStart(2, "0");

const progressPercent = computed(() =>
  totalMs.value > 0
    ? ((totalMs.value - remainingMs.value) / totalMs.value) * 100
    : 0,
);

const hasInput = computed(
  () =>
    inputHours.value > 0 || inputMinutes.value > 0 || inputSeconds.value > 0,
);

const isSet = computed(() => totalMs.value > 0);

// ── Controls ──────────────────────────────────────────────────────────────
function start() {
  if (!hasInput.value && !isSet.value) return;

  if (!isSet.value || finished.value) {
    totalMs.value =
      (inputHours.value * 3600 + inputMinutes.value * 60 + inputSeconds.value) *
      1000;
    remainingMs.value = totalMs.value;
    finished.value = false;
  }

  if (remainingMs.value <= 0) return;

  endTime = Date.now() + remainingMs.value;
  running.value = true;

  ticker = setInterval(() => {
    remainingMs.value = Math.max(0, endTime - Date.now());
    if (remainingMs.value === 0) {
      running.value = false;
      finished.value = true;
      if (ticker) clearInterval(ticker);
    }
  }, 250);
}

function pause() {
  running.value = false;
  if (ticker) clearInterval(ticker);
}

function reset() {
  running.value = false;
  finished.value = false;
  totalMs.value = 0;
  remainingMs.value = 0;
  if (ticker) clearInterval(ticker);
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

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
        Countdown
      </p>
      <h1 class="text-2xl md:text-3xl font-bold" style="color: #e2e8f0">
        Timer
      </h1>
    </div>

    <div class="max-w-md space-y-8">
      <!-- Input row (shown when not running / not set) -->
      <div v-if="!isSet || finished" class="space-y-3">
        <p class="text-xs font-medium" style="color: #475569">Set duration</p>
        <div class="flex items-center gap-3">
          <div class="flex flex-col items-center gap-1">
            <input
              v-model.number="inputHours"
              type="number"
              min="0"
              max="23"
              @blur="inputHours = clamp(inputHours, 0, 23)"
              class="w-16 text-center text-xl font-mono font-bold rounded-lg px-2 py-3 border outline-none focus:ring-2 focus:ring-blue-500"
              style="
                background-color: #131c2e;
                border-color: #1e293b;
                color: #e2e8f0;
              "
            />
            <span class="text-xs" style="color: #475569">hr</span>
          </div>
          <span class="text-2xl font-mono font-bold pb-5" style="color: #334155"
            >:</span
          >
          <div class="flex flex-col items-center gap-1">
            <input
              v-model.number="inputMinutes"
              type="number"
              min="0"
              max="59"
              @blur="inputMinutes = clamp(inputMinutes, 0, 59)"
              class="w-16 text-center text-xl font-mono font-bold rounded-lg px-2 py-3 border outline-none focus:ring-2 focus:ring-blue-500"
              style="
                background-color: #131c2e;
                border-color: #1e293b;
                color: #e2e8f0;
              "
            />
            <span class="text-xs" style="color: #475569">min</span>
          </div>
          <span class="text-2xl font-mono font-bold pb-5" style="color: #334155"
            >:</span
          >
          <div class="flex flex-col items-center gap-1">
            <input
              v-model.number="inputSeconds"
              type="number"
              min="0"
              max="59"
              @blur="inputSeconds = clamp(inputSeconds, 0, 59)"
              class="w-16 text-center text-xl font-mono font-bold rounded-lg px-2 py-3 border outline-none focus:ring-2 focus:ring-blue-500"
              style="
                background-color: #131c2e;
                border-color: #1e293b;
                color: #e2e8f0;
              "
            />
            <span class="text-xs" style="color: #475569">sec</span>
          </div>
        </div>
      </div>

      <!-- Countdown display (shown when set) -->
      <div v-if="isSet && !finished" class="space-y-4">
        <div
          class="text-6xl md:text-7xl font-mono font-bold tabular-nums tracking-tight"
          :style="
            remainingMs < 10_000 && running
              ? 'color: #f87171;'
              : 'color: #60a5fa;'
          "
        >
          {{ pad(displayHours) }}:{{ pad(displayMinutes) }}:{{
            pad(displaySeconds)
          }}
        </div>

        <!-- Progress bar -->
        <div
          class="w-full h-1.5 rounded-full overflow-hidden"
          style="background-color: #1e293b"
        >
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="`width: ${progressPercent}%; background-color: ${remainingMs < 10_000 ? '#f87171' : '#60a5fa'};`"
          />
        </div>
      </div>

      <!-- Finished state -->
      <div v-if="finished" class="space-y-2">
        <div class="text-5xl font-mono font-bold" style="color: #4ade80">
          00:00:00
        </div>
        <p class="text-sm" style="color: #4ade80">Time's up.</p>
      </div>

      <!-- Controls -->
      <div class="flex items-center gap-3">
        <button
          v-if="!running"
          :disabled="!hasInput && !isSet"
          @click="start"
          class="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          style="background-color: #1d4ed8; color: #fff"
          :class="hasInput || isSet ? 'hover:bg-blue-500' : ''"
        >
          {{ isSet && !finished ? "Resume" : "Start" }}
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
          v-if="isSet || finished"
          @click="reset"
          class="px-5 py-2 rounded-lg text-sm font-medium transition-all"
          style="background-color: #1e293b; color: #94a3b8"
          :class="'hover:bg-slate-700'"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</template>
