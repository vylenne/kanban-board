<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Column as ColumnType } from '@/types'

import { useBoardStore } from '@/stores/board'

import { getTimeAgo } from '@/shared'

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

const addCard = () => {
  board.addCard(props.column.id)
  updateLastEditText()
}

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

const lastUpdatedAt = computed(() => {
  const dates = props.column.cards.map(card => new Date(card.updatedAt).getTime())
  return dates.length ? Math.max(...dates) : 0
})

const lastEditTime = ref('')

const updateLastEditText = () => {
  if (!lastUpdatedAt.value) {
    lastEditTime.value = ''
    return
  }
  lastEditTime.value = getTimeAgo(new Date(lastUpdatedAt.value).toISOString())
}

let timer: number

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

onMounted(() => {
  updateLastEditText()
  timer = window.setInterval(updateLastEditText, 60 * 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="column" @dragover.prevent @drop="onDrop" :class="{ disabled: !props.editingEnabled }">
    <div>
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

          <Button :disabled="isLocked" @click="emit('delete-column')">
            <template #icon>
              <IconCancel />
            </template>
            Delete Column
          </Button>
        </div>
      </div>

      <div class="card-list">
        <Card v-for="card in column.cards" :key="card.id" :card="card" :column-id="column.id" />
      </div>

      <Button className="add" @click="addCard" :disabled="isLocked">
        <template #icon>
          <IconAdd />
        </template>
        New Card
      </Button>
      <p v-if="lastEditTime" class="last-edit">{{ lastEditTime }}</p>
    </div>

    <div class="column-actions" :disabled="isLocked">
      <Button @click="sortCards">
        <template #icon>
          <IconSort class="icon" :class="{ rotate: sortOrder }" />
        </template>
        Sort
      </Button>
      <Button @click="board.clearColumnCards(props.column.id)">
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
  justify-content: space-between;
  flex: 1;
  height: 100%;
}

.disabled {
  pointer-events: none;
  opacity: 0.5;
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
  padding-top: 8px;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.add {
  margin-top: 8px;
}

.last-edit {
  opacity: 0.15;
  text-align: center;
  font-size: 14px;
  margin-top: 16px;
}
</style>
