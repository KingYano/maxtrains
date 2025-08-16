import type { SearchParams, TGVMaxAvailability } from '~/types/tgvmax'

// 🏪 STORE = définir un magasin de données
export const useSearchStore = defineStore('search', () => {
  
  // 📦 STATE = les données stockées (comme un ref global)
  const searchHistory = ref<SearchParams[]>([])
  const currentResults = ref<TGVMaxAvailability[]>([])
  const isSearching = ref(false)
  const lastSearchParams = ref<SearchParams | null>(null)
  
  // 🧮 GETTERS = données calculées (comme un computed global)
  const hasHistory = computed(() => searchHistory.value.length > 0)
  const resultsCount = computed(() => currentResults.value.length)
  
  // ⚡ ACTIONS = méthodes pour modifier les données
  const addToHistory = (params: SearchParams) => {
    // Évite les doublons
    const exists = searchHistory.value.find(
      h => h.departureStation === params.departureStation && 
           h.date === params.date &&
           h.arrivalStation === params.arrivalStation
    )
    
    if (!exists) {
      searchHistory.value.unshift(params) // Ajoute au début
      
      // Limite à 10 recherches max
      if (searchHistory.value.length > 10) {
        searchHistory.value.pop()
      }
    }
  }
  
  const setResults = (results: TGVMaxAvailability[]) => {
    currentResults.value = results
  }
  
  const setSearching = (searching: boolean) => {
    isSearching.value = searching
  }
  
  const setLastSearch = (params: SearchParams) => {
    lastSearchParams.value = params
  }
  
  const clearHistory = () => {
    searchHistory.value = []
  }
  
  const removeFromHistory = (index: number) => {
    searchHistory.value.splice(index, 1)
  }
  
  // 💾 PERSISTANCE = sauvegarder dans localStorage
  const saveToStorage = () => {
    if (process.client) {
      localStorage.setItem('maxtrains-search-history', JSON.stringify(searchHistory.value))
    }
  }
  
  const loadFromStorage = () => {
    if (process.client) {
      const saved = localStorage.getItem('maxtrains-search-history')
      if (saved) {
        try {
          searchHistory.value = JSON.parse(saved)
        } catch (error) {
          console.warn('Erreur chargement historique:', error)
        }
      }
    }
  }
  
  // 🎯 RETOUR = expose tout ce qui est public
  return {
    // State (lecture/écriture)
    searchHistory,
    currentResults,
    isSearching,
    lastSearchParams,
    
    // Getters (lecture seule)
    hasHistory,
    resultsCount,
    
    // Actions (méthodes)
    addToHistory,
    setResults,
    setSearching,
    setLastSearch,
    clearHistory,
    removeFromHistory,
    saveToStorage,
    loadFromStorage
  }
})