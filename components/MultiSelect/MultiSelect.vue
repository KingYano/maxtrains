<template>
  <div class="multi-select" v-click-outside="closeDropdown">
    <div class="select-trigger" @click="toggleDropdown">
      <div class="selected-items">
        <span
          v-for="value in modelValue"
          :key="value"
          class="selected-badge"
        >
          {{ options[value] }}
          <button
            type="button"
            class="remove-btn"
            @click.stop="removeItem(value)"
          >
            <i class="ri-close-line"></i>
          </button>
        </span>
        <span v-if="modelValue.length === 0" class="placeholder">
          {{ placeholder }}
        </span>
      </div>
      <i :class="['dropdown-icon', 'ri-arrow-down-s-line', { open: isOpen }]"></i>
    </div>

    <transition name="dropdown">
      <div v-if="isOpen" class="dropdown-menu">
        <div
          v-for="(label, value) in options"
          :key="value"
          class="dropdown-item"
          @click="toggleItem(value)"
        >
          <input
            type="checkbox"
            :checked="modelValue.includes(value)"
            @click.stop
            class="checkbox"
          />
          <span class="label">{{ label }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  modelValue: string[]
  options: Record<string, string>
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Sélectionnez...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const toggleItem = (value: string) => {
  const newValue = [...props.modelValue]
  const index = newValue.indexOf(value)

  if (index > -1) {
    newValue.splice(index, 1)
  } else {
    newValue.push(value)
  }

  emit('update:modelValue', newValue)
}

const removeItem = (value: string) => {
  const newValue = props.modelValue.filter(v => v !== value)
  emit('update:modelValue', newValue)
}

// Directive v-click-outside
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

<style lang="scss" scoped>
@use './MultiSelect.scss';
</style>
