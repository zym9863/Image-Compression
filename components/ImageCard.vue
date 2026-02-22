<template>
  <div class="image-card" :class="{ selected }" @click="$emit('select', item.id)">
    <div class="card-thumb">
      <img
        v-if="item.compressedDataUrl || item.originalDataUrl"
        :src="item.compressedDataUrl || item.originalDataUrl"
        :alt="item.name"
      />
      <div v-else class="thumb-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
      <div v-if="item.status === 'compressing'" class="status-overlay">
        <div class="spinner"></div>
      </div>
    </div>
    <div class="card-info">
      <p class="card-name" :title="item.name">{{ item.name }}</p>
      <SizeStats
        :original-size="item.originalSize"
        :compressed-size="item.compressedSize"
      />
      <div v-if="item.status === 'error'" class="card-error" :title="item.error">
        {{ item.error }}
      </div>
    </div>
    <div class="card-actions">
      <button
        v-if="item.status === 'done'"
        class="action-btn download-btn"
        title="下载"
        @click.stop="$emit('download', item.id)"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </button>
      <button
        class="action-btn remove-btn"
        title="移除"
        @click.stop="$emit('remove', item.id)"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ImageItem } from '@/types'
import SizeStats from './SizeStats.vue'

defineProps<{
  item: ImageItem
  selected: boolean
}>()

defineEmits<{
  select: [id: string]
  remove: [id: string]
  download: [id: string]
}>()
</script>

<style scoped>
.image-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  position: relative;
}
.image-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: transparent;
  transition: background 0.2s;
}
.image-card:hover {
  background: var(--bg-secondary);
  border-color: var(--text-secondary);
}
.image-card.selected {
  border-color: var(--color-primary);
  background: var(--color-primary-bg);
}
.image-card.selected::before {
  background: var(--color-primary);
}
.card-thumb {
  position: relative;
  width: 48px;
  height: 48px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}
.card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.2) contrast(1.1);
}
.image-card:hover .card-thumb img,
.image-card.selected .card-thumb img {
  filter: grayscale(0) contrast(1);
}
.thumb-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}
.status-overlay {
  position: absolute;
  inset: 0;
  background: rgba(9, 9, 11, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.card-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.card-name {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-mono);
}
.card-error {
  font-size: 11px;
  color: var(--color-error);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-mono);
  background: rgba(255, 51, 51, 0.1);
  padding: 2px 4px;
  border: 1px solid var(--color-error);
  display: inline-block;
  width: fit-content;
}
.card-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.action-btn {
  padding: 6px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.action-btn:hover {
  background: var(--bg-secondary);
  border-color: var(--text-primary);
  color: var(--text-primary);
}
.download-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: var(--color-primary-bg);
}
.remove-btn:hover {
  color: var(--color-error);
  border-color: var(--color-error);
  background: rgba(255, 51, 51, 0.1);
}
</style>
