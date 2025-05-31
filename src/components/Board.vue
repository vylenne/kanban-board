<script setup lang="ts">
import Column from './Column.vue'
import { useBoardStore } from '@/stores/board'

const board = useBoardStore()
</script>

<template>
  <div class="board-grid">
    <Column />
  </div>
</template>

<style scoped>
.board-grid {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  overflow-x: auto;
}
</style>
