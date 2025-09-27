<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
</script>

<template>
  <div
    class="w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950"
  >
    <div class="w-full h-auto flex-shrink-0">
      <NavBar />
    </div>
    <div class="w-full flex-grow overflow-y-auto">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
