<script lang="ts" setup>
import { Button } from "primevue";
// import { ref } from "vue";

// const feature = ref();
</script>

<template>
  <div
    class="w-full h-full flex flex-row md:flex-col justify-between items-center text-black"
  >
    <Button
      class="w-auto md:w-full h-full md:h-auto aspect-square !rounded-2xl border"
      ><span class="pi pi-bars"></span
    ></Button>
  </div>
</template>

<style lang="css" scoped>
.aspect-square {
  aspect-ratio: 1/1;
}
</style>
