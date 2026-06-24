<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";

const now = ref(new Date());
let ticker: ReturnType<typeof setInterval>;

onMounted(() => {
  ticker = setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onUnmounted(() => clearInterval(ticker));

// ── Local clock ──────────────────────────────────────────────────────────
const localTime = computed(() =>
  now.value.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }),
);
const localDate = computed(() =>
  now.value.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
);
const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

// ── World clocks ─────────────────────────────────────────────────────────
const zones = [
  { label: "New York", tz: "America/New_York", abbr: "ET" },
  { label: "London", tz: "Europe/London", abbr: "GMT/BST" },
  { label: "Paris", tz: "Europe/Paris", abbr: "CET" },
  { label: "Dubai", tz: "Asia/Dubai", abbr: "GST" },
  { label: "Mumbai", tz: "Asia/Kolkata", abbr: "IST" },
  { label: "Singapore", tz: "Asia/Singapore", abbr: "SGT" },
  { label: "Tokyo", tz: "Asia/Tokyo", abbr: "JST" },
  { label: "Sydney", tz: "Australia/Sydney", abbr: "AEST" },
  { label: "Los Angeles", tz: "America/Los_Angeles", abbr: "PT" },
];

function getZoneTime(tz: string) {
  return now.value.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: tz,
  });
}

function getZoneDate(tz: string) {
  return now.value.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: tz,
  });
}

function getZoneOffset(tz: string) {
  const formatter = new Intl.DateTimeFormat("en", {
    timeZone: tz,
    timeZoneName: "shortOffset",
  });
  const parts = formatter.formatToParts(now.value);
  return parts.find((p) => p.type === "timeZoneName")?.value ?? "";
}
</script>

<template>
  <div class="w-full min-h-full px-6 py-10 md:px-10 space-y-10">
    <!-- Hero clock -->
    <div class="space-y-1">
      <p
        class="text-xs uppercase tracking-widest font-medium"
        style="color: #475569; letter-spacing: 0.18em"
      >
        {{ localTz }}
      </p>
      <div
        class="text-5xl md:text-7xl font-mono font-bold tabular-nums tracking-tight"
        style="color: #60a5fa"
      >
        {{ localTime }}
      </div>
      <p class="text-sm" style="color: #64748b">{{ localDate }}</p>
    </div>

    <div class="h-px" style="background-color: #1e293b" />

    <!-- World clocks grid -->
    <div class="space-y-4">
      <h2
        class="text-sm font-medium uppercase tracking-widest"
        style="color: #475569; letter-spacing: 0.15em"
      >
        World Clocks
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="zone in zones"
          :key="zone.tz"
          class="flex items-center justify-between px-4 py-3 rounded-xl border"
          style="background-color: #131c2e; border-color: #1e293b"
        >
          <div class="space-y-0.5">
            <p class="text-sm font-medium" style="color: #e2e8f0">
              {{ zone.label }}
            </p>
            <p class="text-xs" style="color: #475569">
              {{ getZoneDate(zone.tz) }} · {{ getZoneOffset(zone.tz) }}
            </p>
          </div>
          <div class="text-right">
            <p
              class="font-mono text-base font-semibold tabular-nums"
              style="color: #60a5fa"
            >
              {{ getZoneTime(zone.tz) }}
            </p>
            <p class="text-xs" style="color: #334155">{{ zone.abbr }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
