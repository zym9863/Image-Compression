import type { ImageItem } from '@/types'
import JSZip from 'jszip'

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function downloadAllAsZip(items: ImageItem[]) {
  const zip = new JSZip()

  for (const item of items) {
    if (item.status === 'done' && item.compressedBlob) {
      const ext = item.compressedBlob.type.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg'
      const name = item.name.replace(/\.[^.]+$/, '') + `_compressed.${ext}`
      zip.file(name, item.compressedBlob)
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' })
  downloadBlob(zipBlob, `compressed_${Date.now()}.zip`)
}
