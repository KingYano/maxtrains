<template>
  <div class="filter-chips">
    <div class="filter-section">
      <h3 class="filter-title">Filtrer par destination :</h3>

      <!-- Filtres par Type -->
      <div class="chips-container">
        <button
          v-for="(label, type) in typeFilters"
          :key="type"
          :class="['chip', { active: selectedTypes.includes(type) }]"
          @click="toggleType(type)"
        >
          {{ label }}
        </button>
      </div>
    </div>

    <div class="filter-section" v-if="showRegionFilter">
      <h3 class="filter-title">Filtrer par région :</h3>

      <!-- MultiSelect pour Régions -->
      <MultiSelect
        v-model="selectedRegions"
        :options="allRegions"
        placeholder="Toutes les régions"
        @update:modelValue="handleRegionChange"
      />
    </div>

    <!-- Clear filters button -->
    <div v-if="hasActiveFilters" class="clear-filters">
      <button @click="clearFilters" class="clear-btn">
        <i class="ri-close-circle-line"></i>
        Effacer tous les filtres
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DestinationType, RegionType } from '~/utils/station-categories'
import { typeLabels, regionLabels } from '~/utils/station-categories'

const props = defineProps<{
  showRegionFilter?: boolean
}>()

const emit = defineEmits<{
  'update:types': [types: DestinationType[]]
  'update:regions': [regions: RegionType[]]
}>()

const selectedTypes = ref<DestinationType[]>([])
const selectedRegions = ref<RegionType[]>([])

// Filtres par type (seulement les plus pertinents)
const typeFilters = computed(() => ({
  plage: typeLabels.plage,
  montagne: typeLabels.montagne,
  parc_attraction: typeLabels.parc_attraction,
  etranger: typeLabels.etranger,
}))

// Toutes les régions (sans international et corse)
const allRegions = computed(() => {
  const all = { ...regionLabels }
  delete all.international
  delete all.corse
  return all
})

const hasActiveFilters = computed(() =>
  selectedTypes.value.length > 0 || selectedRegions.value.length > 0
)

function toggleType(type: DestinationType) {
  const index = selectedTypes.value.indexOf(type)
  if (index > -1) {
    selectedTypes.value.splice(index, 1)
  } else {
    selectedTypes.value.push(type)
  }
  emit('update:types', selectedTypes.value)
}

function handleRegionChange() {
  emit('update:regions', selectedRegions.value)
}

function clearFilters() {
  selectedTypes.value = []
  selectedRegions.value = []
  emit('update:types', [])
  emit('update:regions', [])
}
</script>

<style lang="scss" scoped>
@use './FilterChips.scss';
</style>
