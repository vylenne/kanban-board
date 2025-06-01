<script setup>
import IconAdd from '@/components/icons/IconAdd.vue'
import IconShuffle from '@/components/icons/IconShuffle.vue'
import IconPause from '@/components/icons/IconPause.vue'
import { useBoardStore } from '@/stores/board'

const board = useBoardStore()

</script>

<template>
  <div class="actions">
    <button class="btn-action" @click="emit('new-column')">
      <IconAdd />
      New Column
    </button>
    <button class="btn-action" @click="emit('shuffle-columns')">
      <IconShuffle />
      Shuffle Columns
    </button>
    <button class="btn-action" @click="emit('shuffle-cards')">
      <IconShuffle />
      Shuffle Cards
    </button>
    <button class="btn-action" @click="emit('toggle-editing')">
      <IconPause />
      {{ board.editingEnabled ? 'Disable Editing' : 'Enable Editing' }}
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
