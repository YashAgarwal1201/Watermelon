// File: components/Navbar/NavBar.vue

<script lang="ts" setup>
import { Home, Menu } from "lucide-vue-next";
import { useNavbarStore } from "../../stores/navbarStore";
import { Button } from "primevue";
import { RouterLink } from "vue-router";
// import { storeToRefs } from "pinia";
// import { ref } from "vue";

// const feature = ref();

const navbarStore = useNavbarStore();
// const { showSideMenu } = storeToRefs(navbarStore);
</script>

<template>
  <div
    class="w-full h-full flex flex-row md:flex-col justify-between items-center text-black py-1 md:py-2 px-1 md:px-1"
  >
    <RouterLink
      to="/"
      class="p-button w-auto md:w-full h-full md:h-auto aspect-square !bg-green-700 dark:!bg-green-400 flex justify-center items-center !rounded-2xl !border-none cursor-pointer"
    >
      <Home :size="16" />
    </RouterLink>

    <Button
      class="w-auto md:w-full h-full md:h-auto aspect-square !bg-green-700 dark:!bg-green-400 flex justify-center items-center !rounded-2xl !border-none cursor-pointer"
      @click="navbarStore.showSideMenu = true"
    >
      <Menu :size="16" />
    </Button>
  </div>
</template>

<style lang="css" scoped>
.aspect-square {
  aspect-ratio: 1/1;
}
</style>
