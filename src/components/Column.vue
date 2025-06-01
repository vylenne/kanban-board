<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Column as ColumnType } from '@/types/types'
import { useBoardStore } from '@/stores/board'

import Card from './Card.vue'
import Button from './ui/Button.vue'
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
const sortOrder = ref(true)

const isLocked = computed(() => props.column.isLocked)

const updateName = () => {
  if (!props.editingEnabled || !nameEl.value) return

  const text = nameEl.value.innerText.trim()
  if (text && text !== props.column.name) {
    board.updateColumn(props.column.id, {
      ...props.column,
      name: text,
    })
  }
  nameEl.value.blur()
}

const sortCards = () => {
  const direction = sortOrder.value ? 1 : -1
  props.column.cards.sort((a, b) => a.title.localeCompare(b.title) * direction)
  sortOrder.value = !sortOrder.value
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  const data = event.dataTransfer?.getData('text/plain')
  if (!data) return
  const { cardId, fromColumnId } = JSON.parse(data)
  if (fromColumnId === props.column.id) return

  board.moveCard(fromColumnId, props.column.id, cardId)
}
</script>

<template>
  <div class="column" @dragover.prevent @drop="onDrop" :disabled="!props.editingEnabled">
    <div class="column-header">
      <p ref="nameEl" class="header" :contenteditable="props.editingEnabled && !isLocked"
        @keydown.enter.prevent="updateName" @blur="updateName">
        {{ column.name }}
      </p>
      <span class="count">{{ props.column.cards.length }}</span>
      <div class="column-actions">
        <Button @click="board.toggleColumnLock(props.column.id)">
          <template #icon>
            <IconPlay v-if="isLocked" />
            <IconPause v-else />
          </template>
          {{ isLocked ? 'Unlock Column' : 'Disable Editing' }}
        </Button>

        <Button :class="{ disabled: isLocked }" :disabled="isLocked" @click="emit('delete-column')">
          <template #icon>
            <IconCancel />
          </template>
          Delete Column
        </Button>
      </div>
    </div>

    <div class="card-list" :class="{ disabled: isLocked }">
      <Card v-for="card in column.cards" :key="card.id" :card="card" :column-id="column.id" />
    </div>

    <Button extraClass="add" @click="board.addCard(props.column.id)" :disabled="isLocked"
      :class="{ disabled: isLocked }">
      <template #icon>
        <IconAdd />
      </template>
      New Card
    </Button>

    <div class="column-actions bottom" :disabled="isLocked">
      <Button @click="sortCards" :class="{ disabled: isLocked }">
        <template #icon>
          <IconSort class="icon" :class="{ rotate: sortOrder }" />
        </template>
        Sort
      </Button>
      <Button @click="board.clearColumnCards(props.column.id)" :class="{ disabled: isLocked }">
        <template #icon>
          <IconClear />
        </template>
        Clear All
      </Button>
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

.disabled {
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

.header[contenteditable='true']:focus {
  outline: 1px dashed #aaa;
  padding: 2px;
  background: #fff;
}

.count {
  font-weight: 700;
  margin-left: 4px;
  color: #3f3f3f;
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
