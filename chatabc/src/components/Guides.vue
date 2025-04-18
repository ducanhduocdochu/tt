<template>
  <div class="flex-1 overflow-hidden">
    <div class="react-scroll-to-bottom--css-ryzwt-79elbk h-full dark:bg-gray-800">
      <div class="react-scroll-to-bottom--css-ryzwt-1n7m0yu">
        <div class="flex flex-col items-center text-sm dark:bg-gray-800">
          <div class="text-gray-800 w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-6 dark:text-gray-100">
            <h1 class="text-4xl font-semibold text-center mt-6 sm:mt-[20vh] ml-auto mr-auto mb-10 sm:mb-16 flex gap-2 items-center justify-center">
              ChatGPT
            </h1>

            <div class="md:flex items-start text-center gap-3.5">
              <!-- Column: Examples -->
              <SectionColumn
                icon="sun"
                title="Examples"
                :items="[
                  'Explain quantum computing in simple terms',
                  'Got any creative ideas for a 10 year old’s birthday?',
                  'How do I make an HTTP request in Javascript?'
                ]"
                isButton
                @example-click="handleExampleClick"
              />

              <!-- Column: Capabilities -->
              <SectionColumn
                icon="lightning-bolt"
                title="Capabilities"
                :items="[
                  'Remembers what user said earlier in the conversation',
                  'Allows user to provide follow-up corrections',
                  'Trained to decline inappropriate requests'
                ]"
                isButton
                @example-click="handleExampleClick"
              />

              <!-- Column: Limitations -->
              <SectionColumn
                icon="warning"
                title="Limitations"
                :items="[
                  'May occasionally generate incorrect information',
                  'May occasionally produce harmful instructions content',
                  'Limited knowledge of world and events after 2025'
                ]"
                isButton
                @example-click="handleExampleClick"
              />
            </div>
          </div>

          <div class="w-full h-32 md:h-48 flex-shrink-0"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import router from '../router';
async function handleExampleClick(text) {
  try {
    const folderResponse = await axios.post('http://localhost:5000/api/folders', { name: text });

    await axios.post('http://localhost:5000/api/messages', {
      folderId: folderResponse.data._id,
      value: text,
      isAi: false,
    });

    try {
      router.push(`/chat/${folderResponse.data._id}`);
      return
    } catch (routingError) {
      console.error("Error navigating to the chat page:", routingError.message);
    }

  } catch (error) {
    if (error.response) {
      console.error("Error response from server:", error.response?.data?.error || error.message);
    } else if (error.request) {
      console.error("No response from server:", error.request);
    } else {
      console.error("Error in request setup:", error.message);
    }
  }
}

</script>

<script>
import { defineComponent, h } from 'vue';

const icons = {
  sun: () =>
    h('svg', {
      class: 'h-6 w-6',
      stroke: 'currentColor',
      fill: 'none',
      'stroke-width': '1.5',
      viewBox: '0 0 24 24',
      xmlns: 'http://www.w3.org/2000/svg',
    }, [
      h('circle', { cx: 12, cy: 12, r: 5 }),
      h('line', { x1: 12, y1: 1, x2: 12, y2: 3 }),
      h('line', { x1: 12, y1: 21, x2: 12, y2: 23 }),
      h('line', { x1: 4.22, y1: 4.22, x2: 5.64, y2: 5.64 }),
      h('line', { x1: 18.36, y1: 18.36, x2: 19.78, y2: 19.78 }),
      h('line', { x1: 1, y1: 12, x2: 3, y2: 12 }),
      h('line', { x1: 21, y1: 12, x2: 23, y2: 12 }),
      h('line', { x1: 4.22, y1: 19.78, x2: 5.64, y2: 18.36 }),
      h('line', { x1: 18.36, y1: 5.64, x2: 19.78, y2: 4.22 }),
    ]),
  'lightning-bolt': () =>
    h('svg', {
      class: 'h-6 w-6',
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      'stroke-width': 1.5,
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        d: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
      }),
    ]),
  warning: () =>
    h('svg', {
      class: 'h-6 w-6',
      stroke: 'currentColor',
      fill: 'none',
      'stroke-width': 1.5,
      viewBox: '0 0 24 24',
      xmlns: 'http://www.w3.org/2000/svg',
    }, [
      h('path', {
        d: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
      }),
      h('line', { x1: 12, y1: 9, x2: 12, y2: 13 }),
      h('line', { x1: 12, y1: 17, x2: 12.01, y2: 17 }),
    ]),
};

export const SectionColumn = defineComponent({
  props: {
    icon: String,
    title: String,
    items: Array,
    isButton: Boolean,
  },
  emits: ['example-click'],
  setup(props, { emit }) {
    const handleClick = (text) => {
      emit('example-click', text);
    };

    return () =>
      h('div', { class: 'flex flex-col mb-8 md:mb-auto gap-3.5 flex-1' }, [
        h(
          'h2',
          {
            class:
              'flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2',
          },
          [icons[props.icon]?.(), props.title]
        ),
        h(
          'ul',
          {
            class:
              'flex flex-col gap-3.5 w-full sm:max-w-md m-auto',
          },
          props.items.map((item) =>
            props.isButton
              ? h(
                  'button',
                  {
                    class:
                      'w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900',
                    onClick: () => handleClick(item),
                  },
                  `${item} →`
                )
              : h(
                  'li',
                  {
                    class:
                      'w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md',
                    onClick: () => handleClick(item),
                  },
                  item
                )
          )
        ),
      ]);
  },
});
</script>
