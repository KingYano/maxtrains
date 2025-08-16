<template>
  <div v-if="searchStore.hasHistory" class="search-history">
    <div class="history-header">
      <h3 class="history-title">
        <i class="ri-history-line" aria-hidden="true"></i>
        Recherches récentes
      </h3>
      <button class="btn-clear-header" @click="clearHistory">
        <i class="ri-delete-bin-line" aria-hidden="true"></i>
        Effacer l'historique
      </button>
    </div>
    
    <div class="history-list">
      <div
        v-for="(search, index) in searchStore.searchHistory"
        :key="index"
        class="history-item"
        @click="$emit('selectHistory', search)"
      >
        <div class="history-content">
          <div class="history-route">
            <i class="ri-train-line" aria-hidden="true"></i>
            <strong>{{ search.departureStation }}</strong>
            <i class="ri-arrow-right-line" aria-hidden="true"></i>
            <span>{{ search.arrivalStation || 'Toutes destinations' }}</span>
          </div>
          <div class="history-date">
            <i class="ri-calendar-line" aria-hidden="true"></i>
            {{ formatDate(search.date) }}
          </div>
        </div>
        
        <button
          class="history-remove"
          :aria-label="`Supprimer la recherche ${search.departureStation}`"
          @click.stop="removeFromHistory(index)"
        >
          <i class="ri-close-line" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { SearchParams } from '~/types/tgvmax'

const searchStore = useSearchStore()

defineEmits<{
  selectHistory: [search: SearchParams]
}>()

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: fr })
  } catch {
    return dateString
  }
}

const removeFromHistory = (index: number) => {
  searchStore.removeFromHistory(index)
  searchStore.saveToStorage()
}

const clearHistory = () => {
  if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ?')) {
    searchStore.clearHistory()
    searchStore.saveToStorage()
  }
}
</script>

<style lang="scss" scoped>
@import './SearchHistory.scss';
</style>