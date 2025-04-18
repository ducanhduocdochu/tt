<template>
  <div>
    <h1>List rendering</h1>

    <ul v-for="user in listUser" :key="user.id">
      <li>
        <span>Id: {{ user.id }}</span> -
        <span>Name: {{ user.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
const listUser = [
  {
    id: 1,
    name: "Nguyễn Văn A",
  },
  {
    id: 2,
    name: "Nguyễn Văn B",
  },
  {
    id: 3,
    name: "Nguyễn Văn C",
  },
];
</script>

<style></style>
