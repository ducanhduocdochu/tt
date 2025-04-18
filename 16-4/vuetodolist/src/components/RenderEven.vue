<template>
  <div>
    <ul v-for="(number, index) in filterEvenNumber()" :key="index">
      <li>{{ number }}</li>
    </ul>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const numbers = reactive([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

const filterEvenNumber = () => {
  const filterNumber = numbers.filter((item) => item % 2 === 0);

  return filterNumber;
};
</script>

<style></style>
