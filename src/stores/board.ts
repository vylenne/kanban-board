import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Column, Card } from '@/types/types'

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

  const toggleColumnLock = (columnId: string) => {
    const col = columns.value.find((c) => c.id === columnId)
    if (col) {
      col.isLocked = !col.isLocked
    }
  }

  const shuffleColumns = () => {
    columns.value = columns.value
      .map((col) => ({ ...col }))
      .sort(() => Math.random() - 0.5)
  }

  const addCard = (columnId: string) => {
    const column = columns.value.find(col => col.id === columnId)
    if (!column) return

    const newCard: Card = {
      id: generateId(),
      title: '',
      description: ''
    }

    column.cards.push(newCard)
  }

  const deleteCard = (columnId: string, cardId: string) => {
    const column = columns.value.find(col => col.id === columnId)
    if (!column) return

    column.cards = column.cards.filter(card => card.id !== cardId)
  }

  const updateCard = (columnId: string, cardId: string, updated: Partial<Card>) => {
    const column = columns.value.find(col => col.id === columnId)
    if (!column) return

    const card = column.cards.find(card => card.id === cardId)
    if (!card) return

    Object.assign(card, updated)
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
    toggleColumnLock,
    shuffleColumns,
    addCard,
    deleteCard,
    updateCard,
    shuffleCards,
  }
})
