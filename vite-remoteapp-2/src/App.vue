<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
</script>

<template>
  <div
    class="w-full h-full flex flex-col"
    style="background-color: #0f172a; color: #e2e8f0"
  >
    <div class="w-full shrink-0 border-b" style="border-color: #1e293b">
      <NavBar />
    </div>
    <div class="w-full grow overflow-y-auto">
      <RouterView />
    </div>
  </div>
</template>
