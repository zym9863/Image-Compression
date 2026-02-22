<template>
  <div class="preview-panel">
    <template v-if="item">
      <div class="preview-container" ref="containerRef">
        <img
          v-if="item.originalDataUrl"
          :src="item.originalDataUrl"
          class="preview-img original"
          alt="原图"
        />
        <div
          v-if="item.compressedDataUrl"
          class="preview-compressed"
          :style="{ clipPath: `inset(0 0 0 ${sliderPos}%)` }"
        >
          <img
            :src="item.compressedDataUrl"
            class="preview-img"
            alt="压缩后"
          />
        </div>
        <div
          v-if="item.compressedDataUrl"
          class="slider-line"
          :style="{ left: `${sliderPos}%` }"
          @mousedown="startDrag"
        >
          <div class="slider-handle">
            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
              <path d="M8 5l-5 7 5 7M16 5l5 7-5 7" />
            </svg>
          </div>
        </div>
        <div class="preview-labels">
          <span class="label-original">原图</span>
          <span v-if="item.compressedDataUrl" class="label-compressed">压缩后</span>
        </div>
      </div>
    </template>
    <div v-else class="preview-empty">
      选择图片以预览
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ImageItem } from '@/types'

defineProps<{
  item: ImageItem | null
}>()

const sliderPos = ref(50)
const containerRef = ref<HTMLDivElement>()

function startDrag(e: MouseEvent) {
  e.preventDefault()
  const onMove = (ev: MouseEvent) => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    const x = ev.clientX - rect.left
    sliderPos.value = Math.max(0, Math.min(100, (x / rect.width) * 100))
  }
  const onUp = () => {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}
</script>

<style scoped>
.preview-panel {
  border: 1px solid var(--border-color);
  overflow: hidden;
  background: var(--bg-secondary);
  position: relative;
}
.preview-panel::before {
  content: 'PREVIEW';
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 10px;
  font-weight: 800;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  z-index: 10;
  pointer-events: none;
}
.preview-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: repeating-conic-gradient(
    var(--bg-primary) 0%,
    var(--bg-primary) 25%,
    var(--bg-secondary) 0%,
    var(--bg-secondary) 50%
  );
  background-size: 20px 20px;
}
.preview-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
.preview-compressed {
  position: absolute;
  inset: 0;
}
.slider-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--color-primary);
  cursor: ew-resize;
  transform: translateX(-50%);
  z-index: 2;
}
.slider-handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bg-primary);
  border: 2px solid var(--bg-primary);
}
.preview-labels {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  z-index: 3;
}
.label-original,
.label-compressed {
  font-size: 10px;
  font-weight: 800;
  padding: 4px 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.preview-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 160px;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
</style>
