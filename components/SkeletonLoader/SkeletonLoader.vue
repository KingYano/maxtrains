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
      </div>
    </div>

    <div v-else class="skeleton-generic">
      <div v-for="i in count || 3" :key="i" class="skeleton skeleton-line"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { SkeletonLoaderProps } from '~/types/skeleton'

  withDefaults(defineProps<SkeletonLoaderProps>(), {
    type: 'search-results',
    count: 3
  })
</script>

<style lang="scss" scoped>
  @use './SkeletonLoader.scss';
</style>