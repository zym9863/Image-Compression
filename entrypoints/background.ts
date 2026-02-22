import type { CompressRequestPayload, ExtensionMessage, FetchImageResult } from '@/types'
import { pendingImageStorage } from '@/utils/storage'
import { blobToDataUrl, dataUrlToUint8Array } from '@/utils/imageUtils'

export default defineBackground(() => {
  // 注册右键菜单
  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: 'compress-image',
      title: '压缩图片',
      contexts: ['image'],
    })
  })

  // 右键菜单点击处理
  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId !== 'compress-image' || !info.srcUrl || !tab?.id) return

    const tabId = tab.id
    const srcUrl = info.srcUrl

    try {
      const result = (await browser.tabs.sendMessage(tabId, {
        type: 'FETCH_IMAGE_AS_DATAURL',
        payload: { url: srcUrl, requestId: crypto.randomUUID() },
      } satisfies ExtensionMessage)) as FetchImageResult

      if (result.error) {
        await pendingImageStorage.setValue({ srcUrl, tabId })
      } else {
        await pendingImageStorage.setValue({
          srcUrl,
          tabId,
          dataUrl: result.dataUrl,
          size: result.byteSize,
        })
      }
    } catch {
      await pendingImageStorage.setValue({ srcUrl, tabId })
    }

    try {
      await browser.action.openPopup()
    } catch {
      // 不支持 openPopup 的浏览器，用户需手动点击扩展图标
    }
  })

  // TinyPNG 代理消息处理
  browser.runtime.onMessage.addListener(
    (message: ExtensionMessage, _sender, sendResponse) => {
      if (message.type === 'COMPRESS_REQUEST') {
        handleTinyPngRequest(message.payload)
          .then(sendResponse)
          .catch((err) => sendResponse({ error: (err as Error).message }))
        return true
      }
    }
  )

  async function handleTinyPngRequest(payload: CompressRequestPayload) {
    const binary = dataUrlToUint8Array(payload.imageDataUrl)

    const shrinkRes = await fetch('https://api.tinify.com/shrink', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`api:${payload.apiKey}`)}`,
        'Content-Type': 'application/octet-stream',
      },
      body: binary,
    })

    if (!shrinkRes.ok) {
      const errBody = await shrinkRes.json().catch(() => ({}))
      throw new Error(
        (errBody as { message?: string }).message ??
          `TinyPNG HTTP ${shrinkRes.status}`
      )
    }

    const json = (await shrinkRes.json()) as {
      output: { url: string; size: number }
    }
    const compressedRes = await fetch(json.output.url)
    const blob = await compressedRes.blob()
    const dataUrl = await blobToDataUrl(blob)

    return {
      requestId: payload.requestId,
      compressedDataUrl: dataUrl,
      compressedSize: json.output.size,
    }
  }
})
