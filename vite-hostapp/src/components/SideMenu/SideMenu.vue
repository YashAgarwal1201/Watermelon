<template>
  <div>
    <Drawer
      v-model:visible="navbarStore.showSideMenu"
      @hide="navbarStore.showSideMenu = false"
      :dismissable="true"
      position="right"
      class="!w-full md:!w-[768px] rounded-none md:!rounded-l-xl"
    >
      <template #header>
        <div class="flex justify-between items-center w-full">
          <h3 class="text-lg sm:text-xl md:text-2xl">Menu</h3>
        </div>
      </template>

      <div class="w-full">
        <div class="flex flex-col">
          <div
            class="w-full flex flex-col rounded-xl !bg-stone-100 dark:!bg-stone-800 p-4"
          >
            <div v-for="app in remoteApps" :key="app.key">
              <RouterLink :class="buttonStyles" :to="`/remote/${app.key}`">
                <Home :size="16" class="text-yellow-600 dark:text-yellow-500" />
                <span>{{ app.label }}</span>
              </RouterLink>

              <div
                class="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-stone-300 dark:bg-stone-600"
              ></div>
            </div>

            <a
              :class="buttonStyles"
              :href="DEVELOPER_PROFILE"
              class="!text-green-700 dark:!text-green-300 !border-none !flex !items-center !justify-start shadow-none"
              rel="noopener noreferrer nofollow"
              target="_blank"
            >
              <UserCircle
                :size="16"
                class="text-yellow-600 dark:text-yellow-500"
              />
              <span>Developer Profile</span>
            </a>
          </div>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { Home, UserCircle } from "lucide-vue-next";
import { Button, Drawer } from "primevue";
import { useNavbarStore } from "../../stores/navbarStore";
import { RouterLink } from "vue-router";
import { DEVELOPER_PROFILE } from "../../services/constants";

const navbarStore = useNavbarStore();

const remoteApps = [
  { key: "remoteapp_1", label: "Remote App 1" },
  { key: "remoteapp_2", label: "Remote App 2" },
  { key: "remoteapp_3", label: "Remote App 3" },
  { key: "remoteapp_4", label: "Remote App 4" },
];

const buttonStyles =
  "!px-2 !py-4 !bg-transparent !!text-green-700 dark:!text-green-300 flex items-center !gap-x-3 !rounded-xl *:text-lg font-normal font-content";
</script>

<style lang="css" scoped></style>
