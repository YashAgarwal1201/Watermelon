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

    <!-- <Button label="Reload" @click="reloadPage" /> -->
  </div>
</template>

<script setup lang="ts">
// import Button from "primevue/button";

const source = [
  { label: "Home", path: "/" },
  { label: "Sub Page 1", path: "/sub-page-1" },
  { label: "Sub Page 2", path: "/sub-page-2" },
];

// const reloadPage = () => {
//   window.location.reload();
// };
</script>
