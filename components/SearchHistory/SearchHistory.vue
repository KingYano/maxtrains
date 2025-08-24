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

  <Modal
    :visible="showRemoveModal"
    title="Supprimer de l'historique"
    message="Êtes-vous sûr de vouloir supprimer cette recherche de l'historique ?"
    confirm-text="Supprimer"
    cancel-text="Annuler"
    @close="showRemoveModal = false"
    @confirm="confirmRemove"
  />

  <Modal
    :visible="showClearModal"
    title="Vider l'historique"
    message="Êtes-vous sûr de vouloir supprimer tout l'historique ? Cette action est irréversible."
    confirm-text="Tout supprimer"
    cancel-text="Annuler"
    @close="showClearModal = false"
    @confirm="confirmClear"
  />
</template>

<script setup lang="ts">
  import { format } from 'date-fns'
  import { fr } from 'date-fns/locale'
  import type { SearchParams } from '~/types/tgvmax'

  const searchStore = useSearchStore()

  import type { SearchHistoryEmits } from '~/types/autocomplete'

  defineEmits<SearchHistoryEmits>()

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: fr })
    } catch {
      return dateString
    }
  }

  const showRemoveModal = ref(false)
  const showClearModal = ref(false)
  const itemToRemove = ref<number | null>(null)

  const removeFromHistory = (index: number) => {
    itemToRemove.value = index
    showRemoveModal.value = true
  }

  const confirmRemove = () => {
    if (itemToRemove.value !== null) {
      searchStore.removeFromHistory(itemToRemove.value)
      searchStore.saveToStorage()
    }
    showRemoveModal.value = false
    itemToRemove.value = null
  }

  const clearHistory = () => {
    showClearModal.value = true
  }

  const confirmClear = () => {
    searchStore.clearHistory()
    searchStore.saveToStorage()
    showClearModal.value = false
  }
</script>

<style lang="scss" scoped>
  @use './SearchHistory.scss';
</style>