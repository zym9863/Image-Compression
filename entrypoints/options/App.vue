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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #1a1a2e;
  background: #f8fafc;
}
</style>

<style scoped>
.options-page {
  max-width: 560px;
  margin: 40px auto;
  padding: 0 24px;
}
h1 {
  font-size: 24px;
  margin-bottom: 24px;
}
.section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
}
h2 {
  font-size: 16px;
  margin-bottom: 8px;
}
.hint {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 12px;
}
.hint a {
  color: #4f46e5;
}
.row {
  display: flex;
  gap: 8px;
}
.flex-1 {
  flex: 1;
}
.input {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  background: white;
}
.input:focus {
  border-color: #4f46e5;
}
.btn {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;
}
.btn:hover {
  background: #f1f5f9;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-primary {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}
.btn-primary:hover {
  background: #4338ca;
}
.test-result {
  margin-top: 8px;
  font-size: 13px;
  color: #dc2626;
}
.test-result.success {
  color: #16a34a;
}
.field {
  margin-top: 12px;
}
.field label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #374151;
}
.field select {
  width: 100%;
}
.slider {
  width: 100%;
  margin-top: 4px;
}
.save-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.saved {
  font-size: 14px;
  color: #16a34a;
}
</style>
