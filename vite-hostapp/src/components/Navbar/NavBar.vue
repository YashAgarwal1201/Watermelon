<!-- vite-hostapp/src/components/Navbar/NavBar.vue -->

<script lang="ts" setup>
import { Blocks, Home, Menu } from "lucide-vue-next";
import { useNavbarStore } from "../../stores/navbarStore";
import { RouterLink } from "vue-router";

const navbarStore = useNavbarStore();

const navOptions = [
  {
    route: "/",
    title: "Go to home page",
    ariaLabel: "Home page",
    label: "Home",
    icon: Home,
  },
  {
    route: "/remote",
    title: "All remote apps",
    ariaLabel: "Remote apps list",
    label: "Apps",
    icon: Blocks,
  },
];
</script>

<template>
  <div
    class="w-full h-full grid grid-cols-3 md:flex md:flex-col justify-center gap-3 text-black dark:text-white py-1 md:py-2 px-1"
  >
    <RouterLink
      v-for="item in navOptions"
      :key="item.route"
      :to="item.route"
      :title="item.title"
      :aria-label="item.ariaLabel"
      class="flex flex-col justify-center items-center group"
      active-class="nav-active"
    >
      <!-- ICON PILL -->
      <span
        class="rounded-full px-3 py-1 transition-all duration-200 bg-slate-100 dark:bg-slate-800 group-[&.nav-active]:bg-green-600 dark:group-[&.nav-active]:bg-green-500"
      >
        <component
          :is="item.icon"
          :size="16"
          class="transition-colors duration-200 text-slate-600 dark:text-slate-300 group-[&.nav-active]:text-white"
        />
      </span>

      <!-- LABEL -->
      <span
        class="mt-1 text-xs font-medium transition-colors duration-200 text-slate-600 dark:text-slate-300 group-[&.nav-active]:text-green-700 dark:group-[&.nav-active]:text-green-400"
      >
        {{ item.label }}
      </span>
    </RouterLink>

    <!-- MENU BUTTON (same visual system) -->
    <button
      class="flex flex-col justify-center items-center group"
      @click="navbarStore.showSideMenu = true"
      aria-label="Open menu"
    >
      <span
        class="rounded-full px-3 py-1 transition-all duration-200 bg-slate-100 dark:bg-slate-800 group-active:bg-green-600 dark:group-active:bg-green-500"
      >
        <Menu
          :size="16"
          class="transition-colors duration-200 text-slate-600 dark:text-slate-300 group-active:text-white"
        />
      </span>

      <span class="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
        Menu
      </span>
    </button>
  </div>
</template>
