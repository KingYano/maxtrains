<template>
  <div class="skeleton-container">
    <div v-if="type === 'search-results'" class="skeleton-search-results">
      <div class="skeleton-header">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-subtitle"></div>
      </div>

      <div v-for="i in 3" :key="i" class="skeleton-destination-group">
        <div class="skeleton skeleton-destination-title"></div>
        
        <div v-for="j in 2" :key="j" class="skeleton-train-card">
          <div class="skeleton-train-content">
            <div class="skeleton-train-header">
              <div class="skeleton skeleton-train-id"></div>
              <div class="skeleton skeleton-train-time"></div>
            </div>
            <div class="skeleton-train-details">
              <div class="skeleton skeleton-duration"></div>
              <div class="skeleton skeleton-seats"></div>
            </div>
          </div>
          <div class="skeleton skeleton-status"></div>
        </div>
      </div>
    </div>

    <div v-else-if="type === 'autocomplete'" class="skeleton-autocomplete">
      <div v-for="i in count || 5" :key="i" class="skeleton-autocomplete-item">
        <div class="skeleton skeleton-station-name"></div>
        <div class="skeleton skeleton-station-city"></div>
      </div>
    </div>

    <div v-else class="skeleton-generic">
      <div v-for="i in count || 3" :key="i" class="skeleton skeleton-line"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'generic',
    validator: (value) => ['search-results', 'autocomplete', 'generic'].includes(value)
  },
  count: {
    type: Number,
    default: 3
  }
})
</script>

<style scoped>
.skeleton-container {
  width: 100%;
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-search-results {
  padding: 24px;
  background: white;
  border-radius: 16px;
  margin-bottom: 20px;
}

.skeleton-header {
  margin-bottom: 2rem;
}

.skeleton-title {
  height: 24px;
  width: 60%;
  margin-bottom: 0.5rem;
}

.skeleton-subtitle {
  height: 16px;
  width: 80%;
}

.skeleton-destination-group {
  margin-bottom: 2rem;
}

.skeleton-destination-title {
  height: 20px;
  width: 40%;
  margin-bottom: 1rem;
  border-radius: 8px;
}

.skeleton-train-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.skeleton-train-content {
  flex: 1;
}

.skeleton-train-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.skeleton-train-id {
  height: 16px;
  width: 80px;
}

.skeleton-train-time {
  height: 16px;
  width: 120px;
}

.skeleton-train-details {
  display: flex;
  gap: 1rem;
}

.skeleton-duration {
  height: 14px;
  width: 60px;
}

.skeleton-seats {
  height: 14px;
  width: 80px;
}

.skeleton-status {
  height: 24px;
  width: 100px;
  border-radius: 16px;
}

.skeleton-autocomplete {
  padding: 0;
}

.skeleton-autocomplete-item {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.skeleton-autocomplete-item:last-child {
  border-bottom: none;
}

.skeleton-station-name {
  height: 16px;
  width: 70%;
  margin-bottom: 4px;
}

.skeleton-station-city {
  height: 12px;
  width: 50%;
}

.skeleton-generic {
  padding: 16px;
}

.skeleton-line {
  height: 16px;
  margin-bottom: 12px;
}

.skeleton-line:nth-child(1) { width: 100%; }
.skeleton-line:nth-child(2) { width: 85%; }
.skeleton-line:nth-child(3) { width: 70%; }
.skeleton-line:last-child { margin-bottom: 0; }

@media (max-width: 768px) {
  .skeleton-train-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .skeleton-status {
    align-self: flex-end;
  }
}
</style>