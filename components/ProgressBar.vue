<template>
  <div v-if="total > 0" class="progress-bar">
    <div class="bar-track">
      <div
        class="bar-fill"
        :style="{ width: `${percentage}%` }"
        :class="{ 'has-error': failed > 0 }"
      ></div>
    </div>
    <span class="progress-text">
      {{ completed }} / {{ total }} 已完成
      <span v-if="failed > 0" class="failed-text">({{ failed }} 失败)</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  total: number
  completed: number
  failed: number
}>()

const percentage = computed(() =>
  props.total > 0 ? Math.round(((props.completed + props.failed) / props.total) * 100) : 0
)
</script>

<style scoped>
.progress-bar {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.bar-track {
  width: 100%;
  height: 6px;
  background: var(--bg-secondary);
  border-radius: 3px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
  transition: width 0.3s ease;
}
.bar-fill.has-error {
  background: var(--color-warning);
}
.progress-text {
  font-size: 12px;
  color: var(--text-secondary);
}
.failed-text {
  color: var(--color-error);
}
</style>
