import type { ExtensionMessage } from '@/types'
import { blobToDataUrl } from '@/utils/imageUtils'

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    browser.runtime.onMessage.addListener(
      (message: ExtensionMessage, _sender, sendResponse) => {
        if (message.type !== 'FETCH_IMAGE_AS_DATAURL') return

        const { url, requestId } = message.payload

        fetchImageAsDataUrl(url)
          .then((result) => sendResponse({ ...result, requestId }))
          .catch((err) =>
            sendResponse({ error: (err as Error).message, requestId })
          )

        return true // 异步响应
      }
    )

    async function fetchImageAsDataUrl(url: string) {
      const response = await fetch(url, { credentials: 'include' })
      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`)

      const blob = await response.blob()
      const dataUrl = await blobToDataUrl(blob)

      return {
        dataUrl,
        mimeType: blob.type || 'image/jpeg',
        byteSize: blob.size,
      }
    }
  },
})
