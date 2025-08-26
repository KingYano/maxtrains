<template>
  <div>
    <section class="card">
      <h1 class="page-title">
        Trouvez vos places TGVmax en temps réel
      </h1>
      <p class="page-subtitle">
        Vérifiez les disponibilités TGVmax instantanément sur toutes les lignes françaises
      </p>
    </section>

    <SearchHistory 
      @select-history="fillFromHistory"
    />

    <section class="card">
      <h2 class="search-title">
        Rechercher les trains TGVmax
      </h2>
      
      <form @submit.prevent="handleSearch">
        <div class="form-row">
          <div class="form-field">
            <label for="departure-station" class="form-label">
              <i class="ri-train-line" aria-hidden="true"></i> Gare de départ *
            </label>
            <StationAutocomplete
              v-model="searchParams.departureStation"
              placeholder="Ex. : Paris, Lyon, Le Creusot"
              :class="formErrors.departureStation ? 'error' : ''"
              :aria-describedby="formErrors.departureStation ? 'departure-error' : undefined"
              :required="true"
              @station-selected="onDepartureSelected"
              @blur="validateDepartureStation"
            />
            <ClientOnly>
              <div v-if="formErrors.departureStation" id="departure-error" class="error-message" role="alert">
                <i class="ri-error-warning-line" aria-hidden="true"></i>
                {{ formErrors.departureStation }}
              </div>
            </ClientOnly>
          </div>

          <div class="form-field">
            <label for="travel-date" class="form-label">
              <i class="ri-calendar-line" aria-hidden="true"></i> Date *
            </label>
            <input
              id="travel-date"
              v-model="searchParams.date"
              :class="['input-field', { 'error': formErrors.date }]"
              type="date"
              :min="today"
              :aria-describedby="formErrors.date ? 'date-error' : undefined"
              aria-required="true"
              @blur="validateDate"
            />
            <ClientOnly>
              <div v-if="formErrors.date" id="date-error" class="error-message" role="alert">
                <i class="ri-error-warning-line" aria-hidden="true"></i>
                {{ formErrors.date }}
              </div>
            </ClientOnly>
          </div>

          <div class="form-field">
            <label for="arrival-station" class="form-label">
              <i class="ri-map-pin-line" aria-hidden="true"></i> Destination (optionnel)
            </label>
            <StationAutocomplete
              v-model="searchParams.arrivalStation"
              placeholder="Destination (optionnel)..."
              aria-describedby="arrival-help"
              @station-selected="onArrivalSelected"
            />
            <div id="arrival-help" class="sr-only">
              Champ optionnel pour filtrer par destination
            </div>
          </div>
        </div>

        <button
          type="submit"
          class="btn-primary btn-search"
          :disabled="!isFormValid || searching"
          :aria-describedby="!isFormValid ? 'form-validation-help' : undefined"
        >
          <i v-if="searching" class="ri-loader-5-line animate-spin" aria-hidden="true"></i>
          <i v-else class="ri-search-line" aria-hidden="true"></i>
          {{ searching ? 'Recherche en cours...' : 'Rechercher les trains' }}
        </button>
        <div v-if="!isFormValid" id="form-validation-help" class="sr-only">
          Veuillez remplir tous les champs obligatoires pour effectuer la recherche
        </div>
      </form>
      
      <div class="search-info">
        <i class="ri-information-line" aria-hidden="true"></i>
        Il est possible que votre gare ne soit pas dans la liste. Vous pouvez quand même essayer de saisir le nom de votre gare pour effectuer une recherche.
      </div>
    </section>

    <ClientOnly>
      <SkeletonLoader v-if="searching || isLoadingMap" type="search-results" class="card" />
      
      <section v-else-if="searchResults.length === 0 && hasSearched" class="card empty-state" role="status" aria-live="polite">
        <div class="empty-content">
          <i class="ri-train-line empty-icon" aria-hidden="true"></i>
          <h3>Aucun train trouvé</h3>
          <p>Essayez une autre date ou destination pour trouver des trains TGVmax disponibles.</p>
        </div>
      </section>

      <div v-if="searchResults.length > 0" class="results-container">
        <div class="results-map">
          <MapView 
            ref="mapViewRef"
            :search-results="searchResults"
            :grouped-results="groupedResults"
            @destination-selected="scrollToDestination"
          />
        </div>
        
        <div class="results-list">
          <section class="card results-section" role="region" aria-labelledby="results-heading">
        <h2 id="results-heading" class="results-header">
          <i class="ri-train-line" aria-hidden="true"></i> Trains TGVmax
        </h2>
        <p v-if="lastSuccessfulSearch" class="results-summary">
          {{ destinationsCount }} destinations • {{ totalTrainsCount }} trains disponibles depuis {{ lastSuccessfulSearch.departureStation }}
        </p>
        
        <div 
          v-for="destination in Object.keys(groupedResults).sort()" 
          :key="destination" 
          :id="`destination-${destination.replace(/\s+/g, '-').toLowerCase()}`" 
          class="destination-section"
        >
          <h3 class="destination-title">
            <i class="ri-map-pin-line" aria-hidden="true"></i> {{ destination }} ({{ groupedResults[destination].length }} trains)
          </h3>
          
          <div v-if="!hasCoordinatesForDestination(destination)" class="missing-station-notice">
            <i class="ri-map-pin-line"></i>
            Cette destination n'est pas renseignée dans les données de la SNCF et n'est pas visible sur la carte
          </div>
          
          <ul role="list" class="trains-list">
            <li v-for="train in groupedResults[destination]" :key="train.trainId">
              <div 
                class="train-card" 
                tabindex="0"
                @click.stop="selectTrainOnMap(train)"
              >
                <div class="train-main train-main-desktop">
                  <div class="train-number">
                    <i class="ri-train-line"></i> {{ train.trainId }}
                  </div>
                  <div class="train-schedule">
                    <i class="ri-time-line"></i> {{ formatTime(train.departureTime) }} → {{ formatTime(train.arrivalTime) }}
                  </div>
                  <div class="train-status">
                    <a 
                      v-if="train.status === 'available'" 
                      :href="generateBookingUrl(train)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="booking-link"
                      @click.stop
                    >
                      <i class="ri-external-link-line"></i>
                      Réserver
                    </a>
                    <span v-else :class="['status-badge', train.status]">
                      {{ getStatusText(train.status) }}
                    </span>
                  </div>
                  <div class="train-duration">
                    <i class="ri-timer-line"></i> {{ train.duration }}
                  </div>
                </div>

                <div class="train-main train-main-mobile">
                  <div class="train-number-mobile">
                    <i class="ri-train-line"></i> {{ train.trainId }}
                  </div>
                  <div class="train-schedule-mobile">
                    <i class="ri-time-line"></i> {{ formatTime(train.departureTime) }} → {{ formatTime(train.arrivalTime) }} • <i class="ri-timer-line"></i> {{ train.duration }}
                  </div>
                  <div class="train-status-mobile">
                    <a 
                      v-if="train.status === 'available'" 
                      :href="generateBookingUrl(train)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="booking-link"
                      @click.stop
                    >
                      <i class="ri-external-link-line"></i>
                      Réserver
                    </a>
                    <span v-else :class="['status-badge', train.status]">
                      {{ getStatusText(train.status) }}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import type { Station, TGVMaxAvailability, SearchParams } from '~/types/global'
import { staticCoordinates } from '~/utils/station-coordinates'

const searchStore = useSearchStore()

useHead({
  title: 'MaxTrains - Recherche TGVmax en temps réel'
})

const today = format(new Date(), 'yyyy-MM-dd')

const searchParams = reactive({
  departureStation: '',
  arrivalStation: '',
  date: today
})

const selectedDepartureStation = ref<Station | null>(null)
const selectedArrivalStation = ref<Station | null>(null)
const mapViewRef = ref()
const currentHighlightedDestination = ref<string | null>(null)
const isLoadingMap = ref(false)

const { isSearching: searching, currentResults: searchResults } = storeToRefs(searchStore)
const hasSearched = ref(false)
const lastSuccessfulSearch = ref<{ departureStation: string; date: string } | null>(null)

onMounted(() => {
  searchStore.loadFromStorage()
})

const formErrors = reactive({
  departureStation: '',
  date: ''
})

const isFormValid = computed(() => {
  return searchParams.departureStation && 
         searchParams.date && 
         !formErrors.departureStation && 
         !formErrors.date
})

const validateDepartureStation = () => {
  if (!searchParams.departureStation || !searchParams.departureStation.trim()) {
    formErrors.departureStation = 'Gare de départ requise'
  } else {
    formErrors.departureStation = ''
  }
}

const validateDate = () => {
  if (!searchParams.date) {
    formErrors.date = 'Date requise'
  } else if (new Date(searchParams.date) < new Date(today)) {
    formErrors.date = 'La date ne peut pas être dans le passé'
  } else {
    formErrors.date = ''
  }
}

const groupedResults = computed(() => {
  if (searchResults.value.length === 0) return {} as Record<string, TGVMaxAvailability[]>
  
  const grouped = searchResults.value.reduce((acc: Record<string, TGVMaxAvailability[]>, train: TGVMaxAvailability) => {
    const destination = train.arrivalStation.name
    if (!acc[destination]) {
      acc[destination] = []
    }
    acc[destination].push(train)
    return acc
  }, {} as Record<string, TGVMaxAvailability[]>)
  
  Object.keys(grouped).forEach(destination => {
    grouped[destination].sort((a: TGVMaxAvailability, b: TGVMaxAvailability) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime())
  })
  
  return grouped
})

const destinationsCount = computed(() => Object.keys(groupedResults.value).length)
const totalTrainsCount = computed(() => searchResults.value.length)


const onDepartureSelected = (station: Station) => {
  selectedDepartureStation.value = station
  searchParams.departureStation = station.name
  validateDepartureStation()
}

const onArrivalSelected = (station: Station) => {
  selectedArrivalStation.value = station
  searchParams.arrivalStation = station.name
}

const { showSuccess, showError } = useToast()

const handleSearch = async () => {
  if (!isFormValid.value) return

  searchStore.setSearching(true)
  searchStore.setResults([])
  hasSearched.value = true
  clearHighlight()
  currentHighlightedDestination.value = null

  const currentSearch = {
    departureStation: searchParams.departureStation,
    arrivalStation: searchParams.arrivalStation,
    date: searchParams.date
  }
  searchStore.addToHistory(currentSearch)
  searchStore.setLastSearch(currentSearch)
  searchStore.saveToStorage()

  try {
    const { data } = await $fetch<{ data: TGVMaxAvailability[] }>('/api/tgvmax/search', {
      method: 'POST',
      body: {
        departureStation: selectedDepartureStation.value?.code || searchParams.departureStation,
        arrivalStation: selectedArrivalStation.value?.code || searchParams.arrivalStation,
        date: searchParams.date
      }
    })

    searchStore.setResults(data)
    
    lastSuccessfulSearch.value = {
      departureStation: searchParams.departureStation,
      date: searchParams.date
    }
    
    if (data.length > 0) {
      showSuccess('Recherche terminée', `${data.length} trains trouvés depuis ${searchParams.departureStation}`)
    } else {
      showError('Aucun résultat', 'Aucun train TGVmax trouvé pour cette recherche. Essayez une autre date ou destination.')
    }
  } catch (error) {
    showError('Erreur de recherche', 'Impossible de récupérer les données. Veuillez réessayer dans quelques instants.')
  } finally {
    searchStore.setSearching(false)
  }
}

const formatTime = (time: string) => {
  return format(new Date(time), 'HH:mm')
}

const getStatusText = (status: TGVMaxAvailability['status']) => {
  const statusMap: Record<TGVMaxAvailability['status'], string> = {
    available: 'Disponible',
    limited: 'Places limitées',
    full: 'Complet'
  }
  return statusMap[status] || status
}



const fillFromHistory = (historyItem: SearchParams) => {
  searchParams.departureStation = historyItem.departureStation
  searchParams.arrivalStation = historyItem.arrivalStation || ''
  searchParams.date = historyItem.date
}

const clearHighlight = () => {
  if (currentHighlightedDestination.value) {
    const prevElement = document.getElementById(`destination-${currentHighlightedDestination.value.replace(/\s+/g, '-').toLowerCase()}`)
    if (prevElement) {
      prevElement.classList.remove('highlight-destination')
    }
  }
}

const scrollToDestination = (destination: string) => {
  const elementId = `destination-${destination.replace(/\s+/g, '-').toLowerCase()}`
  const element = document.getElementById(elementId)
  
  if (element) {
    clearHighlight()
    
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    })
    
    element.classList.add('highlight-destination')
    currentHighlightedDestination.value = destination
  }
}

const generateBookingUrl = (train: TGVMaxAvailability) => {
  const departureDate = new Date(searchParams.date)
  const year = departureDate.getFullYear()
  const month = String(departureDate.getMonth() + 1).padStart(2, '0')
  const day = String(departureDate.getDate()).padStart(2, '0')
  const formattedDate = `${year}-${month}-${day}`
  
  const baseUrl = 'https://www.sncf-connect.com/app/home/proposal'
  const params = new URLSearchParams({
    origin: train.departureStation.name,
    destination: train.arrivalStation.name,
    outwardDate: formattedDate,
    passengers: '1',
    directTravel: 'false',
    animals: 'false',
    bike: 'false'
  })
  
  return `${baseUrl}?${params.toString()}`
}


const selectTrainOnMap = (train: TGVMaxAvailability) => {
  if (mapViewRef.value && mapViewRef.value.highlightTrain) {
    mapViewRef.value.highlightTrain(train)
    
    const mapElement = document.querySelector('.results-map')
    if (mapElement) {
      mapElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }
  }
}

const hasCoordinatesForDestination = (destination: string) => {
  return staticCoordinates[destination] !== undefined
}

watch(() => mapViewRef.value?.isLoadingCoordinates, (loading) => {
  if (loading !== undefined) {
    isLoadingMap.value = loading
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
  @use './index.scss';
</style>