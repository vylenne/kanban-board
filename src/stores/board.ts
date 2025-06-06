import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { nanoid } from 'nanoid'
import type { Column, Card } from '@/types'

const STORAGE_KEY = 'kanban-board-state'

export const useBoardStore = defineStore('board', () => {
  const columns = ref<Column[]>([
    { id: nanoid(), name: 'TODO', isLocked: false, cards: [] },
    { id: nanoid(), name: 'In progress', isLocked: false, cards: [] },
    { id: nanoid(), name: 'Done', isLocked: false, cards: [] },
  ])

  const allColumnsLocked = ref(false)

  const loadFromStorage = () => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.columns) columns.value = parsed.columns
      } catch {
        console.warn('Failed to parse saved board state')
      }
    }
  }

  loadFromStorage()

  watch(
    [columns],
    () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          columns: columns.value,
        }),
      )
    },
    { deep: true },
  )

  const addColumn = () => {
    columns.value.push({
      id: nanoid(),
      name: 'New Column',
      cards: [],
    })
  }

  const updateColumn = (columnId: string, updatedData: Partial<Column>) => {
    const column = columns.value.find(col => col.id === columnId)
    if (column) {
      Object.assign(column, updatedData)
    }
  }

  const deleteColumn = (columnId: string) => {
    const index = columns.value.findIndex(col => col.id === columnId)
    if (index !== -1) {
      columns.value.splice(index, 1)
    }
  }

  const toggleLockAllColumns = () => {
    const shouldLock = columns.value.some(col => !col.isLocked)
    allColumnsLocked.value = shouldLock
    columns.value.forEach(col => {
      col.isLocked = shouldLock
    })
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
      id: nanoid(),
      title: '',
      description: '',
      updatedAt: new Date().toISOString(),
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

  const clearColumnCards = (columnId: string) => {
    const column = columns.value.find(col => col.id === columnId)
    if (column) {
      column.cards = []
    }
  }

  const moveCard = (fromColumnId: string, toColumnId: string, cardId: string) => {
    const fromColumn = columns.value.find(c => c.id === fromColumnId)
    const toColumn = columns.value.find(c => c.id === toColumnId)
    if (!fromColumn || !toColumn) return

    const cardIndex = fromColumn.cards.findIndex(c => c.id === cardId)
    if (cardIndex === -1) return

    const [card] = fromColumn.cards.splice(cardIndex, 1)
    toColumn.cards.push(card)
  }

  return {
    columns,
    allColumnsLocked,
    addColumn,
    updateColumn,
    deleteColumn,
    toggleLockAllColumns,
    toggleColumnLock,
    shuffleColumns,
    clearColumnCards,
    addCard,
    deleteCard,
    updateCard,
    shuffleCards,
    moveCard,
    loadFromStorage
  }
})
