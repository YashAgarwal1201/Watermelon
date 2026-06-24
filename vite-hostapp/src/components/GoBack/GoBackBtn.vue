<template>
  <div>
    <RouterLink
      rounded
      class="bg-transparent! border-transparent! text-green-500!"
      :to="to"
      replace
    >
      <ArrowLeft :size="20" />
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";

const props = defineProps<{
  to: string;
}>();
</script>
