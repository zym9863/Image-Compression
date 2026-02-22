import type { UserSettings, PendingImage } from '@/types'
import { storage } from 'wxt/utils/storage'

export const DEFAULT_SETTINGS: UserSettings = {
  tinyPngApiKey: '',
  defaultMode: 'canvas',
  defaultQuality: 80,
  defaultFormat: 'original',
  defaultResize: { enabled: false, proportional: true },
}

export const pendingImageStorage = storage.defineItem<PendingImage | null>(
  'local:pendingContextMenuImage',
  { fallback: null }
)

export const settingsStorage = storage.defineItem<UserSettings>(
  'local:settings',
  { fallback: DEFAULT_SETTINGS }
)
