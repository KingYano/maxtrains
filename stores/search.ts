import type { SearchParams, TGVMaxAvailability } from '~/types/tgvmax'
import type { DestinationType, RegionType } from '~/utils/station-categories'
import { getStationMetadata } from '~/utils/station-categories'

export const useSearchStore = defineStore('search', () => {

  const searchHistory = ref<SearchParams[]>([])
  const currentResults = ref<TGVMaxAvailability[]>([])
  const isSearching = ref(false)
  const lastSearchParams = ref<SearchParams | null>(null)

  // Filtres thématiques actifs
  const activeTypeFilters = ref<DestinationType[]>([])
  const activeRegionFilters = ref<RegionType[]>([])

  const hasHistory = computed(() => searchHistory.value.length > 0)
  const resultsCount = computed(() => currentResults.value.length)

  // Résultats filtrés selon les critères thématiques
  const filteredResults = computed(() => {
    let results = currentResults.value

    // Si aucun filtre actif, retourner tous les résultats
    if (activeTypeFilters.value.length === 0 && activeRegionFilters.value.length === 0) {
      return results
    }

    // Filtrer par type de destination
    if (activeTypeFilters.value.length > 0) {
      results = results.filter(result => {
        const metadata = getStationMetadata(result.arrivalStation.name)
        if (!metadata) return false
        return activeTypeFilters.value.includes(metadata.type)
      })
    }

    // Filtrer par région
    if (activeRegionFilters.value.length > 0) {
      results = results.filter(result => {
        const metadata = getStationMetadata(result.arrivalStation.name)
        if (!metadata) return false
        return activeRegionFilters.value.includes(metadata.region)
      })
    }

    return results
  })

  const hasActiveFilters = computed(() =>
    activeTypeFilters.value.length > 0 || activeRegionFilters.value.length > 0
  )
  
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

  const setTypeFilters = (types: DestinationType[]) => {
    activeTypeFilters.value = types
  }

  const setRegionFilters = (regions: RegionType[]) => {
    activeRegionFilters.value = regions
  }

  const clearFilters = () => {
    activeTypeFilters.value = []
    activeRegionFilters.value = []
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
    activeTypeFilters,
    activeRegionFilters,

    hasHistory,
    resultsCount,
    filteredResults,
    hasActiveFilters,

    addToHistory,
    setResults,
    setSearching,
    setLastSearch,
    clearHistory,
    removeFromHistory,
    setTypeFilters,
    setRegionFilters,
    clearFilters,
    saveToStorage,
    loadFromStorage
  }
})