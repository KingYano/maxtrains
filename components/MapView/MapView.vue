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
  import type { MapViewProps, MapViewEmits } from '~/types/mapview'
  import { staticCoordinates } from '~/utils/station-coordinates'
  import { getStationMetadata } from '~/utils/station-categories'
  import type { DestinationType } from '~/utils/station-categories'

  const props = defineProps<MapViewProps>()

  const emit = defineEmits<MapViewEmits>()

  let map: L.Map | null = null
  const markers: L.Layer[] = []
  const routeLines: L.Polyline[] = []
  const selectedTrain = ref<TGVMaxAvailability | null>(null)
  const isLoadingCoordinates = ref(false)

  // Fonction pour obtenir la couleur selon le type de destination
  const getMarkerColor = (destinationName: string): string => {
    const metadata = getStationMetadata(destinationName)
    if (!metadata) return '#10b981' // Vert par défaut

    const colorMap: Record<DestinationType, string> = {
      plage: '#3b82f6',          // Bleu pour les plages
      montagne: '#22c55e',       // Vert pour les montagnes
      parc_attraction: '#ec4899', // Rose pour les parcs
      etranger: '#9333ea'        // Violet pour l'étranger
    }

    return colorMap[metadata.type] || '#10b981'
  }


  const getAllCoordinates = async (stationNames: string[]) => {
    try {
      isLoadingCoordinates.value = true
      const response = await $fetch('/api/stations/coordinates', {
        method: 'POST',
        body: { stations: stationNames }
      })

      return response.coordinates
    } catch (error) {
      return {}
    } finally {
      isLoadingCoordinates.value = false
    }
  }


  const initMap = () => {
    if (import.meta.client && !map) {
      setTimeout(() => {
        const mapElement = document.getElementById('map')
        if (mapElement) {
          map = L.map('map', {
            zoomAnimation: false,
            fadeAnimation: false,
            markerZoomAnimation: false
          }).setView([46.603354, 1.888334], 6)


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
    routeLines.forEach(line => map?.removeLayer(line))
    routeLines.length = 0

    const bounds = L.latLngBounds([])
    const departureStation = props.searchResults[0]?.departureStation?.name
    const destinations = Object.keys(props.groupedResults)
    
    const allStations = [departureStation, ...destinations].filter(Boolean)
    const coordinatesMap = await getAllCoordinates(allStations)

    Object.assign(staticCoordinates, coordinatesMap)

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
      
      departureMarker.bindPopup(
        `<div class="map-popup"><strong>Gare de départ</strong><br/>${departureStation}</div>`,
        { closeButton: false, className: 'custom-popup' }
      )
      
      markers.push(departureMarker)
      bounds.extend([departureCoords.lat, departureCoords.lng])
    }

    for (const [destination] of Object.entries(props.groupedResults)) {
      const coords = coordinatesMap[destination]

      if (coords) {
        const markerColor = getMarkerColor(destination)
        const metadata = getStationMetadata(destination)

        const marker = L.circleMarker([coords.lat, coords.lng], {
          radius: 6,
          fillColor: markerColor,
          color: 'white',
          weight: 2,
          opacity: 1,
          fillOpacity: 1
        }).addTo(map)

        const trainsCount = props.groupedResults[destination].length
        const typeLabel = metadata ? ['🏖️ Plage', '⛰️ Montagne', '🎢 Parc', '🌍 Étranger'][['plage', 'montagne', 'parc_attraction', 'etranger'].indexOf(metadata.type)] || '' : ''
        const popupContent = `<div class="map-popup">
          <strong>${typeLabel}</strong><br/>
          <strong>${destination}</strong><br/>
          <em>${trainsCount} train${trainsCount > 1 ? 's' : ''} disponible${trainsCount > 1 ? 's' : ''}</em>
        </div>`
        marker.bindPopup(
          popupContent,
          { closeButton: false, className: 'custom-popup' }
        )

        marker.on('click', () => {
          emit('destinationSelected', destination)
        })

        if (departureCoords && coords) {
          const isSelectedRoute = selectedTrain.value &&
            selectedTrain.value.arrivalStation.name === destination

          const line = L.polyline([
            [departureCoords.lat, departureCoords.lng],
            [coords.lat, coords.lng]
          ], {
            color: isSelectedRoute ? '#ef4444' : markerColor,
            weight: isSelectedRoute ? 6 : 3,
            opacity: isSelectedRoute ? 0.9 : 0.6
          }).addTo(map)

          routeLines.push(line)
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
      setTimeout(async () => {
        if (map) {
          await addMarkers()
        }
      }, 200)
    })
  })

  watch(() => props.groupedResults, () => {
    if (map) {
      setTimeout(async () => {
        await addMarkers()
      }, 50)
    }
  }, { deep: true })

  const highlightTrain = (train: TGVMaxAvailability) => {
    selectedTrain.value = train
    if (map) {
      redrawRoutesWithSelection()

      const destination = train.arrivalStation.name
      emit('destinationSelected', destination)
    }
  }

  const redrawRoutesWithSelection = () => {
    if (!map) return

    routeLines.forEach(line => map?.removeLayer(line))
    routeLines.length = 0

    const departureStation = props.searchResults[0]?.departureStation?.name
    const departureCoords = staticCoordinates[departureStation]

    if (!departureCoords) return

    for (const [destination] of Object.entries(props.groupedResults)) {
      const coords = staticCoordinates[destination]
      if (coords && departureCoords) {
        const isSelectedRoute = selectedTrain.value &&
          selectedTrain.value.arrivalStation.name === destination

        const markerColor = getMarkerColor(destination)

        const line = L.polyline([
          [departureCoords.lat, departureCoords.lng],
          [coords.lat, coords.lng]
        ], {
          color: isSelectedRoute ? '#ef4444' : markerColor,
          weight: isSelectedRoute ? 6 : 3,
          opacity: isSelectedRoute ? 0.9 : 0.6
        }).addTo(map!)

        routeLines.push(line)
      }
    }
  }


  defineExpose({
    highlightTrain,
    isLoadingCoordinates: readonly(isLoadingCoordinates),
    staticCoordinates
  })

  onUnmounted(() => {
    if (map) {
      map.remove()
      map = null
    }
  })
</script>

<style lang="scss" scoped>
  @use './MapView.scss';
</style>