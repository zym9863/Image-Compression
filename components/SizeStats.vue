<template>
  <span class="size-stats">
    <span class="original">{{ formatBytes(originalSize) }}</span>
    <template v-if="compressedSize !== undefined">
      <span class="arrow">&rarr;</span>
      <span class="compressed">{{ formatBytes(compressedSize) }}</span>
      <span v-if="showRatio" class="ratio" :class="ratioClass">
        ({{ ratioText }})
      </span>
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatBytes } from '@/utils/imageUtils'

const props = withDefaults(
  defineProps<{
    originalSize: number
    compressedSize?: number
    showRatio?: boolean
  }>(),
  { showRatio: true }
)

const ratio = computed(() => {
  if (props.compressedSize === undefined) return 0
  return (props.originalSize - props.compressedSize) / props.originalSize
})

const ratioText = computed(() => {
  const pct = Math.round(ratio.value * 100)
  return pct >= 0 ? `-${pct}%` : `+${Math.abs(pct)}%`
})

const ratioClass = computed(() => (ratio.value >= 0 ? 'savings' : 'increase'))
</script>

<style scoped>
.size-stats {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  background: var(--bg-secondary);
  padding: 2px 6px;
  border: 1px solid var(--border-color);
  width: fit-content;
}
.arrow {
  color: var(--text-muted);
  font-weight: 800;
}
.compressed {
  font-weight: 700;
  color: var(--text-primary);
}
.ratio {
  font-weight: 700;
  padding: 0 4px;
}
.ratio.savings {
  color: var(--bg-primary);
  background: var(--color-success);
}
.ratio.increase {
  color: var(--bg-primary);
  background: var(--color-error);
}
</style>
