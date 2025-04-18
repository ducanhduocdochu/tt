<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useFolderStore } from '../stores/folder';

const router = useRouter();
const emits = defineEmits(['clear', 'light']);

const folderStore = useFolderStore();

const navigateToNewChat = () => {
  router.push('/');
  return
};

const navigateToChat = (id) => {
  router.push(`/chat/${id}`);
  return
};

let isTrue = ref(false);
let isConfirm = ref({
  text: "Clear conversation",
  isTrue: false,
});

const changeToLight = () => {
  isTrue.value = !isTrue.value;
  emits('light', isTrue.value);
};

onMounted(() => {
  folderStore.fetchQuestions();
});
</script>

<template>
  <div class="
      dark
      hidden
      bg-gray-900
      md:fixed
      md:inset-y-0
      md:flex
      md:w-[260px]
      md:flex-col
    ">
    <div class="flex h-full min-h-0 flex-col">
      <div class="
          scrollbar-trigger
          flex
          h-full
          w-full
          flex-1
          items-start
          border-white/20
        ">
        <nav class="flex h-full flex-1 flex-col space-y-1 p-2">
          <button @click="navigateToNewChat" class="
              flex
              py-3
              px-3
              items-center
              gap-3
              rounded-md
              hover:bg-gray-500/10
              transition-colors
              duration-200
              text-white
              cursor-pointer
              text-sm
              mb-2
              flex-shrink-0
              border border-white/20
            "><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
              stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>New chat
          </button>
          <div class="flex-col flex-1 overflow-y-auto border-b border-white/20">
            <div class="flex flex-col gap-2 text-gray-100 text-sm">
              <button @click="navigateToChat(thread._id)" v-for="(thread, index) in folderStore.questions" :key="index" class="
                  flex
                  py-3
                  px-3
                  items-center
                  gap-3
                  relative
                  rounded-md
                  hover:bg-[#2A2B32]
                  cursor-pointer
                  break-all
                  hover:pr-4
                  group
                "><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
                  stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <div class="
                    flex-1
                    text-ellipsis
                    max-h-5
                    overflow-hidden
                    break-all
                    relative
                  ">
                  {{ thread.name }}
                  <div class="
                      absolute
                      inset-y-0
                      right-0
                      w-8
                      z-10
                      bg-gradient-to-l
                      from-gray-900
                      group-hover:from-[#2A2B32]
                    "></div>
                </div>
              </button>
            </div>
          </div>
          <a v-if="folderStore.questions && folderStore.questions.length" class="
              flex
              py-3
              px-3
              items-center
              gap-3
              rounded-md
              hover:bg-gray-500/10
              transition-colors
              duration-200
              text-white
              cursor-pointer
              text-sm
            ">
            <svg v-if="isConfirm.isTrue" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"
              stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em"
              xmlns="http://www.w3.org/2000/svg">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <svg v-else stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
              stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>{{ isConfirm.text }}</a>
          <a @click="changeToLight()" class="
              flex
              py-3
              px-3
              items-center
              gap-3
              rounded-md
              hover:bg-gray-500/10
              transition-colors
              duration-200
              text-white
              cursor-pointer
              text-sm
            ">
            <svg v-if="isTrue" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"
              stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            <svg v-else stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
              stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>{{ isTrue ? "Dark" : "Light" }} mode</a>
          <a href="https://help.openai.com/en/collections/3742473-chatgpt" target="_blank" class="
              flex
              py-3
              px-3
              items-center
              gap-3
              rounded-md
              hover:bg-gray-500/10
              transition-colors
              duration-200
              text-white
              cursor-pointer
              text-sm
            "><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
              stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>Updates &amp; FAQ</a><a class="
              flex
              py-3
              px-3
              items-center
              gap-3
              rounded-md
              hover:bg-gray-500/10
              transition-colors
              duration-200
              text-white
              cursor-pointer
              text-sm
            "><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
              stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>Log out</a>
        </nav>
      </div>
    </div>
  </div>
</template>
