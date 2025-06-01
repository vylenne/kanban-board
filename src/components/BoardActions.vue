<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBoardStore } from '@/stores/board'

import Button from './ui/Button.vue'

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
    <Button @click="addColumn">
      <template #icon>
        <IconAdd />
      </template>
      New Column
    </Button>
    <Button @click="shuffleColumns">
      <template #icon>
        <IconShuffle />
      </template>
      Shuffle Columns
    </Button>
    <Button @click="shuffleCards">
      <template #icon>
        <IconShuffle />
      </template>
      Shuffle Cards
    </Button>
    <Button v-if="board.editingEnabled" @click="toggleEditing">
      <template #icon>
        <IconPause />
      </template>
      Disable Editing
    </Button>
    <Button v-else @click="toggleEditing">
      <template #icon>
        <IconPlay />
      </template>
      Enable Editing
    </Button>
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style>
