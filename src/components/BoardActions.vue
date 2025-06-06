<script setup lang="ts">
import { useBoardStore } from '@/stores/board'

import Button from './ui/Button.vue'

import { IconAdd, IconShuffle, IconPause, IconPlay } from '@/components/icons'

const board = useBoardStore()


const actions = [
  {
    label: 'New Column',
    icon: IconAdd,
    action: board.addColumn,
  },
  {
    label: 'Shuffle Columns',
    icon: IconShuffle,
    action: board.shuffleColumns,
  },
  {
    label: 'Shuffle Cards',
    icon: IconShuffle,
    action: board.shuffleCards,
  },
]
</script>

<template>
  <div>
    <div class="actions">
      <Button v-for="(btn, index) in actions" :key="index" @click="btn.action">
        <template #icon>
          <component :is="btn.icon" />
        </template>
        {{ btn.label }}
      </Button>

      <Button @click="board.toggleLockAllColumns">
        <template #icon>
          <IconPlay v-if="board.allColumnsLocked" />
          <IconPause v-else />
        </template>
        {{ board.allColumnsLocked ? 'Enable Editing' : 'Disable Editing' }}
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
