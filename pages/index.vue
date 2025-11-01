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

    <!-- Filtres thématiques -->
    <ClientOnly>
      <FilterChips
        v-if="searchResults.length > 0 && !searching"
        :show-region-filter="true"
        @update:types="handleTypeFiltersChange"
        @update:regions="handleRegionFiltersChange"
      />
    </ClientOnly>

    <ClientOnly>
      <SkeletonLoader v-if="searching || isLoadingMap" type="search-results" class="card" />

      <section v-else-if="displayedResults.length === 0 && searchResults.length === 0 && hasSearched" class="card empty-state" role="status" aria-live="polite">
        <div class="empty-content">
          <i class="ri-train-line empty-icon" aria-hidden="true"></i>
          <h3>Aucun train trouvé</h3>
          <p>Essayez une autre date ou destination pour trouver des trains TGVmax disponibles.</p>
        </div>
      </section>

      <!-- Message si filtres actifs mais aucun résultat -->
      <section v-else-if="searchResults.length > 0 && displayedResults.length === 0 && hasActiveFilters" class="card empty-state" role="status" aria-live="polite">
        <div class="empty-content">
          <i class="ri-filter-line empty-icon" aria-hidden="true"></i>
          <h3>Aucun résultat avec ces filtres</h3>
          <p>Essayez de modifier ou supprimer certains filtres pour voir plus de résultats.</p>
        </div>
      </section>

      <div v-if="displayedResults.length > 0" class="results-container">
        <div ref="resultsMapRef" class="results-map">
          <MapView
            ref="mapViewRef"
            :search-results="displayedResults"
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
          :ref="setDestinationRef(destination)"
          :class="['destination-section', { 'highlight-destination': highlightedDestination === destination }]"
        >
          <div class="destination-header" @click="handleDestinationHeaderClick(destination)">
            <div class="destination-header-content">
              <h3 class="destination-title">
                <i class="ri-map-pin-line" aria-hidden="true"></i> {{ destination }} ({{ groupedResults[destination].length }} trains)
              </h3>
              <div class="destination-badges">
                <span
                  v-if="getDestinationMetadata(destination)"
                  :class="['badge', 'type-badge', getDestinationMetadata(destination)?.type]"
                >
                  {{ getTypeLabel(getDestinationMetadata(destination)?.type) }}
                </span>
                <span
                  v-if="getDestinationMetadata(destination)"
                  class="badge region-badge"
                >
                  {{ getRegionLabel(getDestinationMetadata(destination)?.region) }}
                </span>
              </div>
            </div>
            <i :class="['ri-arrow-down-s-line', 'toggle-icon', { open: isDestinationOpen(destination) }]" aria-hidden="true"></i>
          </div>

          <transition name="destination-content">
            <div v-if="isDestinationOpen(destination)" class="destination-content">
              <div v-if="!hasCoordinatesForDestination(destination)" class="missing-station-notice">
                <i class="ri-map-pin-line"></i>
                Cette destination n'est pas renseignée dans les données de la SNCF et n'est pas visible sur la carte
              </div>

              <ul role="list" class="trains-list">
            <li v-for="train in groupedResults[destination]" :key="train.trainId">
              <div
                class="train-card"
                tabindex="0"
              >
                <div class="train-main train-main-desktop">
                  <div class="train-number">
                    <i class="ri-train-line"></i> {{ train.trainId }}
                  </div>
                  <div class="train-schedule">
                    <i class="ri-time-line"></i> {{ formatTime(train.departureTime) }} → {{ formatTime(train.arrivalTime, true, train.departureTime) }}
                  </div>
                  <div class="train-status">
                    <button 
                      v-if="train.status === 'available'" 
                      class="booking-link"
                      @click.stop="showBookingModal(train)"
                    >
                      <i class="ri-external-link-line"></i>
                      Réserver
                    </button>
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
                    <i class="ri-time-line"></i> {{ formatTime(train.departureTime) }} → {{ formatTime(train.arrivalTime, true, train.departureTime) }} • <i class="ri-timer-line"></i> {{ train.duration }}
                  </div>
                  <div class="train-status-mobile">
                    <button 
                      v-if="train.status === 'available'" 
                      class="booking-link"
                      @click.stop="showBookingModal(train)"
                    >
                      <i class="ri-external-link-line"></i>
                      Réserver
                    </button>
                    <span v-else :class="['status-badge', train.status]">
                      {{ getStatusText(train.status) }}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
            </div>
          </transition>
        </div>
      </section>
        </div>
      </div>
    </ClientOnly>

    <Modal
      :visible="bookingModalVisible"
      title="Redirection vers SNCF Connect"
      message="Vous allez être redirigé vers SNCF Connect pour finaliser votre réservation."
      confirm-text="Continuer"
      cancel-text="Annuler"
      @confirm="proceedToBooking"
      @close="closeBookingModal"
    />
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import type { Station, TGVMaxAvailability, SearchParams } from '~/types/global'
import { staticCoordinates } from '~/utils/station-coordinates'
import { getStationMetadata, typeLabels, regionLabels } from '~/utils/station-categories'
import type { DestinationType, RegionType } from '~/utils/station-categories'

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
const resultsMapRef = ref()
const destinationRefs = ref<Record<string, HTMLElement>>({})
const highlightedDestination = ref<string | null>(null)
const isLoadingMap = ref(false)
const bookingModalVisible = ref(false)
const pendingBookingTrain = ref<TGVMaxAvailability | null>(null)
const openDestinations = ref<Set<string>>(new Set())

const {
  isSearching: searching,
  currentResults: searchResults,
  filteredResults,
  hasActiveFilters
} = storeToRefs(searchStore)
const hasSearched = ref(false)
const lastSuccessfulSearch = ref<{ departureStation: string; date: string } | null>(null)

// Résultats affichés (filtrés ou non selon les filtres actifs)
const displayedResults = computed(() => {
  return hasActiveFilters.value ? filteredResults.value : searchResults.value
})

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
  if (displayedResults.value.length === 0) return {} as Record<string, TGVMaxAvailability[]>

  const grouped = displayedResults.value.reduce((acc: Record<string, TGVMaxAvailability[]>, train: TGVMaxAvailability) => {
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

const formatTime = (time: string, isArrival = false, departureTime?: string) => {
  const timeFormatted = format(new Date(time), 'HH:mm')
  
  if (isArrival && departureTime) {
    const departure = new Date(departureTime)
    const arrival = new Date(time)
    
    if (arrival.getDate() !== departure.getDate()) {
      return `${timeFormatted} +1`
    }
  }
  
  return timeFormatted
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

// Handlers pour les filtres thématiques
const handleTypeFiltersChange = (types: any[]) => {
  searchStore.setTypeFilters(types)
  clearHighlight()
}

const handleRegionFiltersChange = (regions: any[]) => {
  searchStore.setRegionFilters(regions)
  clearHighlight()
}

// Fonctions pour afficher les métadonnées des destinations
const getDestinationMetadata = (destination: string) => {
  return getStationMetadata(destination)
}

const getTypeLabel = (type: DestinationType | undefined) => {
  if (!type) return ''
  return typeLabels[type] || ''
}

const getRegionLabel = (region: RegionType | undefined) => {
  if (!region) return ''
  return regionLabels[region as RegionType] || ''
}

const setDestinationRef = (destination: string) => (el: any) => {
  if (el) {
    destinationRefs.value[destination] = el
  }
}

const clearHighlight = () => {
  highlightedDestination.value = null
}

const scrollToDestination = async (destination: string) => {
  const element = destinationRefs.value[destination]

  if (element) {
    clearHighlight()

    // Ouvrir la destination si elle est fermée
    if (!isDestinationOpen(destination)) {
      toggleDestination(destination)
    }

    // Attendre le prochain tick pour que le DOM soit mis à jour
    await nextTick()

    // Petit délai supplémentaire pour la transition d'ouverture
    setTimeout(() => {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })

      highlightedDestination.value = destination
    }, 50)
  }
}

const toggleDestination = (destination: string) => {
  if (openDestinations.value.has(destination)) {
    openDestinations.value.delete(destination)
  } else {
    openDestinations.value.add(destination)
  }
}

const isDestinationOpen = (destination: string) => {
  return openDestinations.value.has(destination)
}

const handleDestinationHeaderClick = (destination: string) => {
  // Vérifier si la destination est actuellement fermée (on va l'ouvrir)
  const isCurrentlyClosed = !isDestinationOpen(destination)

  // Toggle l'accordéon
  toggleDestination(destination)

  // Localiser sur la carte UNIQUEMENT lors de l'ouverture
  if (isCurrentlyClosed && hasCoordinatesForDestination(destination)) {
    locateDestinationOnMap(destination)
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


const locateDestinationOnMap = (destination: string) => {
  // Trouver le premier train de cette destination
  const trains = displayedResults.value.filter(
    result => result.arrivalStation.name === destination
  )

  if (trains.length > 0 && mapViewRef.value && mapViewRef.value.highlightTrain) {
    // Utiliser le premier train pour localiser la destination
    mapViewRef.value.highlightTrain(trains[0])

    // Scroller vers la carte
    if (resultsMapRef.value) {
      resultsMapRef.value.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }
}

const hasCoordinatesForDestination = (destination: string) => {
  return staticCoordinates[destination] !== undefined
}

const showBookingModal = (train: TGVMaxAvailability) => {
  pendingBookingTrain.value = train
  bookingModalVisible.value = true
}

const closeBookingModal = () => {
  bookingModalVisible.value = false
  pendingBookingTrain.value = null
}

const proceedToBooking = () => {
  if (pendingBookingTrain.value) {
    const url = generateBookingUrl(pendingBookingTrain.value)
    window.open(url, '_blank', 'noopener,noreferrer')
  }
  closeBookingModal()
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