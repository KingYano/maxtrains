import type { Toast } from '~/types/toast'

export const useToast = () => {
  const toasts = ref<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id' | 'visible'>): number => {
    const id = Date.now()
    const newToast: Toast = {
      id,
      ...toast,
      visible: true
    }
    
    toasts.value.push(newToast)
    
    return id
  }

  const removeToast = (id: number): void => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const showSuccess = (title: string, message = '', duration = 5000): number => {
    return addToast({
      type: 'success',
      title,
      message,
      duration
    })
  }

  const showError = (title: string, message = '', duration = 7000): number => {
    return addToast({
      type: 'error',
      title,
      message,
      duration
    })
  }

  const showWarning = (title: string, message = '', duration = 6000): number => {
    return addToast({
      type: 'warning',
      title,
      message,
      duration
    })
  }

  const showInfo = (title: string, message = '', duration = 5000): number => {
    return addToast({
      type: 'info',
      title,
      message,
      duration
    })
  }

  const clear = (): void => {
    toasts.value = []
  }

  return {
    toasts: readonly(toasts),
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clear
  }
}