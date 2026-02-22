import type { CompressResponsePayload, ExtensionMessage } from '@/types'

export async function compressWithTinyPng(
  dataUrl: string,
  apiKey: string
): Promise<{ compressedDataUrl: string; compressedSize: number }> {
  const requestId = crypto.randomUUID()

  const msg: ExtensionMessage = {
    type: 'COMPRESS_REQUEST',
    payload: { imageDataUrl: dataUrl, apiKey, requestId },
  }

  const response = (await browser.runtime.sendMessage(
    msg
  )) as CompressResponsePayload

  if (response.error) throw new Error(response.error)

  return {
    compressedDataUrl: response.compressedDataUrl!,
    compressedSize: response.compressedSize!,
  }
}
