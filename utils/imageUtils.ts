import type { OutputFormat } from '@/types'

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

export function resolveMime(format: OutputFormat, source: File | string): string {
  if (format === 'original') {
    if (source instanceof File) return source.type
    const match = (source as string).match(/^data:([^;]+)/)
    return match?.[1] ?? 'image/jpeg'
  }
  return `image/${format}`
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg'
  const binary = atob(data)
  const arr = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i)
  return new Blob([arr], { type: mime })
}

export function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const data = dataUrl.split(',')[1]
  const binary = atob(data)
  const arr = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i)
  return arr
}

export function loadImage(source: File | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      if (source instanceof File) {
        URL.revokeObjectURL(img.src)
      }
      resolve(img)
    }
    img.onerror = reject
    if (source instanceof File) {
      img.src = URL.createObjectURL(source)
    } else {
      img.src = source
    }
  })
}

export function getFilenameFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname
    const segments = pathname.split('/')
    const last = segments[segments.length - 1]
    if (last && /\.\w+$/.test(last)) return decodeURIComponent(last)
  } catch {}
  return `image_${Date.now()}.jpg`
}

export function getFilenameWithNewExt(original: string, mime: string): string {
  const ext = mime.split('/')[1].replace('jpeg', 'jpg')
  return original.replace(/\.[^.]+$/, '') + '.' + ext
}

export function chunks<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size))
  return result
}
