import { ref } from 'vue'

const message = ref('')
const type = ref<'success' | 'error' | 'warning' | 'info'>('info')
const show = ref(false)
const timeout = ref(3000)

export function useSnackbar() {
  const showMessage = (msg: string, t: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    message.value = msg
    type.value = t
    show.value = true
  }

  const showSuccess = (msg: string) => {
    showMessage(msg, 'success')
  }

  const showError = (msg: string) => {
    showMessage(msg, 'error')
  }

  const showWarning = (msg: string) => {
    showMessage(msg, 'warning')
  }

  const showInfo = (msg: string) => {
    showMessage(msg, 'info')
  }

  const close = () => {
    show.value = false
  }

  return {
    message,
    type,
    show,
    timeout,
    showMessage,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    close,
  }
}
