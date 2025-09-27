<template>
  <div class="w-full h-full flex items-center gap-x-2 p-2">
    <router-link
      v-for="(value, key) in source"
      :key="key"
      :to="value.path"
      class="p-button border py-2 px-4 rounded-xl"
    >
      {{ value.label }}
    </router-link>

    <button @click="reloadPage" class="p-button">Reload</button>
    <button @click="navigate" class="p-button">Navigate</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

// import Button from "primevue/button";

const router = useRouter();

const source = [
  { label: "Home", path: "/" },
  { label: "Sub Page 1", path: "/sub-page-1" },
  { label: "Sub Page 2", path: "/sub-page-2" },
];

const reloadPage = () => {
  window.location.reload();
  console.log("click click");
};

const navigate = () => {
  router?.push("/sub-page-1");
};
</script>
