<script setup lang="ts">
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar/NavBar.vue";
import SideMenu from "./components/SideMenu/SideMenu.vue";
</script>

<template>
  <div class="w-dvw h-dvh flex items-center justify-center">
    <div class="w-full md:w-16 h-16 md:h-full flex-shrink-0">
      <Navbar />
    </div>

    <div
      class="h-full flex-grow overflow-y-auto flex justify-center items-center"
    >
      <RouterView />
    </div>

    <SideMenu />
  </div>
</template>

<style scoped></style>
