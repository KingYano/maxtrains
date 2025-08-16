<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <img 
            src="/images/logo-trainmax.png" 
            alt="MaxTrains logo" 
            class="footer-logo"
            width="32" 
            height="32"
          />
          <span class="footer-title">MaxTrains</span>
        </div>
        
        <p class="footer-text">
          Développé avec ❤️ par 
          <a 
            href="https://yanisbelkadi.fr" 
            target="_blank" 
            rel="noopener noreferrer"
            class="footer-link"
          >
            Yanis Belkadi
          </a>
        </p>
      </div>
      
      <div class="footer-bottom">
        <p class="footer-copyright">
          © {{ currentYear }} MaxTrains - Recherche TGVmax en temps réel
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<style lang="scss" scoped>
@import './Footer.scss';
</style>