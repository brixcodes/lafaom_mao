// src/components/toast/toastManager.ts
import { ref, nextTick } from 'vue'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastOptions {
  id?: string
  message: string
  type?: ToastType
  duration?: number
  icon?: string
}

const toasts = ref<ToastOptions[]>([])

export function showToast(options: ToastOptions) {
  const toast = {
    id: options.id || Date.now().toString(),
    type: options.type ?? 'info',
    duration: options.duration ?? 3500,
    ...options
  }
  
  toasts.value.push(toast)
  
  // Auto remove after duration
  if (toast.duration > 0) {
    setTimeout(() => {
      const index = toasts.value.findIndex(t => t.id === toast.id)
      if (index !== -1) {
        toasts.value.splice(index, 1)
      }
    }, toast.duration)
  }
}

export function removeToast(index: number) {
  toasts.value.splice(index, 1)
}

export function useToasts() {
  return { toasts, showToast, removeToast }
}
