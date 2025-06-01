<script setup lang="ts">
import { useBoardStore } from '@/stores/board'

import Button from './ui/Button.vue'

import IconAdd from '@/components/icons/IconAdd.vue'
import IconShuffle from '@/components/icons/IconShuffle.vue'
import IconPause from '@/components/icons/IconPause.vue'
import IconPlay from './icons/IconPlay.vue'

const board = useBoardStore()
</script>

<template>
  <div class="actions">
    <Button @click="board.addColumn()">
      <template #icon>
        <IconAdd />
      </template>
      New Column
    </Button>
    <Button @click="board.shuffleColumns()">
      <template #icon>
        <IconShuffle />
      </template>
      Shuffle Columns
    </Button>
    <Button @click="board.shuffleCards()">
      <template #icon>
        <IconShuffle />
      </template>
      Shuffle Cards
    </Button>
    <Button @click="board.toggleGlobalEditing">
      <template #icon>
        <IconPause v-if="board.editingEnabled" />
        <IconPlay v-else />
      </template>
      {{ board.editingEnabled ? 'Disable Editing' : 'Enable Editing' }}
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
