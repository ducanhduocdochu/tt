import { defineStore } from 'pinia';

export const useFolderStore = defineStore('folderStore', {
  state: () => ({
    questions: [],
  }),
  actions: {
    async fetchQuestions() {
      try {
        const res = await fetch('http://localhost:5000/api/folders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await res.json();
        this.questions = data;
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
  }
});
