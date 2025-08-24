export interface ModalProps {
  visible: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  closeOnOverlay?: boolean
}

export interface ModalEmits {
  close: []
  confirm: []
}