<template>
  <section class="card map-container">
    <h2 class="map-title">
      <i class="ri-map-2-line" aria-hidden="true"></i>
      Carte des destinations
    </h2>
    <div id="map" class="map"></div>
  </section>
</template>

<script setup lang="ts">
import L from 'leaflet'
import type { TGVMaxAvailability } from '~/types/tgvmax'

interface Props {
  searchResults: TGVMaxAvailability[]
  groupedResults: Record<string, TGVMaxAvailability[]>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  destinationSelected: [destination: string]
}>()

let map: L.Map | null = null
const markers: L.Layer[] = []


const getAllCoordinates = async (stationNames: string[]) => {
  try {
    const response = await $fetch('/api/stations/coordinates', {
      method: 'POST',
      body: { stations: stationNames }
    })
    
    return response.coordinates
  } catch (error) {
    console.error('Failed to fetch coordinates:', error)
    return {}
  }
}


const initMap = () => {
  if (import.meta.client && !map) {
    setTimeout(() => {
      const mapElement = document.getElementById('map')
      if (mapElement) {
        map = L.map('map').setView([46.603354, 1.888334], 6)
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map)
      }
    }, 100)
  }
}

const addMarkers = async () => {
  if (!map) {
    return
  }
  
  markers.forEach(marker => map?.removeLayer(marker))
  markers.length = 0
  map.eachLayer((layer) => {
    if (layer instanceof L.Polyline) {
      map?.removeLayer(layer)
    }
  })
  
  const bounds = L.latLngBounds([])
  const departureStation = props.searchResults[0]?.departureStation?.name
  const destinations = Object.keys(props.groupedResults)
  
  const allStations = [departureStation, ...destinations].filter(Boolean)
  const coordinatesMap = await getAllCoordinates(allStations)
  
  const departureCoords = coordinatesMap[departureStation]
  
  if (departureCoords) {
    const departureMarker = L.circleMarker([departureCoords.lat, departureCoords.lng], {
      radius: 8,
      fillColor: '#3b82f6',
      color: 'white',
      weight: 3,
      opacity: 1,
      fillOpacity: 1
    }).addTo(map)
    departureMarker.bindPopup(`<h4>🚉 ${departureStation}</h4><p>Gare de départ</p>`)
    markers.push(departureMarker)
    bounds.extend([departureCoords.lat, departureCoords.lng])
  }
  
  let destinationCount = 0
  for (const [destination, trains] of Object.entries(props.groupedResults)) {
    const coords = coordinatesMap[destination]
    
    if (coords) {
      destinationCount++
      let markerColor = '#10b981'
      
      const marker = L.circleMarker([coords.lat, coords.lng], {
        radius: 6,
        fillColor: markerColor,
        color: 'white',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
      }).addTo(map)
      marker.bindPopup(`<h4>🎯 ${destination}</h4><p>${trains.length} trains</p>`)
      
      marker.on('click', () => {
        emit('destinationSelected', destination)
      })
      
      if (departureCoords) {
        L.polyline([
          [departureCoords.lat, departureCoords.lng],
          [coords.lat, coords.lng]
        ], {
          color: markerColor,
          weight: 3,
          opacity: 0.6
        }).addTo(map)
      }
      
      markers.push(marker)
      bounds.extend([coords.lat, coords.lng])
    }
  }
  
  
  if (bounds.isValid()) {
    map.fitBounds(bounds, { padding: [20, 20] })
  }
}

onMounted(() => {
  nextTick(() => {
    initMap()
    setTimeout(() => {
      if (map) {
        addMarkers()
      }
    }, 200)
  })
})

watch(() => props.groupedResults, () => {
  if (map) {
    nextTick(() => {
      addMarkers()
    })
  }
}, { deep: true })

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style lang="scss" scoped>
@import './MapView.scss';
</style>