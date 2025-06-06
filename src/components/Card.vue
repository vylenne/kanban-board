<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import type { Card } from '@/types'
import { useBoardStore } from '@/stores/board'

import { IconCancel, IconSave, IconDragDrop } from '@/components/icons'
import Button from './ui/Button.vue'

const props = defineProps<{
  card: Card
  columnId: string
}>()

const board = useBoardStore()
const { updateCard, deleteCard: removeCard } = board

const isEditing = ref(false)

const cardEl = ref<HTMLElement | null>(null)
const titleEl = ref<HTMLElement | null>(null)
const descEl = ref<HTMLElement | null>(null)

const titleDraft = ref(props.card.title)
const descDraft = ref(props.card.description)

const original = ref({ title: '', description: '' })

const onInput = () => {
  titleDraft.value = titleEl.value?.innerText || ''
  descDraft.value = descEl.value?.innerText || ''
}

const enableEditing = async () => {
  isEditing.value = true
  original.value = {
    title: props.card.title,
    description: props.card.description,
  }
  titleDraft.value = props.card.title
  descDraft.value = props.card.description

  await nextTick()
  titleEl.value?.focus()
}

const hasChanges = computed(() => {
  return (
    titleDraft.value.trim() !== original.value.title.trim() ||
    descDraft.value.trim() !== original.value.description.trim()
  )
})

const saveChanges = () => {
  if (!hasChanges.value) return

  updateCard(props.columnId, props.card.id, {
    title: titleDraft.value.trim(),
    description: descDraft.value.trim(),
  })

  isEditing.value = false
}

const onEnter = (e: KeyboardEvent) => {
  if (!e.shiftKey && hasChanges.value) {
    e.preventDefault()
    saveChanges()
  }
}

const cancelChanges = () => {
  isEditing.value = false
}

const deleteCard = () => {
  removeCard(props.columnId, props.card.id)
}

const onDragStart = (event: DragEvent) => {
  event.dataTransfer?.setData('text/plain', JSON.stringify({
    cardId: props.card.id,
    fromColumnId: props.columnId,
  }))

  if (cardEl.value) {
    event.dataTransfer?.setDragImage(cardEl.value, 0, 0)
  }
}

onMounted(async () => {
  if (!props.card.title.trim()) {
    await enableEditing()
  }
})
</script>

<template>
  <div class="card" ref="cardEl" :class="{ editing: isEditing }" @contextmenu.prevent="deleteCard"
    @dblclick="enableEditing">
    <div class="card-icon" draggable="true" @dragstart="onDragStart">
      <IconDragDrop />
    </div>
    <div v-if="!isEditing">
      <h4 class="card-title">{{ card.title || '' }}</h4>
      <p class="card-description">{{ card.description || 'Add description' }}</p>
    </div>

    <div v-else>
      <input class="editable-input" v-model="titleDraft" placeholder="Title"
        @keydown.enter.prevent="onEnter" ref="titleEl" />

      <textarea class="editable-textarea" v-model="descDraft" placeholder="Add description"
        @keydown.enter.prevent="onEnter" ref="descEl" rows="2" />

      <div class="card-actions">
        <Button class="btn-action" :disabled="!hasChanges" @click="saveChanges">
          <template #icon>
            <IconSave />
          </template>
          Save Changes
        </Button>
        <Button class="btn-action" @click="cancelChanges">
          <template #icon>
            <IconCancel />
          </template>
          Cancel
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  border: 2px solid #ffffff;
  position: relative;
  max-width: 420px;
  word-wrap: break-word;
}

.card-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: grab;
}

.card.editing {
  border-color: #007Aff;
}

.card-title {
  font-size: 14px;
  line-height: 140%;
  font-weight: 600;
  font-family: Inter, sans-serif;
}

.card-description {
  font-size: 14px;
  line-height: 140%;
  font-weight: 600;
  font-family: Inter, sans-serif;
  color: #00000070;
  margin-top: 8px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: calc(1.4em * 2);
}

.editable-input,
.editable-textarea {
  border-radius: 4px;
  padding: 4px;
  font-family: Inter;
  font-size: 14px;
  margin-bottom: 4px;
  outline: none;
  border: none;
  display: flex;
  width: 100%;
}

.editable-input {
  font-weight: 600;
}

.editable-textarea {
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
</style>
