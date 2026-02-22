<template>
  <div class="mode-toggle">
    <button
      class="toggle-btn"
      :class="{ active: modelValue === 'canvas' }"
      @click="$emit('update:modelValue', 'canvas')"
    >
      本地压缩
    </button>
    <button
      class="toggle-btn"
      :class="{ active: modelValue === 'tinypng' }"
      @click="$emit('update:modelValue', 'tinypng')"
    >
      TinyPNG
    </button>
  </div>
  <div v-if="modelValue === 'tinypng' && !tinyPngConfigured" class="warning">
    请先在设置中配置 TinyPNG API Key
  </div>
</template>

<script setup lang="ts">
import type { CompressionMode } from '@/types'

defineProps<{
  modelValue: CompressionMode
  tinyPngConfigured: boolean
}>()

defineEmits<{
  'update:modelValue': [mode: CompressionMode]
}>()
</script>

<style scoped>
.mode-toggle {
  display: flex;
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 2px;
  gap: 2px;
}
.toggle-btn {
  flex: 1;
  padding: 6px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}
.toggle-btn.active {
  background: var(--color-primary);
  color: white;
  font-weight: 600;
}
.toggle-btn:hover:not(.active) {
  background: var(--bg-hover);
}
.warning {
  margin-top: 4px;
  padding: 6px 10px;
  font-size: 12px;
  color: var(--color-warning);
  background: var(--color-warning-bg);
  border-radius: 6px;
}
</style>
