import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('board', () => {
  const count = ref(0)

  return { board }
})
