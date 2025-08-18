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

    <div v-else-if="streamingLinks.length > 0" class="space-y-4">
      
      <!-- Subscription Services -->
      <div v-if="subscriptionServices.length > 0">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
          <TvIcon class="w-4 h-4 mr-2" />
          Subscription Streaming
        </h4>
        <div class="space-y-2">
          <a
            v-for="link in subscriptionServices" 
            :key="link.provider.id"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200 border border-blue-200 dark:border-blue-800"
          >
            <div class="flex items-center">
              <div class="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center mr-3 border">
                <img 
                  :src="link.provider.logo" 
                  :alt="link.provider.name"
                  class="w-8 h-8 object-contain"
                  @error="handleLogoError"
                />
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ link.provider.name }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ getProviderDescription(link.provider) }}
                </p>
                <div class="flex items-center mt-1">
                  <span v-for="region in link.region.slice(0, 3)" :key="region" 
                        class="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full mr-1">
                    {{ region }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center">
              <span class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center">
                Watch Now
                <ArrowTopRightOnSquareIcon class="w-4 h-4 ml-2" />
              </span>
            </div>
          </a>
        </div>
      </div>

      <!-- Rental/Purchase Services -->
      <div v-if="rentalServices.length > 0">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
          <CurrencyDollarIcon class="w-4 h-4 mr-2" />
          Rent or Buy
        </h4>
        <div class="space-y-2">
          <a
            v-for="link in rentalServices" 
            :key="link.provider.id"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all duration-200 border border-green-200 dark:border-green-800"
          >
            <div class="flex items-center">
              <div class="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center mr-3 border">
                <img 
                  :src="link.provider.logo" 
                  :alt="link.provider.name"
                  class="w-8 h-8 object-contain"
                  @error="handleLogoError"
                />
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ link.provider.name }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ getProviderDescription(link.provider) }}
                </p>
                <p v-if="link.provider.price" class="text-sm text-green-600 dark:text-green-400 font-medium">
                  From {{ link.provider.price.amount }}
                </p>
              </div>
            </div>
            
            <div class="flex items-center">
              <span class="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center">
                {{ link.provider.type === 'rent' ? 'Rent' : 'Buy' }}
                <ArrowTopRightOnSquareIcon class="w-4 h-4 ml-2" />
              </span>
            </div>
          </a>
        </div>
      </div>

      <!-- Search Note -->
      <div class="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <div class="flex items-start">
          <InformationCircleIcon class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
          <div class="text-sm">
            <p class="text-blue-800 dark:text-blue-200 font-medium mb-1">Search Results</p>
            <p class="text-blue-700 dark:text-blue-300">
              These links will search for "{{ displayTitle }}" on each platform. 
              Availability varies by region and licensing agreements.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-6">
      <TvIcon class="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Unable to find streaming links at the moment.
      </p>
      <div class="text-sm text-gray-500 space-y-2">
        <p>Try searching manually on these popular platforms:</p>
        <div class="flex flex-wrap justify-center gap-3 mt-3">
          <a 
            :href="`https://www.crunchyroll.com/search?q=${encodedTitle}`" 
            target="_blank" 
            class="flex items-center text-orange-600 hover:text-orange-700 hover:underline"
          >
            <img src="https://img.icons8.com/color/24/crunchyroll.png" class="w-4 h-4 mr-1" />
            Crunchyroll
          </a>
          <a 
            :href="`https://www.netflix.com/search?q=${encodedTitle}`" 
            target="_blank" 
            class="flex items-center text-red-600 hover:text-red-700 hover:underline"
          >
            <img src="https://img.icons8.com/color/24/netflix.png" class="w-4 h-4 mr-1" />
            Netflix
          </a>
          <a 
            :href="`https://www.primevideo.com/search?phrase=${encodedTitle}`" 
            target="_blank" 
            class="flex items-center text-blue-600 hover:text-blue-700 hover:underline"
          >
            <img src="https://img.icons8.com/color/24/amazon-prime-video.png" class="w-4 h-4 mr-1" />
            Prime Video
          </a>
          <a 
            :href="`https://www.funimation.com/search/?q=${encodedTitle}`" 
            target="_blank" 
            class="flex items-center text-purple-600 hover:text-purple-700 hover:underline"
          >
            <img src="https://img.icons8.com/color/24/funimation.png" class="w-4 h-4 mr-1" />
            Funimation
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  PlayCircleIcon, 
  TvIcon, 
  CurrencyDollarIcon,
  ArrowTopRightOnSquareIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'
import type { Anime } from '~/types/anime'

interface StreamingProvider {
  id: string
  name: string
  logo: string
  type: 'subscription' | 'rent' | 'buy' | 'free'
  price?: { amount: string; currency: string }
}

interface StreamingLink {
  provider: StreamingProvider
  url: string
  region: string[]
  quality: string[]
}

interface Props {
  anime: Anime
}

const props = defineProps<Props>()

// State
const loading = ref(false)
const error = ref<string | null>(null)
const streamingLinks = ref<StreamingLink[]>([])

// Computed
const displayTitle = computed(() => {
  return props.anime.title.english || props.anime.title.romaji
})

const encodedTitle = computed(() => {
  return encodeURIComponent(displayTitle.value)
})

const subscriptionServices = computed(() => {
  return streamingLinks.value.filter(link => link.provider.type === 'subscription')
})

const rentalServices = computed(() => {
  return streamingLinks.value.filter(link => ['rent', 'buy'].includes(link.provider.type))
})

// Methods
const getProviderDescription = (provider: StreamingProvider) => {
  switch (provider.id) {
    case 'crunchyroll':
      return 'Largest anime streaming library'
    case 'netflix':
      return 'Popular shows with dubs available'
    case 'prime-video':
      return 'Included with Prime membership'
    case 'disney-plus':
      return 'Family-friendly anime selection'
    case 'funimation':
      return 'English dubs and simulcasts'
    case 'hidive':
      return 'Niche and classic anime'
    case 'hulu':
      return 'Anime mixed with other content'
    case 'youtube':
      return 'Individual episode rentals'
    case 'apple-tv':
      return 'High-quality streaming'
    case 'vudu':
      return 'Digital purchases and rentals'
    default:
      return 'Streaming service'
  }
}

const handleLogoError = (event: Event) => {
  const img = event.target as HTMLImageElement
  // Replace with a generic icon if logo fails to load
  img.src = 'https://img.icons8.com/color/48/tv.png'
}

const fetchStreamingData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await $fetch<{
      success: boolean
      links: StreamingLink[]
      totalProviders: number
      note: string
      error?: string
    }>('/api/streaming', {
      query: {
        title: displayTitle.value,
        animeId: props.anime.id
      }
    })
    
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
