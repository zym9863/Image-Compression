import { ref } from 'vue'
import type { UserSettings } from '@/types'
import { settingsStorage, DEFAULT_SETTINGS } from '@/utils/storage'

export function useSettings() {
  const settings = ref<UserSettings>({ ...DEFAULT_SETTINGS })

  async function load() {
    settings.value = await settingsStorage.getValue()
  }

  async function save(patch: Partial<UserSettings>) {
    settings.value = { ...settings.value, ...patch }
    await settingsStorage.setValue(settings.value)
  }

  settingsStorage.watch((newVal) => {
    if (newVal) settings.value = newVal
  })

  return { settings, load, save }
}
