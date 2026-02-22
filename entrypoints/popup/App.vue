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
  min-height: 520px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 2px solid var(--border-color);
  background: var(--bg-secondary);
}
.title {
  font-size: 18px;
  font-weight: 800;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 8px;
}
.title::before {
  content: '';
  display: block;
  width: 12px;
  height: 12px;
  background: var(--color-primary);
  border-radius: 2px;
}
.tab-pills {
  display: flex;
  gap: 4px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  padding: 4px;
}
.tab-btn {
  padding: 6px 16px;
  border: 1px solid transparent;
  background: transparent;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn.active {
  background: var(--color-primary);
  color: var(--bg-primary);
  border-color: var(--color-primary);
}
.tab-btn:hover:not(.active) {
  color: var(--text-primary);
  border-color: var(--border-color);
}
.content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}
.actions {
  display: flex;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px dashed var(--border-color);
  margin-top: auto;
}
.btn {
  padding: 12px 20px;
  border: 1px solid var(--border-color);
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(1);
}
.btn-primary {
  background: var(--color-primary);
  color: var(--bg-primary);
  border-color: var(--color-primary);
  flex: 1;
  box-shadow: 4px 4px 0 var(--border-color);
}
.btn-primary:hover:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--border-color);
}
.btn-primary:active:not(:disabled) {
  transform: translate(4px, 4px);
  box-shadow: none;
}
.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  box-shadow: 4px 4px 0 var(--border-color);
}
.btn-secondary:hover:not(:disabled) {
  background: var(--bg-hover);
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--border-color);
}
.btn-secondary:active:not(:disabled) {
  transform: translate(4px, 4px);
  box-shadow: none;
}
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border-style: dashed;
}
.btn-ghost:hover:not(:disabled) {
  color: var(--text-primary);
  border-style: solid;
}
.settings-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--bg-secondary);
  padding: 20px;
  border: 1px solid var(--border-color);
}
.section-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--text-primary);
  text-transform: uppercase;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 8px;
}
.section-desc {
  font-size: 13px;
  color: var(--text-secondary);
  font-family: var(--font-mono);
}
.section-desc a {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px solid var(--color-primary);
}
.section-desc a:hover {
  background: var(--color-primary);
  color: var(--bg-primary);
}
.api-key-input {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  font-size: 14px;
  background: var(--bg-primary);
  color: var(--color-primary);
  outline: none;
  transition: border-color 0.2s;
  font-family: var(--font-mono);
}
.input:focus {
  border-color: var(--color-primary);
}
.settings-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}
.saved-hint {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary);
  text-transform: uppercase;
  font-family: var(--font-mono);
}
</style>
