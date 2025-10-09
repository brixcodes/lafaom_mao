import { showToast as showToastManager } from '@/components/toast/toastManager'

export function useToast() {
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 5000) => {
    showToastManager({
      message,
      type,
      duration
    })
  }

  return {
    showToast
  }
}
