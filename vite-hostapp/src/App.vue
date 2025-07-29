<script setup lang="ts">
import Navbar from "./components/Navbar/NavBar.vue";
import RemoteWrapper from "./remoteWrapper/RemoteWrapper.vue";
</script>

<template>
  <div class="w-dvw h-dvh flex items-center justify-center">
    <div class="w-full md:w-16 h-16 md:h-full flex-shrink-0 border">
      <Navbar />
    </div>

    <div
      class="h-full flex-grow overflow-y-auto flex justify-center items-center"
    >
      remote app container
      <RemoteWrapper />
    </div>
  </div>
</template>

<style scoped></style>
