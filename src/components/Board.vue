<script setup lang="ts">
import { useBoardStore } from '@/stores/board'

import Column from './Column.vue'
import BoardActions from './BoardActions.vue'

const board = useBoardStore()
</script>

<template>
  <div class="board">
    <div class="board-grid">
      <Column
        v-for="column in board.columns"
        :key="column.id"
        :column="column"
        :editing-enabled="board.editingEnabled"
        @delete-column="board.deleteColumn(column.id)"
      />
    </div>
    <BoardActions />
  </div>
</template>

<style scoped>
.board {
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
}

.board-grid {
  height: 100%;
  display: flex;
  gap: 20px;
  align-items: flex-start;
  overflow-x: auto;
}
</style>
