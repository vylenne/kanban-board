<script setup lang="ts">
import { computed } from 'vue'
import { useBoardStore } from '@/stores/board'
import Column from './Column.vue'
import BoardActions from './BoardActions.vue'

const board = useBoardStore()
const columns = computed(() => board.columns)
</script>

<template>
  <div>
    <div class="board-grid">
      <Column
        v-for="column in columns" :key="column.id"
        :column="column"
        :editing-enabled="board.editingEnabled"
        @delete-column="board.deleteColumn(column.id)" />
    </div>
    <BoardActions />
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
