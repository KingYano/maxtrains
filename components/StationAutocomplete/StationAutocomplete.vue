<template>
  <div class="autocomplete-container" style="position: relative;">
    <input
      ref="inputRef"
      v-model="searchQuery"
      :placeholder="placeholder"
      class="input-field"
      :aria-expanded="showSuggestions && (filteredStations.length > 0 || searchQuery.length >= 2)"
      :aria-describedby="loading ? 'autocomplete-status' : undefined"
      :aria-required="required"
      role="combobox"
      aria-autocomplete="list"
      autocomplete="off"
      @input="handleInput"
      @focus="showSuggestions = true"
      @keydown.down.prevent="navigateDown"
      @keydown.up.prevent="navigateUp"
      @keydown.enter.prevent="selectStation"
      @keydown.escape="hideSuggestions"
    />

    <!-- Loading indicator -->
    <div v-if="loading" id="autocomplete-status" class="autocomplete-loading" aria-live="polite">
      <i class="ri-loader-5-line animate-spin" aria-hidden="true"></i>
      Recherche...
    </div>

    <div 
      v-if="showSuggestions && (filteredStations.length > 0 || searchQuery.length >= 2)"
      class="autocomplete-suggestions"
      role="listbox"
      :aria-label="`${filteredStations.length} suggestions disponibles`"
    >
      <SkeletonLoader v-if="loading" type="autocomplete" :count="3" />
      
      <template v-else>
        <div
          v-for="(station, index) in filteredStations"
          :key="station.id"
          :class="[
            'autocomplete-suggestion',
            index === selectedIndex ? 'selected' : ''
          ]"
          role="option"
          :aria-selected="index === selectedIndex"
          @click="selectStationFromList(station)"
          @mouseenter="selectedIndex = index"
        >
          <div class="station-info">
            <div class="station-name">{{ station.name }}</div>
            <div class="station-details">{{ station.city }}</div>
          </div>
          <div class="station-icon">
            <i class="ri-train-line"></i>
          </div>
        </div>

        <div v-if="filteredStations.length === 0 && searchQuery.length >= 2" class="no-results" role="status" aria-live="polite">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="ri-alert-line" aria-hidden="true"></i>
            Aucune gare trouvée
          </div>
          <small>Essayez "Paris", "Lyon", "Marseille"...</small>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Rechercher une gare...'
  },
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'stationSelected'])

const inputRef = ref(null)
const searchQuery = ref(props.modelValue)
const loading = ref(false)
const showSuggestions = ref(false)
const selectedIndex = ref(-1)
const stations = ref([])
let debounceTimeout = null

const filteredStations = computed(() => {
  return stations.value.slice(0, 8) // Limite à 8 suggestions
})

// Watch modelValue changes
watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue
})

// Emit modelValue changes
watch(searchQuery, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleInput = () => {
  selectedIndex.value = -1
  
  // Debounce API calls
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }
  
  if (searchQuery.value.length < 2) {
    stations.value = []
    showSuggestions.value = false
    return
  }
  
  showSuggestions.value = true
  debounceTimeout = setTimeout(() => {
    searchStations()
  }, 150) // Attendre 150ms après la dernière frappe
}

const searchStations = async () => {
  if (searchQuery.value.length < 2) return
  
  loading.value = true
  
  try {
    const response = await fetch(`/api/stations/search?q=${encodeURIComponent(searchQuery.value)}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.stations && Array.isArray(data.stations)) {
      stations.value = data.stations
      showSuggestions.value = true
    } else {
      stations.value = []
    }
  } catch (error) {
    console.error('Erreur recherche gares:', error)
    stations.value = []
    // Garder showSuggestions à true pour afficher "Aucune gare trouvée"
  } finally {
    loading.value = false
  }
}

const navigateDown = () => {
  if (selectedIndex.value < filteredStations.value.length - 1) {
    selectedIndex.value++
  }
}

const navigateUp = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--
  } else {
    selectedIndex.value = -1
  }
}

const selectStation = () => {
  if (selectedIndex.value >= 0 && filteredStations.value[selectedIndex.value]) {
    selectStationFromList(filteredStations.value[selectedIndex.value])
  }
}

const selectStationFromList = (station) => {
  searchQuery.value = station.name
  showSuggestions.value = false
  selectedIndex.value = -1
  
  emit('stationSelected', station)
  
  // Remove focus
  if (inputRef.value) {
    inputRef.value.blur()
  }
}

const hideSuggestions = () => {
  showSuggestions.value = false
  selectedIndex.value = -1
}

// Click outside to hide
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.autocomplete-container')) {
      hideSuggestions()
    }
  })
})
</script>

<style scoped>
.autocomplete-container {
  position: relative;
  width: 100%;
}


.autocomplete-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e2e8f0;
  border-top: none;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  backdrop-filter: blur(20px);
  overflow-x: hidden;
}

.autocomplete-suggestion {
  padding: 16px 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s ease;
  position: relative;
}

.autocomplete-suggestion:hover,
.autocomplete-suggestion.selected {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  transform: translateX(4px);
}

.autocomplete-suggestion.selected {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-left: 3px solid #10b981;
}

.station-info {
  flex: 1;
}

.station-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2px;
}

.station-details {
  font-size: 12px;
  color: #6b7280;
}

.station-icon {
  font-size: 18px;
  opacity: 0.6;
}

.no-results {
  padding: 16px;
  text-align: center;
  color: #6b7280;
}

.no-results small {
  color: #9ca3af;
  display: block;
  margin-top: 4px;
}
</style>