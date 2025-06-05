<script setup lang="ts">
const props = withDefaults(defineProps<{
  disabled?: boolean
  className?: string
}>(), {
  disabled: false,
  className: '',
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<template>
  <button
    type="button"
    :disabled="props.disabled"
    class="btn-action"
    :class="props.className"
    @click="handleClick">
    <slot name="icon" />
    <slot />
  </button>
</template>

<style scoped>
.btn-action {
  background: #ffffff;
  width: fit-content;
  border: 2px solid #e4e4e4;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  transition: 0.3s all;
}

.btn-action:hover {
  background: #e4e4e4;
  cursor: pointer;
}

.btn-action.add {
  width: 100%;
  background: #ced9e3;
  justify-content: center;
  border: none;
  border-radius: 8px;
  padding: 8px 0;
}

.btn-action.add:hover {
  background: #becbd7;
}

.btn-action:deep(.icon) {
  transition: transform 0.3s ease;
}

.btn-action:deep(.rotate) {
  transform: rotate(180deg);
}
</style>
