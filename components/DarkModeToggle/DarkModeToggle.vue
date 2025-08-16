<template>
  <button
    type="button"
    class="dark-mode-toggle"
    :aria-label="isDark ? 'Activer le mode clair' : 'Activer le mode sombre'"
    :title="isDark ? 'Passer en mode clair' : 'Passer en mode sombre'"
    @click="toggleDarkMode"
  >
    <i v-if="isDark" class="ri-sun-line" aria-hidden="true"></i>
    <i v-else class="ri-moon-line" aria-hidden="true"></i>
    <span class="sr-only">{{ isDark ? 'Mode clair' : 'Mode sombre' }}</span>
  </button>
</template>

<script setup>
const { isDark, toggleDarkMode } = useDarkMode()
</script>

<style scoped>
.dark-mode-toggle {
  background: none;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-primary);
  font-size: 18px;
}

.dark-mode-toggle:hover {
  background: var(--bg-hover);
  border-color: var(--primary-color);
  transform: scale(1.05);
}

.dark-mode-toggle:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>