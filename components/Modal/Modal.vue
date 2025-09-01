<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="handleOverlayClick">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button class="modal-close" @click="close">
            <i class="ri-close-line"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <p class="modal-message">{{ message }}</p>
          <div v-if="title === 'Redirection vers SNCF Connect'" class="booking-warning">
            ⚠️ Les trajets à 0€ sont exclusivement réservés aux abonnés TGV Max.
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn-secondary" @click="close">
            {{ cancelText }}
          </button>
          <button class="btn-primary" @click="confirm">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import type { ModalProps, ModalEmits } from '~/types/modal'

  const props = withDefaults(defineProps<ModalProps>(), {
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    closeOnOverlay: true
  })

  const emit = defineEmits<ModalEmits>()

  const close = () => {
    emit('close')
  }

  const confirm = () => {
    emit('confirm')
  }

  const handleOverlayClick = () => {
    if (props.closeOnOverlay) {
      close()
    }
  }

  onMounted(() => {
    if (props.visible) {
      document.body.style.overflow = 'hidden'
    }
  })

  onUnmounted(() => {
    document.body.style.overflow = ''
  })

  watch(() => props.visible, (newValue) => {
    if (newValue) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  })
</script>

<style lang="scss" scoped>
  @use './Modal.scss';
</style>