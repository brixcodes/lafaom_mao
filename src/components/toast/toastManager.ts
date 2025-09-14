// src/components/toast/toastManager.ts
import { ref, nextTick } from 'vue'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastOptions {
  message: string
  type?: ToastType
  duration?: number
  icon?: string
}

const toasts = ref<ToastOptions[]>([])

export function showToast(options: ToastOptions) {
  toasts.value.push({
    type: options.type ?? 'info',
    duration: options.duration ?? 3500,
    ...options
  })
}

export function removeToast(index: number) {
  toasts.value.splice(index, 1)
}

export function useToasts() {
  return { toasts, showToast, removeToast }
}
