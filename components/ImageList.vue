<template>
  <div class="image-list">
    <div class="list-scroll">
      <ImageCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        :selected="item.id === selectedId"
        @select="$emit('select', $event)"
        @remove="$emit('remove', $event)"
        @download="$emit('download', $event)"
      />
    </div>
    <button class="add-more-btn" @click="$emit('add-more')">
      + 添加更多图片
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ImageItem } from '@/types'
import ImageCard from './ImageCard.vue'

defineProps<{
  items: ImageItem[]
  selectedId: string | null
}>()

defineEmits<{
  select: [id: string]
  remove: [id: string]
  download: [id: string]
  'add-more': []
}>()
</script>

<style scoped>
.image-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.list-scroll {
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-right: 4px;
}
.add-more-btn {
  padding: 10px;
  border: 1px dashed var(--border-color);
  background: var(--bg-secondary);
  font-size: 12px;
  font-weight: 800;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.add-more-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-bg);
}
</style>
