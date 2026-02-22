<template>
  <div class="compression-controls">
    <!-- 质量滑块 -->
    <div v-if="modelValue.mode === 'canvas'" class="control-group">
      <label class="control-label">
        质量
        <span class="value-badge">{{ modelValue.quality }}%</span>
      </label>
      <input
        type="range"
        min="1"
        max="100"
        :value="modelValue.quality"
        @input="updateField('quality', Number(($event.target as HTMLInputElement).value))"
        class="slider"
      />
    </div>

    <!-- 输出格式 -->
    <div class="control-group">
      <label class="control-label">输出格式</label>
      <div class="format-options">
        <label v-for="fmt in formats" :key="fmt.value" class="format-option">
          <input
            type="radio"
            :value="fmt.value"
            :checked="modelValue.outputFormat === fmt.value"
            @change="updateField('outputFormat', fmt.value)"
          />
          <span class="format-label">{{ fmt.label }}</span>
        </label>
      </div>
    </div>

    <!-- 尺寸调整 -->
    <div class="control-group">
      <label class="control-label">
        <input
          type="checkbox"
          :checked="modelValue.resize.enabled"
          @change="updateResize('enabled', ($event.target as HTMLInputElement).checked)"
        />
        调整尺寸
      </label>
      <div v-if="modelValue.resize.enabled" class="resize-inputs">
        <div class="size-input">
          <label>宽</label>
          <input
            type="number"
            min="1"
            :value="modelValue.resize.width"
            @input="updateResize('width', Number(($event.target as HTMLInputElement).value) || undefined)"
            placeholder="自动"
          />
        </div>
        <div class="size-input">
          <label>高</label>
          <input
            type="number"
            min="1"
            :value="modelValue.resize.height"
            @input="updateResize('height', Number(($event.target as HTMLInputElement).value) || undefined)"
            placeholder="自动"
          />
        </div>
        <label class="lock-ratio">
          <input
            type="checkbox"
            :checked="modelValue.resize.proportional"
            @change="updateResize('proportional', ($event.target as HTMLInputElement).checked)"
          />
          锁定比例
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CompressionOptions, OutputFormat, ResizeOptions } from '@/types'

const props = defineProps<{
  modelValue: CompressionOptions
}>()

const emit = defineEmits<{
  'update:modelValue': [options: CompressionOptions]
}>()

const formats = [
  { value: 'original' as OutputFormat, label: '原格式' },
  { value: 'jpeg' as OutputFormat, label: 'JPEG' },
  { value: 'png' as OutputFormat, label: 'PNG' },
  { value: 'webp' as OutputFormat, label: 'WebP' },
]

function updateField<K extends keyof CompressionOptions>(
  key: K,
  value: CompressionOptions[K]
) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

function updateResize<K extends keyof ResizeOptions>(
  key: K,
  value: ResizeOptions[K]
) {
  emit('update:modelValue', {
    ...props.modelValue,
    resize: { ...props.modelValue.resize, [key]: value },
  })
}
</script>

<style scoped>
.compression-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.control-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.control-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}
.value-badge {
  background: var(--bg-secondary);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary);
}
.slider {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--bg-secondary);
  border-radius: 2px;
  outline: none;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
}
.format-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.format-option {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}
.format-option input[type="radio"] {
  accent-color: var(--color-primary);
}
.format-label {
  font-size: 13px;
}
.resize-inputs {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
.size-input {
  display: flex;
  align-items: center;
  gap: 4px;
}
.size-input label {
  font-size: 12px;
  color: var(--text-secondary);
}
.size-input input {
  width: 70px;
  padding: 4px 6px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 13px;
  background: var(--bg-primary);
  color: var(--text-primary);
}
.lock-ratio {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
}
</style>
