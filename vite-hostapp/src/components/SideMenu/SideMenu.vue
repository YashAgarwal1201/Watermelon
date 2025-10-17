<template>
  <div>
    <Drawer
      v-model:visible="navbarStore.showSideMenu"
      @hide="navbarStore.showSideMenu = false"
      :dismissable="true"
      position="right"
      class="!w-full md:!w-[768px] rounded-none md:!rounded-l-xl !bg-white dark:!bg-gray-950 !text-gray-900 dark:!text-white"
    >
      <template #header>
        <div class="flex justify-between items-center w-full font-heading">
          <h3
            class="text-lg sm:text-xl md:text-2xl bg-gradient-to-r from-pink-500 via-red-500 to-green-500 bg-clip-text text-transparent"
          >
            Menu
          </h3>
        </div>
      </template>

      <div class="w-full font-content">
        <div class="flex flex-col">
          <div
            class="w-full flex flex-col rounded-xl bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 p-4 border border-pink-200 dark:border-gray-700"
          >
            <Panel
              :class="buttonStyles"
              :collapsed="isPanelCollapsed"
              class="!border-none *:!p-0 flex-col flex-wrap items-start font-content w-full"
              toggleable
            >
              <template #header class="w-full">
                <div
                  class="flex items-center w-full gap-x-3 cursor-pointer"
                  @click="togglePanel"
                >
                  <Blocks
                    :size="16"
                    class="!text-pink-600 dark:!text-pink-400"
                  />
                  <span
                    class="text-lg text-red-700 dark:!text-red-300 hover:!bg-pink-100 dark:hover:!bg-pink-950/30"
                  >
                    Remote Applications
                  </span>
                </div>
              </template>

              <template #toggleicon class="hidden">
                <span
                  :class="[
                    'pi',
                    isPanelCollapsed ? 'pi-chevron-down' : 'pi-chevron-up',
                    'text-green-500',
                    'mr-1 ml-auto',
                  ]"
                ></span>
              </template>

              <RouterLink :class="buttonStyles" :to="`/remote`">
                <Folders
                  :size="16"
                  class="!text-pink-600 dark:!text-pink-400"
                />
                <span>Remote Apps List</span>
              </RouterLink>

              <div
                class="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-pink-200 dark:bg-red-800"
              ></div>

              <div v-for="(app, index) in remoteApps" :key="app.key">
                <RouterLink :class="buttonStyles" :to="`/remote/${app.key}`">
                  <Folder
                    :size="16"
                    class="!text-pink-600 dark:!text-pink-400"
                  />
                  <span>{{ app.label }}</span>
                </RouterLink>

                <div
                  v-show="index !== remoteApps.length - 1"
                  class="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-pink-200 dark:bg-red-800"
                ></div>
              </div>
            </Panel>

            <div
              class="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-pink-200 dark:bg-red-800"
            ></div>

            <div :class="buttonStyles">
              <Palette :size="16" class="text-pink-600 dark:text-pink-400" />
              <span>Theme</span>
              <Select
                :modelValue="theme"
                :options="[
                  { label: 'System', value: 'system' },
                  { label: 'Dark', value: 'dark' },
                  { label: 'Light', value: 'light' },
                ]"
                class="!ml-auto !w-auto !text-sm !rounded-lg !bg-red-50 dark:!bg-red-900/30 !text-red-800 dark:!text-red-300 !border-red-200 dark:!border-red-700"
                labelClass="!text-red-800 dark:!text-red-300"
                optionLabel="label"
                optionValue="value"
                @update:modelValue="handleThemeChange"
              />
            </div>

            <div
              class="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-pink-200 dark:bg-red-800"
            ></div>

            <a
              :class="buttonStyles"
              :href="DEVELOPER_PROFILE"
              class="!text-pink-700 dark:!text-pink-300 !border-none !flex !items-center !justify-start shadow-none"
              rel="noopener noreferrer nofollow"
              target="_blank"
            >
              <UserCircle :size="16" class="text-pink-600 dark:text-pink-400" />
              <span>Developer Profile</span>
            </a>
          </div>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { Blocks, Folder, Folders, Palette, UserCircle } from "lucide-vue-next";
import { Drawer, Panel, Select } from "primevue";
import { useNavbarStore } from "../../stores/navbarStore";
import { RouterLink } from "vue-router";
import { DEVELOPER_PROFILE } from "../../services/constants";
import { useTheme } from "../../composables/theme";
import toastHandler from "../../composables/toastHandeler";
import { ref } from "vue";

const navbarStore = useNavbarStore();
const { showToast } = toastHandler();
const { theme, updateTheme } = useTheme();

const isPanelCollapsed = ref(true);

const remoteApps = [
  { key: "vite_react_remoteapp", label: "Vite + React" },
  { key: "vite_vue_remoteapp", label: "Vite + Vue" },
  { key: "vite_svelte_remoteapp", label: "Vite + Svelte" },
  { key: "vite_solidjs_remoteapp", label: "Vite + SolidJs" },
  { key: "webpack_react_remoteapp", label: "Webpack + React" },
  { key: "webpack_vue_remoteapp", label: "Webpack + VueJs" },
  { key: "angular_remoteapp", label: "Webpack + Angular" },
];

const buttonStyles =
  "!px-2 !py-4 !bg-transparent !text-red-700 dark:!text-red-300 hover:!bg-pink-100 dark:hover:!bg-pink-950/30 flex items-center !gap-x-3 !rounded-xl *:text-lg font-normal font-content transition-colors duration-200 !border-none";

const togglePanel = () => {
  isPanelCollapsed.value = !isPanelCollapsed.value;
};

// Theme change handler
const handleThemeChange = (selectedTheme: string) => {
  updateTheme((selectedTheme as "light" | "dark" | "system") || "system");
  showToast(
    "info",
    "Theme Changed",
    `Switched to ${selectedTheme === "system" ? "system" : selectedTheme} mode`
  );
};
</script>

<style lang="css" scoped></style>
