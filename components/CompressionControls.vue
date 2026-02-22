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
  gap: 16px;
  background: var(--bg-secondary);
  padding: 16px;
  border: 1px solid var(--border-color);
}
.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.control-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 800;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.value-badge {
  background: var(--color-primary);
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 800;
  color: var(--bg-primary);
  font-family: var(--font-mono);
}
.slider {
  width: 100%;
  height: 8px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  outline: none;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 24px;
  background: var(--color-primary);
  cursor: pointer;
  border: 1px solid var(--bg-primary);
}
.format-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.format-option {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  background: var(--bg-primary);
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  transition: all 0.2s;
}
.format-option:has(input:checked) {
  border-color: var(--color-primary);
  background: var(--color-primary-bg);
}
.format-option input[type="radio"] {
  accent-color: var(--color-primary);
  width: 14px;
  height: 14px;
}
.format-label {
  font-size: 13px;
  font-weight: 700;
  font-family: var(--font-mono);
}
.resize-inputs {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  background: var(--bg-primary);
  padding: 12px;
  border: 1px solid var(--border-color);
}
.size-input {
  display: flex;
  align-items: center;
  gap: 6px;
}
.size-input label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
}
.size-input input {
  width: 80px;
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  font-size: 13px;
  background: var(--bg-secondary);
  color: var(--color-primary);
  font-family: var(--font-mono);
  font-weight: 700;
}
.size-input input:focus {
  border-color: var(--color-primary);
  outline: none;
}
.lock-ratio {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  cursor: pointer;
  text-transform: uppercase;
}
.lock-ratio input[type="checkbox"],
.control-label input[type="checkbox"] {
  accent-color: var(--color-primary);
  width: 14px;
  height: 14px;
}
</style>
