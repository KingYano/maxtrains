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

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 300px;
  max-width: 400px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-left: 4px solid;
  pointer-events: auto;
  animation: slideIn 0.3s ease-out;
}

.toast-success {
  border-left-color: #10b981;
}

.toast-error {
  border-left-color: #ef4444;
}

.toast-warning {
  border-left-color: #f59e0b;
}

.toast-info {
  border-left-color: #3b82f6;
}

.toast-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
  font-size: 12px;
}

.toast-success .toast-icon {
  background: #10b981;
}

.toast-error .toast-icon {
  background: #ef4444;
}

.toast-warning .toast-icon {
  background: #f59e0b;
}

.toast-info .toast-icon {
  background: #3b82f6;
}

.toast-content {
  flex: 1;
}

.toast-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
}

.toast-message {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #9ca3af;
  transition: color 0.2s;
}

.toast-close:hover {
  color: #6b7280;
  background: #f3f4f6;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }
  
  .toast {
    min-width: auto;
    max-width: none;
  }
}
</style>