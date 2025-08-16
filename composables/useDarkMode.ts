// État global partagé
const isDark = ref(false)

const updateTheme = () => {
  if (process.client) {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }
}

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  updateTheme()
  if (process.client) {
    localStorage.setItem('maxtrains-dark-mode', isDark.value.toString())
  }
}

const initializeDarkMode = () => {
  if (process.client) {
    const savedTheme = localStorage.getItem('maxtrains-dark-mode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    isDark.value = savedTheme ? savedTheme === 'true' : prefersDark
    updateTheme()

    // Écouter les changements de préférence système
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('maxtrains-dark-mode')) {
        isDark.value = e.matches
        updateTheme()
      }
    })
  }
}

export const useDarkMode = () => {
  return {
    isDark: readonly(isDark),
    toggleDarkMode,
    initializeDarkMode
  }
}