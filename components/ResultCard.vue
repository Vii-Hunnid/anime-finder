<template>
  <div class="card p-6 hover:shadow-xl transition-all duration-300">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Anime Cover with Fandom Fallback -->
      <div class="flex-shrink-0">
        <div class="relative">
          <img
            :src="currentImageUrl"
            :alt="displayTitle"
            class="w-32 h-48 md:w-40 md:h-60 object-cover rounded-lg shadow-md"
            loading="lazy"
            @error="handleImageError"
          />
          
          <!-- Loading overlay for Fandom image -->
          <div v-if="loadingFandomImage" class="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
            <div class="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
          </div>
          
          <!-- Confidence Badge -->
          <div 
            :class="[
              'absolute -top-2 -right-2 px-3 py-1 rounded-full text-sm font-bold text-white shadow-lg',
              confidenceColor
            ]"
          >
            {{ Math.round(match.confidence * 100) }}%
          </div>
        </div>
      </div>

      <!-- Anime Details -->
      <div class="flex-1 min-w-0">
        <div class="mb-4">
          <!-- Title -->
          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {{ displayTitle }}
          </h3>
          
          <!-- Alternative Title -->
          <p v-if="alternativeTitle" class="text-gray-600 dark:text-gray-400 text-sm mb-2">
            {{ alternativeTitle }}
          </p>

          <!-- Basic Info -->
          <div class="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <span v-if="match.anime.seasonYear" class="flex items-center">
              <CalendarIcon class="w-4 h-4 mr-1" />
              {{ match.anime.seasonYear }}
            </span>
            <span v-if="match.anime.episodes" class="flex items-center">
              <PlayIcon class="w-4 h-4 mr-1" />
              {{ match.anime.episodes }} episodes
            </span>
            <span v-if="match.anime.averageScore" class="flex items-center">
              <StarIcon class="w-4 h-4 mr-1" />
              {{ match.anime.averageScore }}%
            </span>
            <span class="flex items-center">
              <FilmIcon class="w-4 h-4 mr-1" />
              {{ match.anime.format }}
            </span>
          </div>

          <!-- Match Reasoning -->
          <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-4">
            <h4 class="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center">
              <LightBulbIcon class="w-4 h-4 mr-2" />
              Why this matches:
            </h4>
            <p class="text-blue-800 dark:text-blue-300 text-sm">
              {{ match.reasoning }}
            </p>
            
            <!-- Matched Elements -->
            <div v-if="match.matchedElements.length" class="mt-3">
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="element in match.matchedElements" 
                  :key="element"
                  class="px-2 py-1 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                >
                  {{ element }}
                </span>
              </div>
            </div>
          </div>

          <!-- Genres -->
          <div v-if="match.anime.genres.length" class="mb-4">
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="genre in match.anime.genres.slice(0, 5)" 
                :key="genre"
                class="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full"
              >
                {{ genre }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <div v-if="match.anime.description" class="mb-4">
            <p class="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
              {{ truncatedDescription }}
            </p>
            <button 
              v-if="match.anime.description.length > 200"
              @click="showFullDescription = !showFullDescription"
              class="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-1"
            >
              {{ showFullDescription ? 'Show less' : 'Read more' }}
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-3">
          <button
            @click="$emit('view-details', match.anime)"
            class="btn-primary flex items-center"
          >
            <EyeIcon class="w-4 h-4 mr-2" />
            View Details
          </button>
          
          <a
            :href="`https://www.crunchyroll.com/search?q=${encodedTitle}&ref=animefinder`"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-secondary flex items-center"
          >
            <PlayIcon class="w-4 h-4 mr-2" />
            Find on Crunchyroll
          </a>
          
          <a
            v-if="fandomUrl"
            :href="`${fandomUrl}?ref=animefinder`"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-secondary flex items-center"
          >
            <DocumentTextIcon class="w-4 h-4 mr-2" />
            Wiki
          </a>
          
          <button
            @click="findStreamingOptions"
            class="btn-secondary flex items-center"
            :disabled="loadingStreaming"
          >
            <PlayCircleIcon class="w-4 h-4 mr-2" />
            <span v-if="!loadingStreaming">Where to Watch</span>
            <span v-else>Loading...</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Episode Info (if available) -->
    <div v-if="match.episode" class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border-l-4 border-yellow-400">
      <p class="text-yellow-800 dark:text-yellow-200 text-sm">
        <strong>Specific Episode:</strong> Episode {{ match.episode }}
        <span v-if="match.timestamp"> at {{ match.timestamp }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  CalendarIcon, 
  PlayIcon, 
  StarIcon, 
  FilmIcon,
  LightBulbIcon,
  EyeIcon,
  PlayCircleIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'
import type { SceneMatch } from '~/types/anime'

interface Props {
  match: SceneMatch
}

interface FandomData {
  success: boolean
  imageUrl?: string
  fandomUrl: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'view-details': [anime: any]
}>()

// State
const showFullDescription = ref(false)
const loadingStreaming = ref(false)
const loadingFandomImage = ref(false)
const fandomImageUrl = ref<string | null>(null)
const fandomUrl = ref<string | null>(null)

// Computed
const displayTitle = computed(() => {
  return props.match.anime.title.english || props.match.anime.title.romaji
})

const encodedTitle = computed(() => {
  return encodeURIComponent(displayTitle.value)
})

const alternativeTitle = computed(() => {
  if (props.match.anime.title.english && props.match.anime.title.romaji !== props.match.anime.title.english) {
    return props.match.anime.title.romaji
  }
  return null
})

const currentImageUrl = computed(() => {
  return fandomImageUrl.value || props.match.anime.coverImage.large
})

const truncatedDescription = computed(() => {
  if (!props.match.anime.description) return ''
  
  if (showFullDescription.value) {
    return props.match.anime.description
  }
  
  return props.match.anime.description.length > 200 
    ? props.match.anime.description.substring(0, 200) + '...'
    : props.match.anime.description
})

const confidenceColor = computed(() => {
  const confidence = props.match.confidence
  if (confidence >= 0.8) return 'bg-green-500'
  if (confidence >= 0.6) return 'bg-yellow-500'
  return 'bg-orange-500'
})

// Methods
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  // Fallback to original cover image if Fandom image fails
  if (img.src !== props.match.anime.coverImage.large) {
    img.src = props.match.anime.coverImage.large
  }
}

const fetchFandomImage = async () => {
  loadingFandomImage.value = true
  
  try {
    const response = await $fetch<FandomData>('/api/fandom', {
      query: {
        title: displayTitle.value
      }
    })
    
    if (response.success) {
      if (response.imageUrl) {
        fandomImageUrl.value = response.imageUrl
      }
      fandomUrl.value = response.fandomUrl
    }
  } catch (error) {
    console.error('Error fetching Fandom image:', error)
    // Set fallback fandom URL
    fandomUrl.value = `https://anime.fandom.com/wiki/Special:Search?query=${encodedTitle.value}`
  } finally {
    loadingFandomImage.value = false
  }
}

const findStreamingOptions = async () => {
  loadingStreaming.value = true
  try {
    emit('view-details', props.match.anime)
  } catch (error) {
    console.error('Error finding streaming options:', error)
  } finally {
    loadingStreaming.value = false
  }
}

// Fetch Fandom data when component mounts
onMounted(() => {
  fetchFandomImage()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
