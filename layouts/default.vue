<template>
  <div>
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="header-brand">
            <img 
              src="/images/logo-trainmax.png" 
              alt="MaxTrains logo" 
              class="header-logo"
              width="40" 
              height="40"
            />
            <div class="header-text">
              <h1 class="header-title">MaxTrains</h1>
              <p class="header-subtitle">Disponibilités TGVmax en temps réel</p>
            </div>
          </div>
          <DarkModeToggle />
        </div>
      </div>
    </header>
    <main class="container" role="main">
      <slot />
    </main>
  </div>
</template>

<script setup>
const { initializeDarkMode } = useDarkMode()

useHead({
  htmlAttrs: {
    lang: 'fr'
  }
})

onMounted(() => {
  initializeDarkMode()
})
</script>