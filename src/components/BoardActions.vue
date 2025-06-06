<script setup lang="ts">
import { useBoardStore } from '@/stores/board'

import Button from './ui/Button.vue'

import { IconAdd, IconShuffle, IconPause, IconPlay } from '@/components/icons'

const board = useBoardStore()
</script>

<template>
  <div>
    <div class="actions">
      <Button @click="board.addColumn">
        <template #icon>
          <IconAdd />
        </template>
        New Column
      </Button>
      <Button @click="board.shuffleColumns">
        <template #icon>
          <IconShuffle />
        </template>
        Shuffle Columns
      </Button>
      <Button @click="board.shuffleCards">
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
    <p class="desc">Board Actions</p>
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.desc {
  text-align: center;
  margin-top: 12px;
  font-weight: 600;
  font-size: 14px;
  background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.12) 100%);
  color: transparent;
  background-clip: text;
}
</style>
