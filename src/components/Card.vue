<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import type { Card } from '@/types/types'
import { useBoardStore } from '@/stores/board'

import IconCancel from './icons/IconCancel.vue'
import IconSave from './icons/IconSave.vue'

const props = defineProps<{
  card: Card
  columnId: string
}>()

const board = useBoardStore()
const { updateCard, deleteCard: removeCard } = board
const { editingEnabled } = storeToRefs(board)

const isEditing = ref(false)

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
  if (!editingEnabled.value) return

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

const cancelChanges = () => {
  isEditing.value = false
}

const deleteCard = () => {
  removeCard(props.columnId, props.card.id)
}

onMounted(async () => {
  if (editingEnabled.value && props.card.title === '') {
    await nextTick()
    enableEditing()
  }
})
</script>

<template>
  <div class="card" :class="{ editing: isEditing }" @dblclick="enableEditing"
    @contextmenu.prevent="deleteCard">
    <div v-if="!isEditing">
      <h4 class="card-title">{{ card.title || '(no title)' }}</h4>
      <p class="card-description">{{ card.description || 'Add description' }}</p>
    </div>

    <div v-else>
      <div class="editable" contenteditable ref="titleEl" @input="onInput">
        {{ card.title || '' }}
      </div>

      <div class="editable" contenteditable ref="descEl" @input="onInput">
        {{ card.description || '' }}
      </div>

      <div class="card-actions">
        <button class="btn-action" :disabled="!hasChanges" @click="saveChanges">
          <IconSave />
          Save Changes
        </button>
        <button class="btn-action" @click="cancelChanges">
          <IconCancel />
          Cancel
        </button>
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
}

.card.editing {
  border-color: #007Aff;
}

.card-title {
  font-size: 13px;
  line-height: 140%;
  font-weight: 700;
  font-family: Inter, sans-serif;
}

.card-description {
  font-size: 13px;
  line-height: 140%;
  font-weight: 500;
  font-family: Inter, sans-serif;
  color: #00000070;
  margin-top: 8px;
}

.editable {
  border: 1px dashed #cccccc;
  border-radius: 4px;
  padding: 4px;
  font-size: 13px;
  margin-bottom: 4px;
  outline: none;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
</style>
