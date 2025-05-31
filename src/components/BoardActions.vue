<script setup>
import IconAdd from '@/components/icons/IconAdd.vue'
import IconShuffle from '@/components/icons/IconShuffle.vue'
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
      {{ editingEnabled ? 'Disable Editing' : 'Enable Editing' }}
    </button>
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 24px 0;
}

.btn-action {
  background: #ffffff;
  border: 2px solid #e4e4e4;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: 13px;
  font-weight: 600;
}

.btn-action:hover {
  background: #e4e4e4;
  cursor: pointer;
}
</style>
