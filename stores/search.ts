import type { SearchParams, TGVMaxAvailability } from '~/types/tgvmax'

export const useSearchStore = defineStore('search', () => {
  
  const searchHistory = ref<SearchParams[]>([])
  const currentResults = ref<TGVMaxAvailability[]>([])
  const isSearching = ref(false)
  const lastSearchParams = ref<SearchParams | null>(null)
  
  const hasHistory = computed(() => searchHistory.value.length > 0)
  const resultsCount = computed(() => currentResults.value.length)
  
  const addToHistory = (params: SearchParams) => {
    const exists = searchHistory.value.find(
      h => h.departureStation === params.departureStation && 
           h.date === params.date &&
           h.arrivalStation === params.arrivalStation
    )
    
    if (!exists) {
      searchHistory.value.unshift(params)
      
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
          // Error loading search history from localStorage
        }
      }
    }
  }
  
  return {
    searchHistory,
    currentResults,
    isSearching,
    lastSearchParams,
    
    hasHistory,
    resultsCount,
    
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