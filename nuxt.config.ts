export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css', '~/assets/scss/map-styles.scss', 'remixicon/fonts/remixicon.css', 'leaflet/dist/leaflet.css'],
  ssr: false,
  app: {
    head: {
      title: 'MaxTrains - Recherche TGVmax Gratuit en Temps Réel',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Trouvez instantanément vos places TGVmax gratuites (0€) sur toutes les lignes françaises. Recherche en temps réel des trains TGVmax disponibles.' },
        { name: 'keywords', content: 'TGVmax, train gratuit, SNCF, réservation, disponibilité, temps réel, 0 euro, France' },
        { name: 'author', content: 'MaxTrains' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: 'MaxTrains - Recherche TGVmax Gratuit' },
        { property: 'og:description', content: 'Trouvez vos places TGVmax gratuites en temps réel sur toutes les lignes françaises' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/images/logo-trainmax.png' },
        { property: 'og:locale', content: 'fr_FR' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'MaxTrains - TGVmax Gratuit' },
        { name: 'twitter:description', content: 'Recherche de places TGVmax gratuites en temps réel' },
        { name: 'twitter:image', content: '/images/logo-trainmax.png' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/logo-trainmax.png' },
        { rel: 'canonical', href: 'https://maxtrains.fr' }
      ]
    }
  },
  runtimeConfig: {
    sncfApiKey: process.env.SNCF_API_KEY,
    public: {
      sncfApiUrl: 'https://api.sncf.com/v1/',
      openDataSoftUrl: 'https://ressources.data.sncf.com/api/v2/catalog/datasets/referentiel-gares-voyageurs/records'
    }
  },
  
  // Headers de sécurité
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://ressources.data.sncf.com https://api.sncf.com; font-src 'self' data:; base-uri 'self';",
        }
      }
    }
  }
})