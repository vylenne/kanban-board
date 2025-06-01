<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBoardStore } from '@/stores/board'

import IconAdd from '@/components/icons/IconAdd.vue'
import IconShuffle from '@/components/icons/IconShuffle.vue'
import IconPause from '@/components/icons/IconPause.vue'
import IconPlay from './icons/IconPlay.vue'

const board = useBoardStore()
const { editingEnabled } = storeToRefs(board)

const addColumn = () => {
  board.addColumn()
}

const shuffleColumns = () => {
  board.shuffleColumns()
}

const shuffleCards = () => {
  board.shuffleCards()
}

const toggleEditing = () => {
  board.editingEnabled = !editingEnabled.value
}
</script>

<template>
  <div class="actions">
    <button class="btn-action" @click="addColumn">
      <IconAdd />
      New Column
    </button>
    <button class="btn-action" @click="shuffleColumns">
      <IconShuffle />
      Shuffle Columns
    </button>
    <button class="btn-action" @click="shuffleCards">
      <IconShuffle />
      Shuffle Cards
    </button>
    <button v-if="board.editingEnabled" class="btn-action" @click="toggleEditing">
      <IconPause />
      Disable Editing
    </button>
    <button v-else class="btn-action" @click="toggleEditing">
      <IconPlay />
      Enable Editing
    </button>
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style>
