import type { CompressionOptions, ResizeOptions } from '@/types'
import { loadImage, resolveMime, blobToDataUrl } from '@/utils/imageUtils'

function computeDimensions(
  img: HTMLImageElement,
  resize: ResizeOptions
): { width: number; height: number } {
  if (!resize.enabled)
    return { width: img.naturalWidth, height: img.naturalHeight }

  const aspectRatio = img.naturalWidth / img.naturalHeight

  if (resize.width && resize.height && !resize.proportional) {
    return { width: resize.width, height: resize.height }
  }
  if (resize.width) {
    return {
      width: resize.width,
      height: Math.round(resize.width / aspectRatio),
    }
  }
  if (resize.height) {
    return {
      width: Math.round(resize.height * aspectRatio),
      height: resize.height,
    }
  }
  return { width: img.naturalWidth, height: img.naturalHeight }
}

export async function compressWithCanvas(
  source: File | string,
  options: CompressionOptions
): Promise<{ blob: Blob; dataUrl: string; size: number }> {
  const img = await loadImage(source)
  const { width, height } = computeDimensions(img, options.resize)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, width, height)

  const mime = resolveMime(options.outputFormat, source)
  const quality = options.quality / 100

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Canvas toBlob failed'))),
      mime,
      quality
    )
  })

  const dataUrl = await blobToDataUrl(blob)
  return { blob, dataUrl, size: blob.size }
}
