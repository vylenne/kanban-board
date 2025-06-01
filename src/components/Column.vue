<script setup lang="ts">
import { ref } from 'vue'
import type { Column as ColumnType } from '@/types/types'
import { useBoardStore } from '@/stores/board'

import Card from './Card.vue'
import IconClear from './icons/IconClear.vue'
import IconSort from './icons/IconSort.vue'
import IconAdd from './icons/IconAdd.vue'
import IconPause from './icons/IconPause.vue'
import IconPlay from './icons/IconPlay.vue'
import IconCancel from './icons/IconCancel.vue'

const props = defineProps<{
  column: ColumnType
  editingEnabled: boolean
}>()

const emit = defineEmits<{
  (e: 'delete-column'): void
}>()

const board = useBoardStore()
const nameEl = ref<HTMLElement | null>(null)

const { toggleEditing } = board

const updateName = () => {
  if (!props.editingEnabled || !nameEl.value) return

  const text = nameEl.value.innerText.trim()
  if (text && text !== props.column.name) {
    props.column.name = text
  }
  nameEl.value.blur()
}

const addCard = () => {
  board.addCard(props.column.id)
}

const sortCards = () => {
  props.column.cards.sort((a, b) => a.title.localeCompare(b.title))
}

const clearAll = () => {
  props.column.cards.length = 0
}

const deleteThisColumn = () => {
  emit('delete-column')
}
</script>

<template>
  <div class="column" :class="{ disabled: !editingEnabled }">
    <div class="column-header" @keydown.enter.prevent="updateName" @blur="updateName" ref="nameEl">
      <p class="header" contenteditable="true">{{ column.name }}</p>
      <div class="column-actions">
        <button v-if="editingEnabled" class="btn-action" @click="toggleEditing">
          <IconPause />
          Disable Editing
        </button>
        <button v-else class="btn-action" @click="toggleEditing">
          <IconPlay />
          Unlock Column
        </button>
        <button class="btn-action" @click="deleteThisColumn">
          <IconCancel />
          Delete Column
        </button>
      </div>
    </div>

    <div class="card-list">
      <Card v-for="card in column.cards" :key="card.id" :card="card" :column-id="column.id" />
    </div>

    <button class="btn-action add" @click="addCard">
      <IconAdd />
      New Card
    </button>

    <div class="column-actions bottom">
      <button class="btn-action" @click="sortCards">
        <IconSort />
        Sort
      </button>
      <button class="btn-action" @click="clearAll">
        <IconClear />
        Clear All
      </button>
    </div>
  </div>
</template>

<style scoped>
.column {
  background: #f6f8fa;
  border-radius: 8px;
  padding: 16px;
  min-width: 250px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}

.column.disabled {
  pointer-events: none;
  opacity: 0.6;
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding-bottom: 8px;
  outline: none;
}

.header {
  font-size: 13px;
  font-weight: 600;
  color: #a9a9a9;
  text-transform: uppercase;
}

.column-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.column-actions.bottom {
  padding-top: 8px;
}

.card-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
}
</style>
