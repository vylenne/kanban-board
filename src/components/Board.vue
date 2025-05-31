<script setup lang="ts">
import Column from './Column.vue'
import { useBoardStore } from '@/stores/board'

const board = useBoardStore()
</script>

<template>
  <div class="board-grid">
    <Column
      v-for="column in board.columns"
      :key="column.id"
      :column="column"
      :editing-enabled="board.editingEnabled"
      @delete-column="board.deleteColumn(column.id)"
    />
  </div>
</template>

<style scoped>
.board-grid {
  height: 100%;
  display: flex;
  gap: 20px;
  align-items: flex-start;
  overflow-x: auto;
}
</style>
