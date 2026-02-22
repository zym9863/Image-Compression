import { ref, computed } from 'vue'
import type { ImageItem, CompressionOptions } from '@/types'
import { useSettings } from './useSettings'
import { compressWithCanvas } from './useCanvasCompressor'
import { compressWithTinyPng } from './useTinyPng'
import { blobToDataUrl, dataUrlToBlob, chunks } from '@/utils/imageUtils'

export function useCompression() {
  const { settings, load: loadSettings } = useSettings()
  const items = ref<ImageItem[]>([])
  const selectedId = ref<string | null>(null)
  const isProcessing = ref(false)

  const options = ref<CompressionOptions>({
    mode: 'canvas',
    quality: 80,
    outputFormat: 'original',
    resize: { enabled: false, proportional: true },
  })

  const stats = computed(() => ({
    total: items.value.length,
    completed: items.value.filter((i) => i.status === 'done').length,
    failed: items.value.filter((i) => i.status === 'error').length,
    pending: items.value.filter((i) => i.status === 'pending').length,
  }))

  const selectedItem = computed(() =>
    items.value.find((i) => i.id === selectedId.value) ?? null
  )

  async function init() {
    await loadSettings()
    options.value.mode = settings.value.defaultMode
    options.value.quality = settings.value.defaultQuality
    options.value.outputFormat = settings.value.defaultFormat
    options.value.resize = { ...settings.value.defaultResize }
  }

  function addFiles(files: File[]) {
    const newItems: ImageItem[] = files.map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      originalFile: f,
      originalSize: f.size,
      status: 'pending' as const,
    }))
    items.value.push(...newItems)
    newItems.forEach(loadOriginalPreview)

    if (!selectedId.value && newItems.length > 0) {
      selectedId.value = newItems[0].id
    }
  }

  function addFromUrl(
    url: string,
    name: string,
    size: number,
    dataUrl: string
  ) {
    const item: ImageItem = {
      id: crypto.randomUUID(),
      name,
      originalUrl: url,
      originalSize: size,
      originalDataUrl: dataUrl,
      status: 'pending',
    }
    items.value.push(item)
    if (!selectedId.value) selectedId.value = item.id
  }

  async function loadOriginalPreview(item: ImageItem) {
    if (item.originalDataUrl || !item.originalFile) return
    item.originalDataUrl = await blobToDataUrl(item.originalFile)
  }

  async function compressAll() {
    isProcessing.value = true
    // 重置已失败的任务
    items.value.forEach((item) => {
      if (item.status === 'error') item.status = 'pending'
    })

    const pending = items.value.filter((i) => i.status === 'pending')
    for (const chunk of chunks(pending, 3)) {
      await Promise.all(chunk.map((item) => compressSingle(item)))
    }
    isProcessing.value = false
  }

  async function compressSingle(item: ImageItem) {
    item.status = 'compressing'
    try {
      if (options.value.mode === 'canvas') {
        const source = item.originalFile ?? item.originalDataUrl!
        const result = await compressWithCanvas(source, options.value)
        item.compressedBlob = result.blob
        item.compressedDataUrl = result.dataUrl
        item.compressedSize = result.size
      } else {
        // TinyPNG 需要 dataUrl
        if (!item.originalDataUrl && item.originalFile) {
          item.originalDataUrl = await blobToDataUrl(item.originalFile)
        }
        const result = await compressWithTinyPng(
          item.originalDataUrl!,
          settings.value.tinyPngApiKey
        )
        item.compressedDataUrl = result.compressedDataUrl
        item.compressedSize = result.compressedSize
        item.compressedBlob = dataUrlToBlob(result.compressedDataUrl)
      }
      item.ratio = (item.originalSize - item.compressedSize!) / item.originalSize
      item.status = 'done'
    } catch (e) {
      item.status = 'error'
      item.error = (e as Error).message
    }
  }

  function removeItem(id: string) {
    const idx = items.value.findIndex((i) => i.id === id)
    if (idx !== -1) items.value.splice(idx, 1)
    if (selectedId.value === id) {
      selectedId.value = items.value[0]?.id ?? null
    }
  }

  function clearAll() {
    items.value = []
    selectedId.value = null
  }

  return {
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
    compressSingle,
    removeItem,
    clearAll,
  }
}
