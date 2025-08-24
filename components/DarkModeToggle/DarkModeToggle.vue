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

<style lang="scss" scoped>
  @use './DarkModeToggle.scss';
</style>