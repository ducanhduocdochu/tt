<template>
  <div class="container">
    <div class="todo">
      <h3 class="heading">Danh sách công việc</h3>
      <form @submit.prevent="handleAddJob" class="header">
        <input v-model="inputValue" type="text" class="input" />
        <button type="submit" class="button button-add">Add job</button>
      </form>

      <ul class="list-item" v-for="item in listJob" :key="item.id">
        <li class="item">
          <div class="left">
            <input
              @change="handleUpdateStatus(item.id)"
              v-bind:checked="item.status"
              type="checkbox"
              :id="item.name"
            />
            <label
              :style="{ textDecoration: item.status ? 'line-through' : 'none' }"
              :for="item.name"
              >{{ item.name }}</label
            >
          </div>
          <div class="right">
            <button @click="handleDelete(item)" class="button button-delete">
              Delete
            </button>
          </div>
        </li>
      </ul>

      <footer class="footer">
        <p>Công việc hoàn thành:</p>
        <p>
          <b> {{ completeJobs }} </b> / <b> {{ listJob.length }} </b>
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, watchEffect } from "vue";

const inputValue = ref("");
const listJob = reactive(JSON.parse(localStorage.getItem("jobs")) || []);
const completeJobs = ref(0);

/**
 * Hàm lưu trữ liệu lên localStorage
 * @param key Key của dữ liệu
 * @param data Là mảng công việc
 */
const savaData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const handleAddJob = () => {
  if (!inputValue.value) {
    alert("Tên công việc không được để trống.");
    return;
  }

  const findJobByName = listJob.find((item) => item.name === inputValue.value);

  if (findJobByName) {
    alert(`Tên công việc ${inputValue.value} đã tồn tại.`);
    return;
  }

  listJob.push({
    id: Math.ceil(Math.random() * 100000000),
    name: inputValue.value,
    status: false,
  });

  savaData("jobs", listJob);

  inputValue.value = "";
};

const handleUpdateStatus = (id) => {
  const findIndexJob = listJob.findIndex((item) => item.id === id);

  listJob[findIndexJob].status = !listJob[findIndexJob].status;

  savaData("jobs", listJob);
};

const handleDelete = (item) => {
  const isConfirmDelete = confirm(
    `Bạn có xác nhận muốn xóa công việc "${item.name}" không?`
  );

  if (isConfirmDelete) {
    const filterJobs = listJob.filter((jobItem) => jobItem.id !== item.id);

    listJob.length = 0; 

    listJob.push(...filterJobs); 

    savaData("jobs", listJob);
  }
};

const updateStatusJob = () => {
  const filterJobCompletes = listJob.filter((item) => item.status);

  completeJobs.value = filterJobCompletes.length;
};

watchEffect(() => {
  updateStatusJob();
});
</script>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.heading {
  text-align: center;
  font-size: 24px;
  padding-bottom: 24px;
}

.todo {
  width: 600px;
  border: 1px solid #dadada;
  padding: 20px 24px;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 12px;
}

.input {
  height: 36px;
  border: 1px solid #dadada;
  outline: none;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  flex: 1;
  padding: 0 16px;
}

.button {
  height: 36px;
  border: 1px solid transparent;
  color: #fff;
  outline: none;
  border-radius: 4px;
  padding: 0 16px;
  cursor: pointer;
}

.button-add {
  background-color: blue;
}

.button-delete {
  background-color: red;
}

.list-item {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

input[type="checkbox"] {
  height: 18px;
  width: 18px;
}

.left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.right {
}

.footer {
  display: flex;
  gap: 8px;
}
</style>
