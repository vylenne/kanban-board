<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Column as ColumnType } from '@/types'

import { useBoardStore } from '@/stores/board'

import { getTimeAgo, detectSortOrder } from '@/shared'

import Card from './Card.vue'
import Button from './ui/Button.vue'
import { IconClear, IconSort, IconAdd, IconPause, IconPlay, IconCancel } from '@/components/icons'

const props = defineProps<{
  column: ColumnType
}>()

const emit = defineEmits<{
  (e: 'delete-column'): void
}>()

let timer: number

const board = useBoardStore()
const nameEl = ref<HTMLElement | null>(null)
const lastEditTime = ref('')
const sortOrder = ref(true)
const hasSorted = ref(false)

const isLocked = computed(() => props.column.isLocked)

const sortLabel = computed(() => {
  return sortOrder.value ? 'Ascending' : 'Descending'
})

const addCard = () => {
  board.addCard(props.column.id)
  updateLastEditText()
}

const updateName = () => {
  if (!nameEl.value) return

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

const updateLastEditText = () => {
  if (!lastUpdatedAt.value) {
    lastEditTime.value = ''
    return
  }
  lastEditTime.value = getTimeAgo(new Date(lastUpdatedAt.value).toISOString())
}

const sortCards = () => {
  const direction = sortOrder.value ? 1 : -1
  props.column.cards.sort((a, b) => a.title.localeCompare(b.title) * direction)
  sortOrder.value = !sortOrder.value
  hasSorted.value = true
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

  const { isSorted, ascending } = detectSortOrder(props.column.cards)
  if (isSorted) {
    hasSorted.value = true
    sortOrder.value = ascending
  }
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="column" @dragover.prevent @drop="onDrop">
    <div>
      <div class="column-header">
        <div class="wrap">
          <p ref="nameEl" class="header" :contenteditable="!isLocked"
            @keydown.enter.prevent="updateName" @blur="updateName">
            {{ column.name }}
          </p>
          <span class="count">{{ props.column.cards.length }}</span>
        </div>

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

    <div class="column-actions">
      <Button @click="sortCards" :disabled="isLocked">
        <template #icon>
          <IconSort class="sort" :class="{ rotate: sortOrder }" />
        </template>
        Sort <span v-if="hasSorted && props.column.cards.length > 1">{{ sortLabel }}</span>
      </Button>
      <Button @click="board.clearColumnCards(props.column.id)" :disabled="isLocked">
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
  background: #eceff2;
  border-radius: 12px;
  padding: 16px;
  min-width: 250px;
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

.column-header .wrap {
  display: flex;
  font-size: 13px;
  font-weight: 600;
}

.header {
  color: #a9a9a9;
  text-transform: uppercase;
}

.header[contenteditable='true']:focus {
  outline: none;
}

.count {
  margin-left: 8px;
  color: #3f3f3f;
}

.column-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
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
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  margin-top: 16px;
  color: rgba(0, 0, 0, 0.15);
}
</style>
