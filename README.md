# 🚄 MaxTrains - Recherche TGVmax en temps réel

Application moderne pour trouver vos places TGVmax gratuites (0€) instantanément sur toutes les lignes françaises.

## ✅ **Application fonctionnelle !**

✨ **Accessible sur : http://localhost:3000**

## 🚀 Fonctionnalités implémentées

- ✅ **Interface moderne** : Design épuré avec dark mode
- ✅ **Recherche TGVmax** : Formulaire complet avec autocomplete gares
- ✅ **Historique de recherche** : Sauvegarde des 10 dernières recherches (Pinia + localStorage)
- ✅ **Données API** : Intégration SNCF OpenDataSoft + Navitia avec fallback mock
- ✅ **Résultats visuels** : Trains groupés par destination avec statuts colorés
- ✅ **Responsive design** : Optimisé mobile et desktop
- ✅ **Accessibilité** : ARIA, WCAG, navigation clavier
- ✅ **Toast notifications** : Messages de succès/erreur
- ✅ **SEO optimisé** : Meta tags, OpenGraph, favicon

## 🛠️ Stack technique

- **Framework** : Nuxt.js 3 (Vue.js)
- **State Management** : Pinia (store global)
- **Styling** : CSS personnalisé avec CSS variables (dark mode)
- **APIs** : SNCF OpenDataSoft (gares) + Navitia (trains)
- **TypeScript** : Support complet avec types stricts
- **Icons** : Remix Icon

## 📋 Installation

### 1. **L'application est déjà lancée !**
Le serveur de développement tourne sur **http://localhost:3000**

### 2. Configuration API SNCF (optionnelle)
Pour les données temps réel, créer un fichier `.env` :
```bash
cp .env.example .env
```

Puis ajouter votre token SNCF :
```env
SNCF_API_KEY=votre_token_sncf_ici
```

**Obtenir un token** : [SNCF Numerique](https://numerique.sncf.com/startup/api/token-developpeur/)

> **Note** : Sans token, l'application utilise des données mock réalistes

## 🎯 Utilisation

1. **Rechercher** : Entrer une gare de départ et une date
2. **Consulter** : Voir les résultats avec disponibilités colorées  
3. **Réserver** : Cliquer sur "🎫 Réserver" pour aller sur SNCF Connect

## 🎨 Design

**Interface :**
- 🟢 Vert émeraude (#10b981) : Disponible
- 🟠 Orange (#f59e0b) : Places limitées
- 🔴 Rouge (#ef4444) : Complet
- Cards élégantes avec ombres subtiles
- Emojis pour une meilleure UX

## 📁 Structure

```
maxtrains/
├── pages/index.vue                    # Page principale avec formulaire de recherche
├── layouts/default.vue                # Layout avec header et dark mode toggle
├── components/                        # Composants modulaires
│   ├── DarkModeToggle/               # Toggle clair/sombre
│   ├── SearchHistory/                # Historique des recherches (Pinia)
│   ├── SkeletonLoader/               # Loading states
│   ├── StationAutocomplete/          # Autocomplete gares SNCF
│   └── Toast/                        # Notifications
├── stores/search.ts                   # Store Pinia (historique + résultats)
├── composables/                       # Composables Vue
│   ├── useDarkMode.ts                # Gestion du dark mode
│   └── useToast.ts                   # Système de notifications
├── server/api/                        # APIs serveur
│   ├── stations/search.get.ts        # Recherche gares OpenDataSoft
│   └── tgvmax/search.post.ts         # Recherche trains TGVmax
├── types/                            # Types TypeScript
├── assets/css/main.css               # Styles avec CSS variables
└── nuxt.config.ts                    # Configuration Nuxt + Pinia
```

## 🔧 Commandes

```bash
# Développement (déjà lancé)
npm run dev

# Build production
npm run build

# Preview production
npm run preview
```

## 🚀 Prochaines étapes possibles

Pour étendre l'application :
- Ajouter une carte Leaflet interactive pour visualiser les trajets
- Implémenter un système de notifications push pour les nouvelles disponibilités
- Créer un mode hors-ligne avec cache des résultats
- Ajouter des filtres avancés (durée, correspondances)
- Intégrer l'API de réservation SNCF Connect

---

**MaxTrains** - Votre assistant TGVmax fonctionnel ! 🚄✨