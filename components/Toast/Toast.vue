<template>
  <Teleport to="body">
    <div v-if="visible" class="toast-container">
      <div :class="['toast', `toast-${type}`]">
        <div class="toast-icon">
          <i v-if="type === 'success'" class="ri-check-line"></i>
          <i v-else-if="type === 'error'" class="ri-error-warning-line"></i>
          <i v-else-if="type === 'warning'" class="ri-alert-line"></i>
          <i v-else class="ri-information-line"></i>
        </div>
        <div class="toast-content">
          <h4 class="toast-title">{{ title }}</h4>
          <p v-if="message" class="toast-message">{{ message }}</p>
        </div>
        <button class="toast-close" @click="close">
          <i class="ri-close-line"></i>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 5000
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

let timer = null

watch(() => props.visible, (newValue) => {
  if (newValue && props.duration > 0) {
    timer = setTimeout(() => {
      close()
    }, props.duration)
  } else if (timer) {
    clearTimeout(timer)
  }
})

const close = () => {
  if (timer) {
    clearTimeout(timer)
  }
  emit('close')
}

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})
</script>

<style lang="scss" scoped>
@import './Toast.scss';
</style>