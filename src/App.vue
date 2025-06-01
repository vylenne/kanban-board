<script setup lang="ts">
import Board from './components/Board.vue'
</script>

<template>
  <main class="board">
    <Board />
  </main>
</template>

<style scoped>
.board {
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
}
</style>
