<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { CompressionMode, OutputFormat } from '@/types'
import { useSettings } from '@/composables/useSettings'

const { settings, load, save } = useSettings()

const tempApiKey = ref('')
const saved = ref(false)
const testing = ref(false)
const testResult = ref<string | null>(null)

onMounted(async () => {
  await load()
  tempApiKey.value = settings.value.tinyPngApiKey
})

async function saveAll() {
  await save({
    tinyPngApiKey: tempApiKey.value,
    defaultMode: settings.value.defaultMode,
    defaultQuality: settings.value.defaultQuality,
    defaultFormat: settings.value.defaultFormat,
    defaultResize: { ...settings.value.defaultResize },
  })
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}

async function testApiKey() {
  if (!tempApiKey.value) {
    testResult.value = '请先输入 API Key'
    return
  }
  testing.value = true
  testResult.value = null

  try {
    // 创建一个 1x1 红色 PNG 用于测试
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = 'red'
    ctx.fillRect(0, 0, 1, 1)

    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), 'image/png')
    )
    const arrayBuffer = await blob.arrayBuffer()

    const res = await fetch('https://api.tinify.com/shrink', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`api:${tempApiKey.value}`)}`,
        'Content-Type': 'application/octet-stream',
      },
      body: new Uint8Array(arrayBuffer),
    })

    if (res.ok) {
      testResult.value = 'API Key 有效!'
    } else {
      const body = await res.json().catch(() => ({}))
      testResult.value = `验证失败: ${(body as { message?: string }).message || res.status}`
    }
  } catch (e) {
    testResult.value = `请求失败: ${(e as Error).message}`
  } finally {
    testing.value = false
  }
}
</script>

<template>
  <div class="options-page">
    <h1>Image Compressor 设置</h1>

    <section class="section">
      <h2>TinyPNG API Key</h2>
      <p class="hint">
        在
        <a href="https://tinypng.com/developers" target="_blank">tinypng.com/developers</a>
        注册获取免费 API Key（每月 500 次免费压缩）
      </p>
      <div class="row">
        <input
          type="password"
          v-model="tempApiKey"
          placeholder="输入 API Key..."
          class="input flex-1"
        />
        <button class="btn" :disabled="testing" @click="testApiKey">
          {{ testing ? '验证中...' : '验证' }}
        </button>
      </div>
      <p v-if="testResult" class="test-result" :class="{ success: testResult.includes('有效') }">
        {{ testResult }}
      </p>
    </section>

    <section class="section">
      <h2>默认设置</h2>

      <div class="field">
        <label>默认压缩模式</label>
        <select v-model="settings.defaultMode" class="input">
          <option value="canvas">本地压缩 (Canvas)</option>
          <option value="tinypng">TinyPNG API</option>
        </select>
      </div>

      <div class="field">
        <label>默认质量: {{ settings.defaultQuality }}%</label>
        <input
          type="range"
          min="1"
          max="100"
          v-model.number="settings.defaultQuality"
          class="slider"
        />
      </div>

      <div class="field">
        <label>默认输出格式</label>
        <select v-model="settings.defaultFormat" class="input">
          <option value="original">保持原格式</option>
          <option value="jpeg">JPEG</option>
          <option value="png">PNG</option>
          <option value="webp">WebP</option>
        </select>
      </div>
    </section>

    <div class="save-row">
      <button class="btn btn-primary" @click="saveAll">保存设置</button>
      <span v-if="saved" class="saved">设置已保存</span>
    </div>
  </div>
</template>

<style>
:root {
  /* Colors - Industrial Brutalism */
  --color-primary: #ccff00;
  --color-primary-bg: rgba(204, 255, 0, 0.1);
  --color-success: #ccff00;
  --color-error: #ff3333;
  --color-warning: #ff9900;
  --color-warning-bg: rgba(255, 153, 0, 0.1);

  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;
  --text-muted: #52525b;

  /* Backgrounds */
  --bg-primary: #09090b;
  --bg-secondary: #18181b;
  --bg-hover: #27272a;

  /* Border */
  --border-color: #3f3f46;

  /* Typography */
  --font-sans: 'Bricolage Grotesque', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Space Mono', monospace;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: var(--font-sans);
  line-height: 1.6;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  background-image: radial-gradient(var(--border-color) 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>

<style scoped>
.options-page {
  max-width: 640px;
  margin: 60px auto;
  padding: 40px;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  box-shadow: 8px 8px 0 var(--border-color);
}
h1 {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 32px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 12px;
}
h1::before {
  content: '';
  display: block;
  width: 24px;
  height: 24px;
  background: var(--color-primary);
}
.section {
  background: var(--bg-secondary);
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid var(--border-color);
}
h2 {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 8px;
}
.hint {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 16px;
  font-family: var(--font-mono);
}
.hint a {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px solid var(--color-primary);
}
.hint a:hover {
  background: var(--color-primary);
  color: var(--bg-primary);
}
.row {
  display: flex;
  gap: 12px;
}
.flex-1 {
  flex: 1;
}
.input {
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  font-size: 14px;
  outline: none;
  background: var(--bg-primary);
  color: var(--color-primary);
  font-family: var(--font-mono);
  transition: border-color 0.2s;
}
.input:focus {
  border-color: var(--color-primary);
}
.btn {
  padding: 12px 24px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.2s;
  font-family: var(--font-sans);
}
.btn:hover:not(:disabled) {
  background: var(--bg-secondary);
  border-color: var(--text-primary);
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
  box-shadow: 4px 4px 0 var(--border-color);
}
.btn-primary:hover:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--border-color);
  background: var(--color-primary);
  color: var(--bg-primary);
}
.btn-primary:active:not(:disabled) {
  transform: translate(4px, 4px);
  box-shadow: none;
}
.test-result {
  margin-top: 12px;
  font-size: 13px;
  color: var(--color-error);
  font-family: var(--font-mono);
  font-weight: 700;
  padding: 8px 12px;
  background: rgba(255, 51, 51, 0.1);
  border: 1px solid var(--color-error);
}
.test-result.success {
  color: var(--color-primary);
  background: var(--color-primary-bg);
  border-color: var(--color-primary);
}
.field {
  margin-top: 16px;
}
.field label {
  display: block;
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 8px;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.field select {
  width: 100%;
  cursor: pointer;
}
.slider {
  width: 100%;
  margin-top: 8px;
  height: 8px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  outline: none;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 24px;
  background: var(--color-primary);
  cursor: pointer;
  border: 1px solid var(--bg-primary);
}
.save-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px dashed var(--border-color);
}
.saved {
  font-size: 14px;
  font-weight: 800;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: var(--font-mono);
}
</style>
