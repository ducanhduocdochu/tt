import { defineStore } from 'pinia';

export const useMessageStore = defineStore('messageStore', {
  state: () => ({
    messages: [],
  }),
  actions: {
    addTemporaryMessage({ isAi, value }) {
      this.messages.push({ isAi, value });
    },

    async addMessage({ folderId, value, isAi }) {
      try {
        const res = await fetch('http://localhost:5000/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ folderId, value, isAi }),
        });

        if (!res.ok) {
          throw new Error('Failed to save message');
        }

        await this.fetchMessages(folderId);
      } catch (err) {
        console.error('Error saving message:', err);
      }
    },

    async fetchMessages(folderId) {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/${folderId}`);
        if (!res.ok) throw new Error('Failed to fetch messages');
        this.messages = await res.json();
      } catch (err) {
        this.messages = [];
      }
    },
  },
});
