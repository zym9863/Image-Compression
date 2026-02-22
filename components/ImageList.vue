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
  gap: 4px;
}
.list-scroll {
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.list-scroll::-webkit-scrollbar {
  width: 4px;
}
.list-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.list-scroll::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 2px;
}
.add-more-btn {
  padding: 8px;
  border: 1px dashed var(--border-color);
  background: transparent;
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}
.add-more-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
</style>
