<template>
    <div class="card p-6 additional-info">
      <h3 class="text-xl font-semibold mb-4 flex items-center">
        <PlayCircleIcon class="w-6 h-6 mr-2 text-blue-600" />
        Where to Watch
      </h3>
  
      <div v-if="loading" class="text-center py-4">
        <div class="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Finding streaming options...</p>
      </div>
  
      <div v-else-if="error" class="text-center py-4">
        <p class="text-red-600 dark:text-red-400 text-sm">{{ error }}</p>
        <button @click="fetchStreamingData" class="btn-secondary mt-2">
          Try Again
        </button>
      </div>
  
      <div v-else-if="streamingLinks.length > 0" class="space-y-3">
        <div 
          v-for="link in streamingLinks" 
          :key="link.provider.id"
          class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <div class="flex items-center">
            <div class="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center mr-3">
              <img 
                :src="link.provider.logo" 
                :alt="link.provider.name"
                class="w-8 h-8 object-contain"
                @error="$event.target.style.display = 'none'"
              />
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ link.provider.name }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ link.provider.type === 'subscription' ? 'Subscription' : 
                   link.provider.type === 'rent' ? `Rent ${link.provider.price?.amount}` :
                   link.provider.type === 'buy' ? `Buy ${link.provider.price?.amount}` : 'Free' }}
              </p>
            </div>
          </div>
          
          <a
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary text-sm px-4 py-2"
          >
            Watch Now
          </a>
        </div>
      </div>
  
      <div v-else class="text-center py-6">
        <TvIcon class="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          No streaming options found for this anime in your region.
        </p>
        <div class="text-sm text-gray-500 space-y-1">
          <p>Try checking:</p>
          <div class="flex flex-wrap justify-center gap-2 mt-2">
            <a href="https://www.crunchyroll.com" target="_blank" class="text-blue-600 hover:underline">Crunchyroll</a>
            <span>•</span>
            <a href="https://www.funimation.com" target="_blank" class="text-blue-600 hover:underline">Funimation</a>
            <span>•</span>
            <a href="https://www.netflix.com" target="_blank" class="text-blue-600 hover:underline">Netflix</a>
            <span>•</span>
            <a href="https://www.hidive.com" target="_blank" class="text-blue-600 hover:underline">HIDIVE</a>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { PlayCircleIcon, TvIcon } from '@heroicons/vue/24/outline'
  import type { Anime } from '~/types/anime'
  import type { WatchLink } from '~/types/streaming'
  
  interface Props {
    anime: Anime
  }
  
  const props = defineProps<Props>()
  
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)
  const streamingLinks = ref<WatchLink[]>([])
  
  // Fetch streaming data when component mounts or anime changes
  const fetchStreamingData = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<{
        success: boolean
        links: WatchLink[]
        error?: string
      }>(`/api/streaming?animeId=${props.anime.id}`)
      
      if (response.success) {
        streamingLinks.value = response.links
      } else {
        error.value = response.error || 'Failed to fetch streaming data'
      }
    } catch (err) {
      console.error('Streaming data error:', err)
      error.value = 'Unable to fetch streaming information'
    } finally {
      loading.value = false
    }
  }
  
  // Watch for anime changes
  watch(() => props.anime.id, fetchStreamingData, { immediate: true })
  </script>
  