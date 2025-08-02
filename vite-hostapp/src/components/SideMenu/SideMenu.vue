<template>
  <div>
    <Drawer
      v-model:visible="navbarStore.showSideMenu"
      @hide="navbarStore.showSideMenu = false"
      :dismissable="true"
      position="right"
      class="w-full md:w-[768px] rounded-none md:!rounded-l-3xl"
    >
      <template #header>
        <div class="flex justify-between items-center w-full">
          <h3 class="text-lg sm:text-xl md:text-2xl">Your Shopping Cart</h3>

          <Button icon="pi pi-heart" class="p-button-text" rounded />
        </div>
      </template>
      <div class="w-full h-full">
        <div class="w-full h-[calc(100%-100px)]"></div>
      </div>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { Drawer } from "primevue";
import { useNavbarStore } from "../../stores/navbarStore";

const navbarStore = useNavbarStore();
// const { showSideMenu } = navbarStore;
</script>

<style lang="css" scoped></style>
