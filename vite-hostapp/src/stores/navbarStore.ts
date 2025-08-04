import { defineStore } from "pinia";
import { ref } from "vue";

export const useNavbarStore = defineStore("navbar", () => {
  const showSideMenu = ref<boolean>(false);

  const toggleSideMenu = () => {
    showSideMenu.value = !showSideMenu.value;
  };

  return {
    showSideMenu,
    toggleSideMenu,
  };
});
