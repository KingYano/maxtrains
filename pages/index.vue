<template>
  <div>
    <section class="card">
      <h1 style="text-align: center; font-size: 2.5rem; color: var(--primary-color); margin-bottom: 1rem; font-weight: 700;">
        Trouvez vos places TGVmax en temps réel
      </h1>
      <p style="text-align: center; font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 2rem; font-weight: 500;">
        Vérifiez les disponibilités TGVmax instantanément sur toutes les lignes françaises
      </p>
    </section>

    <!-- 🍍 HISTORIQUE PINIA - Seulement si il y en a -->
    <SearchHistory 
      @select-history="fillFromHistory"
    />

    <section class="card">
      <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem;">
        Rechercher les trains TGVmax gratuits (0€)
      </h2>
      
      <form @submit.prevent="handleSearch">
        <div style="margin-bottom: 1.5rem;">
          <label for="departure-station" class="form-label">
            <i class="ri-train-line" aria-hidden="true"></i> Gare de départ *
          </label>
          <StationAutocomplete
            v-model="searchParams.departureStation"
            placeholder="Ex. : Paris, Lyon, Le Creusot"
          :class="{ 'error': formErrors.departureStation }"
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

        <div style="margin-bottom: 1.5rem;">
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

        <div style="margin-bottom: 1.5rem;">
          <label for="arrival-station" class="form-label">
            <i class="ri-map-pin-line" aria-hidden="true"></i> Destination (optionnel)
          </label>
          <small style="color: var(--text-secondary); margin-bottom: 0.5rem; display: block;">
            Laissez vide pour voir tous les trains disponibles
          </small>
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

        <button
          type="submit"
          class="btn-primary"
          :disabled="!isFormValid || searching"
          :aria-describedby="!isFormValid ? 'form-validation-help' : undefined"
          style="width: 100%;"
        >
          <i v-if="searching" class="ri-loader-5-line animate-spin" aria-hidden="true"></i>
          <i v-else class="ri-search-line" aria-hidden="true"></i>
          {{ searching ? 'Recherche en cours...' : 'Rechercher les trains gratuits' }}
        </button>
        <div v-if="!isFormValid" id="form-validation-help" class="sr-only">
          Veuillez remplir tous les champs obligatoires pour effectuer la recherche
        </div>
      </form>
    </section>

    <ClientOnly>
      <SkeletonLoader v-if="searching" type="search-results" class="card" />
      
      <section v-else-if="searchResults.length === 0 && hasSearched" class="card empty-state" role="status" aria-live="polite">
        <div class="empty-content">
          <i class="ri-train-line empty-icon" aria-hidden="true"></i>
          <h3>Aucun train trouvé</h3>
          <p>Essayez une autre date ou destination pour trouver des trains TGVmax disponibles.</p>
        </div>
      </section>

      <section v-else-if="searchResults.length > 0" class="card" role="region" aria-labelledby="results-heading">
        <h2 id="results-heading" style="font-size: 1.5rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
          <i class="ri-train-line" aria-hidden="true"></i> Trains TGVmax gratuits
        </h2>
        <p style="color: var(--text-secondary); margin-bottom: 1rem; font-weight: 500;">
          {{ destinationsCount }} destinations • {{ totalTrainsCount }} trains disponibles depuis {{ searchParams.departureStation }}
        </p>
        
        <div v-for="destination in Object.keys(groupedResults).sort()" :key="destination" style="margin-bottom: 2rem;">
          <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; color: var(--primary-color); border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="ri-map-pin-line" aria-hidden="true"></i> {{ destination }} ({{ groupedResults[destination].length }} trains)
          </h3>
          
          <ul role="list" style="list-style: none; padding: 0; margin: 0;">
            <li v-for="train in groupedResults[destination]" :key="train.trainId">
              <div class="train-card" tabindex="0">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <div style="flex: 1;">
                <h4 style="font-size: 1rem; font-weight: 500; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                  <i class="ri-train-line"></i> {{ train.trainId }} • <i class="ri-time-line"></i>
                  {{ formatTime(train.departureTime) }} → {{ formatTime(train.arrivalTime) }}
                </h4>
                <p style="color: #6b7280; font-size: 0.9rem; margin: 0.5rem 0; display: flex; align-items: center; gap: 1rem;">
                  <span style="display: flex; align-items: center; gap: 0.25rem;">
                    <i class="ri-timer-line"></i> {{ train.duration }}
                  </span>
                  <span style="display: flex; align-items: center; gap: 0.25rem;">
                    <i class="ri-user-line"></i> {{ train.availableSeats }}
                  </span>
                </p>
              </div>
              
              <div style="display: flex; align-items: center; gap: 1rem;">
                <span 
                  class="status-badge"
                  :style="{
                    backgroundColor: getStatusColor(train.status),
                    color: 'white'
                  }"
                >
                  {{ getStatusText(train.status) }}
                </span>
                
                <div style="text-align: right;">
                  <div style="font-size: 0.75rem; color: #9ca3af;">
                    TGVmax 0€
                  </div>
                </div>
              </div>
              </div>
            </div>
            </li>
          </ul>
        </div>
      </section>
    </ClientOnly>
  </div>
</template>

<script setup>
import { format } from 'date-fns'

// 🍍 PINIA STORE - État global
const searchStore = useSearchStore()

useHead({
  title: 'MaxTrains - Recherche TGVmax en temps réel'
})

const today = format(new Date(), 'yyyy-MM-dd')

// 📦 STATE LOCAL - Seulement pour le formulaire
const searchParams = reactive({
  departureStation: '',
  arrivalStation: '',
  date: today
})

const selectedDepartureStation = ref(null)
const selectedArrivalStation = ref(null)

// 🍍 STATE GLOBAL - Via Pinia store
const { isSearching: searching, currentResults: searchResults } = storeToRefs(searchStore)
const hasSearched = ref(false)

// 💾 CHARGER L'HISTORIQUE au montage
onMounted(() => {
  searchStore.loadFromStorage()
})

// Validation d'état
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
  if (searchResults.value.length === 0) return {}
  
  const grouped = searchResults.value.reduce((acc, train) => {
    const destination = train.arrivalStation.name
    if (!acc[destination]) {
      acc[destination] = []
    }
    acc[destination].push(train)
    return acc
  }, {})
  
  // Trier chaque groupe par heure de départ
  Object.keys(grouped).forEach(destination => {
    grouped[destination].sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime())
  })
  
  return grouped
})

const destinationsCount = computed(() => Object.keys(groupedResults.value).length)
const totalTrainsCount = computed(() => searchResults.value.length)


const onDepartureSelected = (station) => {
  selectedDepartureStation.value = station
  searchParams.departureStation = station.name
  validateDepartureStation()
}

const onArrivalSelected = (station) => {
  selectedArrivalStation.value = station
  searchParams.arrivalStation = station.name
}

const { showSuccess, showError } = useToast()

const handleSearch = async () => {
  if (!isFormValid.value) return

  // 🍍 UTILISER LE STORE au lieu du state local
  searchStore.setSearching(true)
  searchStore.setResults([])
  hasSearched.value = true

  // 💾 SAUVEGARDER dans l'historique
  const currentSearch = {
    departureStation: searchParams.departureStation,
    arrivalStation: searchParams.arrivalStation,
    date: searchParams.date
  }
  searchStore.addToHistory(currentSearch)
  searchStore.setLastSearch(currentSearch)
  searchStore.saveToStorage() // Persister en localStorage

  try {
    const { data } = await $fetch('/api/tgvmax/search', {
      method: 'POST',
      body: {
        departureStation: selectedDepartureStation.value?.code || searchParams.departureStation,
        arrivalStation: selectedArrivalStation.value?.code || searchParams.arrivalStation,
        date: searchParams.date
      }
    })

    // 🍍 STOCKER les résultats dans le store
    searchStore.setResults(data)
    
    if (data.length > 0) {
      showSuccess('Recherche terminée', `${data.length} trains trouvés depuis ${searchParams.departureStation}`)
    } else {
      showError('Aucun résultat', 'Aucun train TGVmax trouvé pour cette recherche. Essayez une autre date ou destination.')
    }
  } catch (error) {
    console.error('Erreur lors de la recherche:', error)
    showError('Erreur de recherche', 'Impossible de récupérer les données. Veuillez réessayer dans quelques instants.')
  } finally {
    // 🍍 TERMINER le loading via le store
    searchStore.setSearching(false)
  }
}

const formatTime = (time) => {
  return format(new Date(time), 'HH:mm')
}

const getStatusText = (status) => {
  const statusMap = {
    available: 'Disponible',
    limited: 'Places limitées',
    full: 'Complet'
  }
  return statusMap[status] || status
}

const getStatusColor = (status) => {
  const colorMap = {
    available: '#10b981',
    limited: '#f59e0b',
    full: '#ef4444'
  }
  return colorMap[status] || '#6b7280'
}

// 🍍 MÉTHODES POUR L'HISTORIQUE
const fillFromHistory = (historyItem) => {
  searchParams.departureStation = historyItem.departureStation
  searchParams.arrivalStation = historyItem.arrivalStation || ''
  searchParams.date = historyItem.date
}


</script>