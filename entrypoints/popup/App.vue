<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useCompression } from '@/composables/useCompression'
import { downloadBlob, downloadAllAsZip } from '@/composables/useFileDownload'
import { useSettings } from '@/composables/useSettings'
import { pendingImageStorage } from '@/utils/storage'
import { getFilenameFromUrl, getFilenameWithNewExt } from '@/utils/imageUtils'
import DropZone from '@/components/DropZone.vue'
import ImageList from '@/components/ImageList.vue'
import ModeToggle from '@/components/ModeToggle.vue'
import CompressionControls from '@/components/CompressionControls.vue'
import PreviewPanel from '@/components/PreviewPanel.vue'
import ProgressBar from '@/components/ProgressBar.vue'

const {
  items,
  selectedId,
  selectedItem,
  options,
  stats,
  isProcessing,
  settings,
  init,
  addFiles,
  addFromUrl,
  compressAll,
  removeItem,
  clearAll,
} = useCompression()

const { save } = useSettings()

const activeTab = ref<'compress' | 'settings'>('compress')
const showDropZone = ref(true)

// 设置页面状态
const tempApiKey = ref('')
const settingsSaved = ref(false)

onMounted(async () => {
  await init()
  tempApiKey.value = settings.value.tinyPngApiKey

  // 检查右键菜单待处理图片
  const pending = await pendingImageStorage.getValue()
  if (pending) {
    await pendingImageStorage.setValue(null)
    const name = getFilenameFromUrl(pending.srcUrl)
    if (pending.dataUrl && pending.size) {
      addFromUrl(pending.srcUrl, name, pending.size, pending.dataUrl)
    }
    showDropZone.value = false
  }
})

function onFilesSelected(files: File[]) {
  addFiles(files)
  showDropZone.value = false
}

function handleAddMore() {
  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = true
  input.accept = 'image/jpeg,image/png,image/webp'
  input.onchange = () => {
    const files = Array.from(input.files ?? []).filter((f) =>
      f.type.startsWith('image/')
    )
    if (files.length) addFiles(files)
  }
  input.click()
}

function handleDownload(id: string) {
  const item = items.value.find((i) => i.id === id)
  if (!item?.compressedBlob) return
  const filename = getFilenameWithNewExt(item.name, item.compressedBlob.type)
  downloadBlob(item.compressedBlob, filename)
}

function handleDownloadAll() {
  downloadAllAsZip(items.value)
}

function handleRemove(id: string) {
  removeItem(id)
  if (items.value.length === 0) showDropZone.value = true
}

function handleClear() {
  clearAll()
  showDropZone.value = true
}

async function saveSettings() {
  await save({ tinyPngApiKey: tempApiKey.value })
  settingsSaved.value = true
  setTimeout(() => (settingsSaved.value = false), 2000)
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1 class="title">Image Compressor</h1>
      <div class="tab-pills">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'compress' }"
          @click="activeTab = 'compress'"
        >
          压缩
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'settings' }"
          @click="activeTab = 'settings'"
        >
          设置
        </button>
      </div>
    </header>

    <!-- 压缩页 -->
    <main v-if="activeTab === 'compress'" class="content">
      <ModeToggle
        v-model="options.mode"
        :tiny-png-configured="!!settings.tinyPngApiKey"
      />

      <DropZone
        v-if="showDropZone && items.length === 0"
        @files-selected="onFilesSelected"
      />

      <ImageList
        v-if="items.length > 0"
        :items="items"
        :selected-id="selectedId"
        @select="selectedId = $event"
        @remove="handleRemove"
        @download="handleDownload"
        @add-more="handleAddMore"
      />

      <CompressionControls
        v-if="items.length > 0"
        v-model="options"
      />

      <PreviewPanel
        v-if="selectedItem && (selectedItem.originalDataUrl || selectedItem.compressedDataUrl)"
        :item="selectedItem"
      />

      <ProgressBar
        v-if="isProcessing"
        :total="stats.total"
        :completed="stats.completed"
        :failed="stats.failed"
      />

      <div v-if="items.length > 0" class="actions">
        <button
          class="btn btn-primary"
          :disabled="isProcessing || stats.pending === 0"
          @click="compressAll"
        >
          {{ isProcessing ? '压缩中...' : '压缩全部' }}
        </button>
        <button
          v-if="stats.completed > 1"
          class="btn btn-secondary"
          @click="handleDownloadAll"
        >
          下载全部 (ZIP)
        </button>
        <button
          class="btn btn-ghost"
          :disabled="isProcessing"
          @click="handleClear"
        >
          清空
        </button>
      </div>
    </main>

    <!-- 设置页 -->
    <main v-else class="content">
      <div class="settings-section">
        <h3 class="section-title">TinyPNG API Key</h3>
        <p class="section-desc">
          在 <a href="https://tinypng.com/developers" target="_blank">tinypng.com</a> 获取免费 API Key
        </p>
        <div class="api-key-input">
          <input
            type="password"
            v-model="tempApiKey"
            placeholder="输入 API Key..."
            class="input"
          />
        </div>
        <div class="settings-actions">
          <button class="btn btn-primary" @click="saveSettings">保存</button>
          <span v-if="settingsSaved" class="saved-hint">已保存</span>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 480px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}
.title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}
.tab-pills {
  display: flex;
  gap: 2px;
  background: var(--bg-secondary);
  border-radius: 6px;
  padding: 2px;
}
.tab-btn {
  padding: 4px 12px;
  border: none;
  background: transparent;
  border-radius: 4px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}
.tab-btn.active {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.content {
  flex: 1;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}
.actions {
  display: flex;
  gap: 8px;
  padding-top: 4px;
}
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-primary {
  background: var(--color-primary);
  color: white;
  flex: 1;
}
.btn-primary:hover:not(:disabled) {
  filter: brightness(1.1);
}
.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
}
.btn-secondary:hover:not(:disabled) {
  background: var(--bg-hover);
}
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}
.btn-ghost:hover:not(:disabled) {
  background: var(--bg-secondary);
}
.settings-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}
.section-desc {
  font-size: 12px;
  color: var(--text-secondary);
}
.section-desc a {
  color: var(--color-primary);
  text-decoration: none;
}
.section-desc a:hover {
  text-decoration: underline;
}
.api-key-input {
  display: flex;
  gap: 8px;
}
.input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 13px;
  background: var(--bg-primary);
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.15s;
}
.input:focus {
  border-color: var(--color-primary);
}
.settings-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.saved-hint {
  font-size: 12px;
  color: var(--color-success);
}
</style>
