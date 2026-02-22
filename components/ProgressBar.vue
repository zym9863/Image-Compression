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
  gap: 8px;
  background: var(--bg-secondary);
  padding: 12px;
  border: 1px solid var(--border-color);
}
.bar-track {
  width: 100%;
  height: 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  overflow: hidden;
  position: relative;
}
.bar-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.3s ease;
  position: relative;
}
.bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(0, 0, 0, 0.1) 10px,
    rgba(0, 0, 0, 0.1) 20px
  );
}
.bar-fill.has-error {
  background: var(--color-warning);
}
.progress-text {
  font-size: 12px;
  font-weight: 800;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  justify-content: space-between;
}
.failed-text {
  color: var(--color-error);
}
</style>
