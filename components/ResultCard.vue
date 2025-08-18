<template>
  <div class="group cursor-pointer bg-gray-800 rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25">
    <!-- Background Image with Blur -->
    <div 
      class="h-auto bg-cover bg-center relative"
      :style="{ backgroundImage: `url(${currentImageUrl})` }"
    >
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40 group-hover:from-black/80 group-hover:via-black/60 group-hover:to-black/30 transition-all duration-300"></div>
      
      <!-- Content Container -->
      <div class="relative z-10 p-6">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Anime Cover (smaller, overlay style) -->
          <div class="flex-shrink-0 md:w-32">
            <div class="relative">
              <img
                :src="currentImageUrl"
                :alt="displayTitle"
                class="w-24 h-36 md:w-32 md:h-48 object-cover rounded-lg shadow-2xl border-2 border-white/20"
                loading="lazy"
                @error="handleImageError"
              />
              
              <!-- Loading overlay for Fandom image -->
              <div v-if="loadingFandomImage" class="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
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
              <h3 class="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                {{ displayTitle }}
              </h3>
              
              <!-- Alternative Title -->
              <p v-if="alternativeTitle" class="text-gray-300 text-sm mb-2">
                {{ alternativeTitle }}
              </p>

              <!-- Basic Info -->
              <div class="flex flex-wrap gap-4 text-sm text-gray-300 mb-4">
                <span v-if="match.anime.seasonYear" class="flex items-center bg-white/10 px-2 py-1 rounded">
                  <CalendarIcon class="w-4 h-4 mr-1" />
                  {{ match.anime.seasonYear }}
                </span>
                <span v-if="match.anime.episodes" class="flex items-center bg-white/10 px-2 py-1 rounded">
                  <PlayIcon class="w-4 h-4 mr-1" />
                  {{ match.anime.episodes }} episodes
                </span>
                <span v-if="match.anime.averageScore" class="flex items-center bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
                  <StarIcon class="w-4 h-4 mr-1 fill-current" />
                  {{ match.anime.averageScore }}%
                </span>
                <span class="flex items-center bg-white/10 px-2 py-1 rounded">
                  <FilmIcon class="w-4 h-4 mr-1" />
                  {{ match.anime.format }}
                </span>
              </div>

              <!-- Match Reasoning -->
              <div class="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 p-4 rounded-lg mb-4">
                <h4 class="font-semibold text-blue-200 mb-2 flex items-center">
                  <LightBulbIcon class="w-4 h-4 mr-2" />
                  Why this matches:
                </h4>
                <p class="text-blue-100 text-sm">
                  {{ match.reasoning }}
                </p>
                
                <!-- Matched Elements -->
                <div v-if="match.matchedElements.length" class="mt-3">
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="element in match.matchedElements" 
                      :key="element"
                      class="px-2 py-1 bg-blue-400/30 text-blue-100 text-xs rounded-full border border-blue-400/40"
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
                    class="px-3 py-1 bg-purple-500/30 text-purple-200 text-sm rounded-full border border-purple-400/40"
                  >
                    {{ genre }}
                  </span>
                </div>
              </div>

              <!-- Description -->
              <div v-if="match.anime.description" class="mb-6">
                <p class="text-gray-200 text-sm leading-relaxed line-clamp-3">
                  {{ truncatedDescription }}
                </p>
                <button 
                  v-if="match.anime.description.length > 200"
                  @click="showFullDescription = !showFullDescription"
                  class="text-blue-300 hover:text-blue-200 text-sm hover:underline mt-2 transition-colors"
                >
                  {{ showFullDescription ? 'Show less' : 'Read more' }}
                </button>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-3">
              <button
                @click="$emit('view-details', match.anime)"
                class="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center shadow-lg hover:shadow-blue-500/25"
              >
                <EyeIcon class="w-4 h-4 mr-2" />
                View Details
              </button>
              
              <a
                :href="`https://www.crunchyroll.com/search?q=${encodedTitle}&ref=animefinder`"
                target="_blank"
                rel="noopener noreferrer"
                class="bg-orange-600 hover:bg-orange-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center shadow-lg hover:shadow-orange-500/25"
              >
                <PlayIcon class="w-4 h-4 mr-2" />
                Find on Crunchyroll
              </a>
              
              <a
                v-if="fandomUrl"
                :href="`${fandomUrl}?ref=animefinder`"
                target="_blank"
                rel="noopener noreferrer"
                class="bg-purple-600 hover:bg-purple-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center shadow-lg hover:shadow-purple-500/25"
              >
                <DocumentTextIcon class="w-4 h-4 mr-2" />
                Wiki
              </a>
              
              <button
                @click="findStreamingOptions"
                class="bg-green-600 hover:bg-green-500 disabled:bg-gray-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center shadow-lg hover:shadow-green-500/25"
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
        <div v-if="match.episode" class="mt-6 p-3 bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-lg">
          <p class="text-yellow-100 text-sm">
            <strong>Specific Episode:</strong> Episode {{ match.episode }}
            <span v-if="match.timestamp"> at {{ match.timestamp }}</span>
          </p>
        </div>
      </div>

      <!-- Hover Play Icon -->
      <div class="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
          <PlayIcon class="w-6 h-6 text-white" />
        </div>
      </div>
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
