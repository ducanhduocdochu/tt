<script setup>
import Guides from "./components/Guides.vue";
import Sidebar from "./components/Sidebar.vue";
import { computed, ref } from "vue";
import { useRoute, useRouter } from 'vue-router';
import ChatList from "./components/ChatList.vue";
const route = useRoute();
const router = useRouter();

let response = ref([]);
const question = ref("");
const wrapper = ref([]);
const loading = ref(false);
const saveQuestions = ref([]);
const isLight = ref(false);
const folderId = computed(() => route.params.id);


import { useMessageStore } from './stores/message';
import axios from "axios";

const messageStore = useMessageStore();

// const getAnswer = async (message) => {
//   try {
//     loading.value = true;
//     wrapper.value.push({
//       isAi: false,
//       value: question.value,
//     });
//     wrapper.value.push({
//       isAi: true,
//       value: "|",
//     });
//     const res = await openai.createCompletion({
//       model: "text-davinci-003",
//       prompt: question.value,
//       max_tokens: 2024,
//       temperature: 0,
//     });
//     let data = res.data.choices[0].text;
//     wrapper.value.pop();
//     wrapper.value.push({
//       isAi: true,
//       value: data.trim(),
//     });

//     let newquestions = wrapper.value.filter((item) => {
//       return !item.isAi;
//     });
//     localStorage.setItem("threads", JSON.stringify(newquestions));
//     getQuestions();
//   } catch ({ error }) {
//     response.value = error;
//   } finally {
//     loading.value = false;
//     question.value = "";
//   }
// };

// const getAnswer = async () => {
//   try {
//     if (!folderId.value) {
//       const folderResponse = await axios.post('http://localhost:5000/api/folders', { name: question.value });

//       await axios.post('http://localhost:5000/api/messages', {
//         folderId: folderResponse.data._id,
//         value: question.value,
//         isAi: false,
//       });

//       router.push(`/chat/${folderResponse.data._id}`);
//       return;
//     }
    
//     loading.value = true;

//     messageStore.addTemporaryMessage({
//       isAi: false,
//       value: question.value,
//     });

//     messageStore.addTemporaryMessage({
//       isAi: true,
//       value: "|",  
//     });

//     await new Promise((resolve) => setTimeout(resolve, 1500));

//     const fakeResponse = {
//       text: `Đây là câu trả lời giả lập cho câu hỏi: ${question.value}`,
//     };

//     messageStore.addTemporaryMessage({
//       isAi: true,
//       value: fakeResponse.text.trim(),
//     });

//     await messageStore.addMessage({
//       folderId: folderId.value,
//       isAi: false,
//       value: question.value,
//     });

//     await messageStore.addMessage({
//       folderId: folderId.value,
//       isAi: true,
//       value: fakeResponse.text.trim(),
//     });
    
//     await messageStore.fetchMessages(folderId.value);
//   } catch (err) {
//     console.log(err)
//     response.value = err;
//   } finally {
//     question.value = "";
//   }
// };

const getAnswer = async () => {
  try {
    if (!question.value.trim()) return;

    if (!folderId.value) {
      const folderResponse = await axios.post('http://localhost:5000/api/folders', { name: question.value });

      await axios.post('http://localhost:5000/api/messages', {
        folderId: folderResponse.data._id,
        value: question.value,
        isAi: false,
      });

      router.push(`/chat/${folderResponse.data._id}`);
      return;
    }

    loading.value = true;

    messageStore.addTemporaryMessage({
      isAi: false,
      value: question.value,
    });

    messageStore.addTemporaryMessage({
      isAi: true,
      value: "|",
    });

    // const res = await openai.createCompletion({
    //   model: 'text-davinci-003',
    //   prompt: question.value,
    //   max_tokens: 1024,
    //   temperature: 0.7,
    // });

    // const answer = res.data.choices[0].text.trim();
  const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct", 
        messages: [{ role: "user", content: question.value }]
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPEN_API_KEY}`,
          "HTTP-Referer": "http://localhost:5173",
        }
      }
    );

    const answer = response.data.choices[0].message.content.trim();

    messageStore.addTemporaryMessage({
      isAi: true,
      value: answer,
    });

      await messageStore.addMessage({
        folderId: folderId.value,
        isAi: false,
        value: question.value,
      });

      await messageStore.addMessage({
        folderId: folderId.value,
        isAi: true,
        value: answer,
      });

    await messageStore.fetchMessages(folderId.value);
  } catch (err) {
    console.error('Error calling OpenAI:', err);
    response.value = err?.response?.data?.error?.message || err.message;
  } finally {
    loading.value = false;
    question.value = '';
  }
};

</script>

<template>
  <div class="overflow-hidden w-full h-full relative" :class="isLight ? 'light' : 'dark'">
    <div class="flex flex-1 flex-col md:pl-[260px] h-screen">
      <main class="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
        <div class="h-full" v-if="route.path !== '/'">
          <div class="h-full flex-1 overflow-hidden">
            <div class="h-full overflow-y-auto dark:bg-gray-800">
              <div>
                <div class="flex flex-col items-center text-sm dark:bg-gray-800">
                  <ChatList :getAnswer="getAnswer" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Guides v-else />
        <div
          class="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient">
          <form @submit.prevent="getAnswer"
            class="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6">
            <div
              class="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
              <textarea
                class="m-0 w-full h-full resize-none border-0 bg-transparent p-0 pl-2 pr-7 focus:ring-0 focus-visible:ring-0 focus-visible:outline-0 dark:bg-transparent md:pl-0"
                rows="1" cols="1" @keyup.enter="getAnswer" placeholder="Ask anything..." v-model="question"></textarea>
              <button type="submit"
                class="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
                  stroke-linejoin="round" class="h-4 w-4 mr-1" height="1em" width="1em"
                  xmlns="http://www.w3.org/2000/svg">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
    <Sidebar @light="isLight = $event" />
  </div>
</template>


<style scoped></style>
