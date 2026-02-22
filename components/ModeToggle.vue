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
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  padding: 4px;
  gap: 4px;
}
.toggle-btn {
  flex: 1;
  padding: 8px 16px;
  border: 1px solid transparent;
  background: transparent;
  font-size: 13px;
  font-weight: 800;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.toggle-btn.active {
  background: var(--color-primary);
  color: var(--bg-primary);
  border-color: var(--color-primary);
}
.toggle-btn:hover:not(.active) {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
}
.warning {
  margin-top: 8px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-warning);
  background: var(--color-warning-bg);
  border: 1px solid var(--color-warning);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
