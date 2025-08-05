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
          <h3 class="text-lg sm:text-xl md:text-2xl">Menu</h3>

          <Button icon="pi pi-heart" class="p-button-text" rounded />
        </div>
      </template>
      <div class="w-full h-full">
        <div class="flex-grow-1 overflow-y-auto">
          <RouterLink
            v-for="app in remoteApps"
            :key="app.key"
            :to="`/remote/${app.key}`"
            class="block text-lg text-blue-600 hover:underline"
            @click="navbarStore.showSideMenu = false"
          >
            {{ app.label }}
          </RouterLink>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { Button, Drawer } from "primevue";
import { useNavbarStore } from "../../stores/navbarStore";
import { RouterLink } from "vue-router";

const navbarStore = useNavbarStore();

const remoteApps = [
  { key: "remoteapp_1", label: "Remote App 1" },
  { key: "remoteapp_2", label: "Remote App 2" },
];
</script>

<style lang="css" scoped></style>
