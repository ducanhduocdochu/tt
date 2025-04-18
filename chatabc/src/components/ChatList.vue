<template>
  <div class="w-full">
    <div v-for="(chat, i) in messageStore.messages" :key="i"
      class="w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group bg-gray-50 dark:bg-[#444654]"
      :class="{ ai: chat.isAi }">
      <Chat :isLast="i === messageStore.messages.length - 1" :chat="chat" :key="i" class="w-full" />
    </div>
    <div class="w-full h-32 md:h-48 flex-shrink-0"></div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { onMounted, watch } from 'vue';
import Chat from './Chat.vue';
import { useMessageStore } from '../stores/message';
import { useFolderStore } from '../stores/folder';
import axios from 'axios';

const folderStore = useFolderStore();

const messageStore = useMessageStore();
const route = useRoute();
const folderId = route.params.id;

onMounted(() => {
  fetchMessages(folderId);
  folderStore.fetchQuestions();
});

watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId !== oldId) {
      await fetchMessages(newId);
    }
  }
);

const fetchMessages = async (id) => {
  try {
    await messageStore.fetchMessages(id);
    // Nếu không có message nào trong folder, gửi câu hỏi mặc định
    if (messageStore.messages.length < 2) {
      // const res = await openai.createCompletion({
      //   model: 'text-davinci-003',
      //   prompt: messageStore.messages[0].value,
      //   max_tokens: 1024,
      //   temperature: 0.7,
      // });
      // const answer = res.data.choices[0].text.trim();
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "mistralai/mistral-7b-instruct", 
          messages: [{ role: "user", content: messageStore.messages[0].value }]
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPEN_API_KEY}`,
            "HTTP-Referer": "http://localhost:5173",
          }
        }
      );

      const answer = response.data.choices[0].message.content.trim();

      await messageStore.addMessage({
        folderId,
        value: answer,
        isAi: true
      });
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};

</script>

<style scoped></style>