<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

const links = [
  { label: "Clock", path: "/", icon: "pi-clock" },
  { label: "Timer", path: "/timer", icon: "pi-hourglass" },
  { label: "Stopwatch", path: "/stopwatch", icon: "pi-stopwatch" },
];
</script>

<template>
  <nav class="w-full flex items-center gap-1 px-4 py-3">
    <div class="flex items-center gap-2 mr-6">
      <i class="pi pi-clock text-sm" style="color: #60a5fa" />
      <span class="text-sm font-semibold tracking-wide" style="color: #e2e8f0">
        Time
      </span>
      <span class="text-xs" style="color: #475569">Tools</span>
    </div>

    <div class="flex items-center gap-1">
      <router-link
        v-for="link in links"
        :key="link.path"
        :to="link.path"
        class="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm transition-all duration-150 no-underline"
        :style="
          route.path === link.path
            ? 'background-color: #1e3a5f; color: #60a5fa;'
            : 'color: #64748b;'
        "
        :class="
          route.path !== link.path
            ? 'hover:bg-slate-800 hover:text-slate-200'
            : ''
        "
      >
        <i :class="`pi ${link.icon} text-xs`" />
        {{ link.label }}
      </router-link>
    </div>
  </nav>
</template>
