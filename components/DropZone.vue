<template>
  <div
    class="drop-zone"
    :class="{ 'drag-over': isDragOver, disabled }"
    @dragenter="handleDragEnter"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    @click="openFilePicker"
  >
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      :multiple="multiple"
      class="hidden-input"
      @change="onFileChange"
    />
    <div class="drop-content">
      <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <p class="drop-text">
        {{ isDragOver ? '释放以添加图片' : '拖拽图片到此处或点击选择' }}
      </p>
      <p class="drop-hint">支持 JPEG、PNG、WebP 格式</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDragDrop } from '@/composables/useDragDrop'

const props = withDefaults(
  defineProps<{
    accept?: string
    multiple?: boolean
    disabled?: boolean
  }>(),
  {
    accept: 'image/jpeg,image/png,image/webp',
    multiple: true,
    disabled: false,
  }
)

const emit = defineEmits<{
  'files-selected': [files: File[]]
}>()

const fileInput = ref<HTMLInputElement>()

const { isDragOver, handleDragEnter, handleDragOver, handleDragLeave, handleDrop } =
  useDragDrop((files) => {
    if (!props.disabled) emit('files-selected', files)
  })

function openFilePicker() {
  if (!props.disabled) fileInput.value?.click()
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files ?? []).filter((f) =>
    f.type.startsWith('image/')
  )
  if (files.length) emit('files-selected', files)
  input.value = ''
}
</script>

<style scoped>
.drop-zone {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 32px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--bg-primary);
}
.drop-zone:hover:not(.disabled) {
  border-color: var(--color-primary);
  background: var(--color-primary-bg);
}
.drop-zone.drag-over {
  border-color: var(--color-primary);
  background: var(--color-primary-bg);
  border-style: solid;
}
.drop-zone.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.hidden-input {
  display: none;
}
.drop-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.upload-icon {
  width: 36px;
  height: 36px;
  color: var(--color-primary);
}
.drop-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
}
.drop-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
}
</style>
