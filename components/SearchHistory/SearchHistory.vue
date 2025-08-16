<template>
  <div v-if="searchStore.hasHistory" class="search-history">
    <h3 class="history-title">
      <i class="ri-history-line" aria-hidden="true"></i>
      Recherches récentes
    </h3>
    
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
    
    <div class="history-actions">
      <button class="btn-clear" @click="clearHistory">
        <i class="ri-delete-bin-line" aria-hidden="true"></i>
        Effacer l'historique
      </button>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { SearchParams } from '~/types/tgvmax'

// 🍍 UTILISER LE STORE - Directement sans import !
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
  searchStore.saveToStorage() // Persister
}

const clearHistory = () => {
  if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ?')) {
    searchStore.clearHistory()
    searchStore.saveToStorage()
  }
}
</script>

<style scoped>
.search-history {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.history-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: var(--bg-hover);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-item:hover {
  background: var(--success-bg);
  transform: translateX(4px);
}

.history-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-route {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: var(--text-primary);
}

.history-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.history-remove {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.history-remove:hover {
  background: var(--error-bg);
  color: var(--error-color);
}

.history-actions {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.btn-clear {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.btn-clear:hover {
  border-color: var(--error-color);
  color: var(--error-color);
}


@media (max-width: 768px) {
  .history-item {
    padding: 10px;
  }
  
  .history-route {
    font-size: 0.9rem;
  }
  
}
</style>