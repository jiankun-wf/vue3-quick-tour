<script setup lang="ts">
import { NButton, NSpace } from "naive-ui";
import { Tour } from "./components/Tour";
import { ref } from "vue";
import { TourStep } from "./components/type";

const steps: TourStep[] = [
  {
    el: () => document.getElementById("info-btn") as HTMLElement,
  },
  {
    el: () => document.getElementById("success-btn") as HTMLElement,
    mask: {
      color: "rgba(80, 255, 255, .4)",
      style: {
        boxShadow: "inset 0 0 15px #333",
      },
    },
  },
  {
    el: () => document.getElementById("warning-btn") as HTMLElement,
  },
  {
    el: () => document.getElementById("error-btn") as HTMLElement,
  },
];

const show = ref(false);
const current = ref(0);

const handleOpenTour = () => {
  show.value = true;
};
</script>

<template>
  <div>
    <NButton type="default" @click="handleOpenTour" style="margin-bottom: 20px"
      >开始吧</NButton
    >
    <NSpace>
      <NButton id="info-btn" type="info"> Info </NButton>
      <NButton id="success-btn" type="success"> Success </NButton>
      <NButton id="warning-btn" type="warning"> Warning </NButton>
      <NButton id="error-btn" type="error"> Error </NButton>
    </NSpace>

    <Tour
      :steps="steps"
      :show="show"
      mask
      v-model:current="current"
      :padding="{ x: 9, y: 8 }"
    />
  </div>
</template>

<style scoped></style>
