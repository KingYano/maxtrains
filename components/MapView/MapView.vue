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

  const props = defineProps<MapViewProps>()

  const emit = defineEmits<MapViewEmits>()

  let map: L.Map | null = null
  const markers: L.Layer[] = []
  const routeLines: L.Polyline[] = []
  const selectedTrain = ref<TGVMaxAvailability | null>(null)
  const isLoadingCoordinates = ref(false)


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

          map.createPane('selectedPane')
          map.getPane('selectedPane')!.style.zIndex = '650'
          
          map.createPane('markersPane')
          map.getPane('markersPane')!.style.zIndex = '700'

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
        fillOpacity: 1,
        pane: 'markersPane'
      }).addTo(map)
      markers.push(departureMarker)
      bounds.extend([departureCoords.lat, departureCoords.lng])
    }

    for (const [destination] of Object.entries(props.groupedResults)) {
      const coords = coordinatesMap[destination]

      if (coords) {
        let markerColor = '#10b981'

        const marker = L.circleMarker([coords.lat, coords.lng], {
          radius: 6,
          fillColor: markerColor,
          color: 'white',
          weight: 2,
          opacity: 1,
          fillOpacity: 1,
          pane: 'markersPane'
        }).addTo(map)

        marker.on('click', () => {
          emit('destinationSelected', destination)
        })

        if (departureCoords) {
          const isSelectedRoute = selectedTrain.value &&
            selectedTrain.value.arrivalStation.name === destination

          const line = L.polyline([
            [departureCoords.lat, departureCoords.lng],
            [coords.lat, coords.lng]
          ], {
            color: isSelectedRoute ? '#ef4444' : markerColor,
            weight: isSelectedRoute ? 6 : 3,
            opacity: isSelectedRoute ? 0.9 : 0.6,
            pane: isSelectedRoute ? 'selectedPane' : 'overlayPane'
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
      nextTick(async () => {
        await addMarkers()
      })
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
      if (coords) {
        const isSelectedRoute = selectedTrain.value &&
          selectedTrain.value.arrivalStation.name === destination

        const line = L.polyline([
          [departureCoords.lat, departureCoords.lng],
          [coords.lat, coords.lng]
        ], {
          color: isSelectedRoute ? '#ef4444' : '#10b981',
          weight: isSelectedRoute ? 6 : 3,
          opacity: isSelectedRoute ? 0.9 : 0.6,
          pane: isSelectedRoute ? 'selectedPane' : 'overlayPane'
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