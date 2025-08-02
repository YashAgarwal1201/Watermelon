<script lang="ts" setup>
import { Home, Menu } from "lucide-vue-next";
import { useNavbarStore } from "../../stores/navbarStore";
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
      class="w-auto md:w-full h-full md:h-auto aspect-square flex justify-center items-center rounded-2xl border cursor-pointer"
    >
      <Home :size="16" />
    </RouterLink>

    <button
      class="w-auto md:w-full h-full md:h-auto aspect-square flex justify-center items-center rounded-2xl border cursor-pointer"
      @click="navbarStore.showSideMenu = false"
    >
      <Menu :size="16" />
    </button>
  </div>
</template>

<style lang="css" scoped>
.aspect-square {
  aspect-ratio: 1/1;
}
</style>
