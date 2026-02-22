import { ref } from 'vue'

export function useDragDrop(onFiles: (files: File[]) => void) {
  const isDragOver = ref(false)

  function handleDragEnter(e: DragEvent) {
    e.preventDefault()
    isDragOver.value = true
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault()
  }

  function handleDragLeave(e: DragEvent) {
    if (!(e.currentTarget as Element).contains(e.relatedTarget as Node)) {
      isDragOver.value = false
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    isDragOver.value = false
    const files = Array.from(e.dataTransfer?.files ?? []).filter((f) =>
      f.type.startsWith('image/')
    )
    if (files.length) onFiles(files)
  }

  return { isDragOver, handleDragEnter, handleDragOver, handleDragLeave, handleDrop }
}
