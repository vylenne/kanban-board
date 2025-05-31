import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Column } from '@/types/types'

const generateId = () => Math.random().toString(36).slice(2, 9)

export const useBoardStore = defineStore('board', () => {
  const columns = ref<Column[]>([
    {
      id: generateId(),
      name: 'TODO',
      cards: [],
    },
    {
      id: generateId(),
      name: 'In progress',
      cards: [],
    },
    {
      id: generateId(),
      name: 'Done',
      cards: [],
    },
  ])

  const editingEnabled = ref(true)

  const addColumn = () => {
    columns.value.push({
      id: generateId(),
      name: 'New Column',
      cards: [],
    })
  }

  const deleteColumn = (columnId: string) => {
    const index = columns.value.findIndex(col => col.id === columnId)
    if (index !== -1) {
      columns.value.splice(index, 1)
    }
  }

  const toggleEditing = () => {
    editingEnabled.value = !editingEnabled.value
  }

  const shuffleColumns = () => {
    columns.value = columns.value
      .map((col) => ({ ...col }))
      .sort(() => Math.random() - 0.5)
  }

  const shuffleCards = () => {
    columns.value.forEach((col) => {
      col.cards = [...col.cards].sort(() => Math.random() - 0.5)
    })
  }

  return {
    columns,
    editingEnabled,
    addColumn,
    deleteColumn,
    toggleEditing,
    shuffleColumns,
    shuffleCards,
  }
})
