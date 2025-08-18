<template>
  <div class="card p-6">
    <h3 class="text-xl font-semibold mb-4 flex items-center">
      <BookOpenIcon class="w-6 h-6 mr-2 text-purple-600" />
      Learn More
    </h3>

    <div v-if="loading" class="text-center py-4">
      <div class="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Finding additional resources...</p>
    </div>

    <div v-else class="space-y-4">
      <!-- Fandom Community Section -->
      <div v-if="fandomData">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3">Community & Wiki</h4>
        
        <div class="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <!-- Fandom Preview Image -->
          <div v-if="fandomData.imageUrl" class="mb-4">
            <img
              :src="fandomData.imageUrl"
              :alt="`${displayTitle} on Fandom`"
              class="w-full h-32 object-cover rounded-lg"
              loading="lazy"
              @error="handleImageError"
            />
          </div>
          
          <div class="flex items-start">
            <div class="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <DocumentTextIcon class="w-6 h-6 text-white" />
            </div>
            
            <div class="flex-1">
              <h5 class="font-semibold text-green-900 dark:text-green-200 mb-2">
                {{ displayTitle }} Wiki
              </h5>
              <p class="text-green-700 dark:text-green-300 text-sm mb-3">
                Discover detailed character profiles, episode guides, trivia, and community discussions. 
                The Fandom wiki is your go-to source for comprehensive information about this anime.
              </p>
              
              <a
                :href="fandomData.fandomUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <ArrowTopRightOnSquareIcon class="w-4 h-4 mr-2" />
                Visit {{ displayTitle }} Wiki
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Official Streaming & Purchase Links -->
      <div>
        <h4 class="font-medium text-gray-900 dark:text-white mb-3">Official Sources</h4>
        <div class="space-y-3">
          
          <!-- Crunchyroll -->
          <a
            :href="`https://www.crunchyroll.com/search?q=${encodedTitle}&ref=animefinder`"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
          >
            <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
              <PlayIcon class="w-6 h-6 text-white" />
            </div>
            <div class="flex-1">
              <p class="font-medium text-orange-900 dark:text-orange-200">Crunchyroll</p>
              <p class="text-sm text-orange-700 dark:text-orange-300">Stream anime legally with subtitles</p>
            </div>
            <ArrowTopRightOnSquareIcon class="w-4 h-4 text-orange-600" />
          </a>

          <!-- Netflix -->
          <a
            :href="`https://www.netflix.com/search?q=${encodedTitle}&ref=animefinder`"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center p-3 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            <div class="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-3">
              <FilmIcon class="w-6 h-6 text-white" />
            </div>
            <div class="flex-1">
              <p class="font-medium text-red-900 dark:text-red-200">Netflix</p>
              <p class="text-sm text-red-700 dark:text-red-300">Global streaming platform</p>
            </div>
            <ArrowTopRightOnSquareIcon class="w-4 h-4 text-red-600" />
          </a>

          <!-- Amazon Prime Video -->
          <a
            :href="`https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodedTitle}&ref=animefinder`"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <TvIcon class="w-6 h-6 text-white" />
            </div>
            <div class="flex-1">
              <p class="font-medium text-blue-900 dark:text-blue-200">Amazon Prime Video</p>
              <p class="text-sm text-blue-700 dark:text-blue-300">Stream or rent episodes</p>
            </div>
            <ArrowTopRightOnSquareIcon class="w-4 h-4 text-blue-600" />
          </a>

          <!-- Fandom Link -->
          <a
            v-if="fandomData?.fandomUrl"
            :href="`${fandomData.fandomUrl}?ref=animefinder`"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
          >
            <div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
              <DocumentTextIcon class="w-6 h-6 text-white" />
            </div>
            <div class="flex-1">
              <p class="font-medium text-purple-900 dark:text-purple-200">Fandom Wiki</p>
              <p class="text-sm text-purple-700 dark:text-purple-300">Complete anime database & community</p>
            </div>
            <ArrowTopRightOnSquareIcon class="w-4 h-4 text-purple-600" />
          </a>

        </div>
      </div>

      <!-- Quick Stats -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3">Quick Stats</h4>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-gray-600 dark:text-gray-400">Episodes</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ anime.episodes || 'Unknown' }}</p>
          </div>
          <div>
            <p class="text-gray-600 dark:text-gray-400">Status</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ formatStatus(anime.status) }}</p>
          </div>
          <div>
            <p class="text-gray-600 dark:text-gray-400">Score</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ anime.averageScore || 'N/A' }}%</p>
          </div>
          <div>
            <p class="text-gray-600 dark:text-gray-400">Year</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ anime.seasonYear || 'Unknown' }}</p>
          </div>
        </div>
      </div>

      <!-- Studios -->
      <div v-if="anime.studios?.length > 0" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-2">Studio</h4>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="studio in anime.studios.slice(0, 3)"
            :key="studio.name"
            class="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 text-sm rounded-full"
          >
            {{ studio.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  BookOpenIcon, 
  DocumentTextIcon, 
  ArrowTopRightOnSquareIcon,
  PlayIcon,
  FilmIcon,
  TvIcon
} from '@heroicons/vue/24/outline'
import type { Anime } from '~/types/anime'

interface Props {
  anime: Anime
}

interface FandomData {
  success: boolean
  imageUrl?: string
  source: string
  wiki: string
  pageTitle?: string
  fandomUrl: string
}

const props = defineProps<Props>()

// State
const loading = ref(false)
const fandomData = ref<FandomData | null>(null)

// Computed
const displayTitle = computed(() => {
  return props.anime.title.english || props.anime.title.romaji
})

const encodedTitle = computed(() => {
  return encodeURIComponent(displayTitle.value)
})

// Methods
const formatStatus = (status: string) => {
  switch (status) {
    case 'FINISHED': return 'Finished'
    case 'RELEASING': return 'Airing'
    case 'NOT_YET_RELEASED': return 'Upcoming'
    case 'CANCELLED': return 'Cancelled'
    default: return status
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

const fetchFandomData = async () => {
  loading.value = true
  
  try {
    const response = await $fetch<FandomData>('/api/fandom', {
      query: {
        title: displayTitle.value
      }
    })
    
    if (response.success) {
      fandomData.value = response
    } else {
      // Fallback fandom URL
      fandomData.value = {
        success: true,
        source: 'fandom',
        wiki: 'anime.fandom.com',
        fandomUrl: `https://anime.fandom.com/wiki/Special:Search?query=${encodedTitle.value}`
      }
    }

  } catch (error) {
    console.error('Error fetching Fandom data:', error)
    // Provide fallback
    fandomData.value = {
      success: false,
      source: 'fandom',
      wiki: 'anime.fandom.com',
      fandomUrl: `https://anime.fandom.com/wiki/Special:Search?query=${encodedTitle.value}`
    }
  } finally {
    loading.value = false
  }
}

// Fetch data when anime changes
watch(() => props.anime.id, fetchFandomData, { immediate: true })
</script>
