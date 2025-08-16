<template>
  <div class="autocomplete-container">
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

    <div 
      v-if="showSuggestions && (filteredStations.length > 0 || searchQuery.length >= 2 || loading)"
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
          </div>
          <div class="station-icon">
            <i class="ri-train-line"></i>
          </div>
        </div>

        <div v-if="filteredStations.length === 0 && searchQuery.length >= 2" class="no-results" role="status" aria-live="polite">
          <div class="no-results-content">
            <i class="ri-alert-line" aria-hidden="true"></i>
            Aucune gare trouvée
          </div>
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
  return stations.value.slice(0, 8)
})

watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue
})

watch(searchQuery, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleInput = () => {
  selectedIndex.value = -1
  
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
  }, 150)
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
  
  if (inputRef.value) {
    inputRef.value.blur()
  }
}

const hideSuggestions = () => {
  showSuggestions.value = false
  selectedIndex.value = -1
}

onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.autocomplete-container')) {
      hideSuggestions()
    }
  })
})
</script>

<style lang="scss" scoped>
@import './StationAutocomplete.scss';
</style>