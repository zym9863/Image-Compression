export type OutputFormat = 'jpeg' | 'png' | 'webp' | 'original'
export type CompressionMode = 'canvas' | 'tinypng'
export type ImageStatus = 'pending' | 'compressing' | 'done' | 'error'

export interface ImageItem {
  id: string
  name: string
  originalFile?: File
  originalUrl?: string
  originalSize: number
  originalDataUrl?: string
  compressedBlob?: Blob
  compressedSize?: number
  compressedDataUrl?: string
  ratio?: number
  status: ImageStatus
  error?: string
}

export interface CompressionOptions {
  mode: CompressionMode
  quality: number
  outputFormat: OutputFormat
  resize: ResizeOptions
}

export interface ResizeOptions {
  enabled: boolean
  width?: number
  height?: number
  proportional: boolean
}

export interface UserSettings {
  tinyPngApiKey: string
  defaultMode: CompressionMode
  defaultQuality: number
  defaultFormat: OutputFormat
  defaultResize: ResizeOptions
}

export interface PendingImage {
  srcUrl: string
  tabId: number
  dataUrl?: string
  size?: number
}

// Message protocol
export interface ContextMenuImagePayload {
  srcUrl: string
  pageUrl: string
  tabId: number
}

export interface FetchImagePayload {
  url: string
  requestId: string
}

export interface FetchImageResult {
  requestId: string
  dataUrl: string
  mimeType: string
  byteSize: number
  error?: string
}

export interface CompressRequestPayload {
  imageDataUrl: string
  apiKey: string
  requestId: string
}

export interface CompressResponsePayload {
  requestId: string
  compressedDataUrl?: string
  compressedSize?: number
  error?: string
}

export type ExtensionMessage =
  | { type: 'FETCH_IMAGE_AS_DATAURL'; payload: FetchImagePayload }
  | { type: 'COMPRESS_REQUEST'; payload: CompressRequestPayload }
