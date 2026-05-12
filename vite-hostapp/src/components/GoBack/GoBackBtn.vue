<template>
  <div>
    <Button
      rounded
      class="bg-transparent! border-transparent! text-green-500!"
      @click="goBack"
    >
      <template #icon>
        <ArrowLeft :size="20" />
      </template>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";
import Button from "primevue/button";

const router = useRouter();

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
};
</script>
