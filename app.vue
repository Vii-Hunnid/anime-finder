<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Header -->
    <header class="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Anime Finder
          </h1>
        </div>
        <nav class="hidden md:flex items-center space-x-6">
          <a href="#how-it-works" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            How it Works
          </a>
          <a href="#about" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            About
          </a>
        </nav>
      </div>
    </header>
    
    <main class="container mx-auto px-4 py-8">
      <!-- Hero Section -->
      <section class="text-center mb-12">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Anime Finder
          </span>
        </h1>
        <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Describe any anime scene and instantly discover what show it's from using AI-powered recognition
        </p>
        
        <!-- Search Form -->
        <SearchForm 
          @search="handleSearch"
          :loading="isSearching"
          class="mb-8"
        />
      </section>

      <!-- How It Works -->
      <HowItWorks v-if="!hasSearched" id="how-it-works" class="mb-12" />

      <!-- Search Results -->
      <section v-if="hasSearched" class="mb-12">
        <LoadingSpinner v-if="isSearching" :status="searchStatus" />
        
        <ErrorMessage 
          v-else-if="error" 
          :message="error" 
          @retry="retrySearch"
        />
        
        <div v-else-if="searchResults?.matches?.length" class="space-y-8">
          <h2 class="text-2xl font-bold text-center mb-6">Found Matches</h2>
          
          <div class="grid gap-6">
            <ResultCard 
              v-for="match in searchResults.matches" 
              :key="match.anime.id"
              :match="match"
              @view-details="viewAnimeDetails"
            />
          </div>

          <!-- Additional Info -->
          <div v-if="selectedAnime" class="grid md:grid-cols-2 gap-6 mt-8">
            <StreamingLinks 
              :anime="selectedAnime"
            />
            
            <FandomLinks 
              :anime="selectedAnime"
            />
          </div>

          <!-- Recommendations -->
          <RecommendationGrid 
            v-if="selectedAnime"
            :based-on="selectedAnime"
            class="mt-12"
          />
        </div>
        
        <div v-else-if="!isSearching" class="text-center py-12">
          <p class="text-xl text-gray-600 dark:text-gray-400 mb-4">
            No matches found for your description.
          </p>
          <p class="text-gray-500 dark:text-gray-500 mb-6">
            Try being more specific about visual elements, characters, or memorable scenes.
          </p>
          <button 
            @click="clearSearch" 
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Try Another Search
          </button>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div class="container mx-auto px-4 py-8">
        <div class="text-center">
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Powered by AI to help anime fans find their favorite shows
          </p>
          <div class="flex justify-center space-x-6 text-sm text-gray-500 dark:text-gray-500">
            <a href="#" class="hover:text-blue-600 dark:hover:text-blue-400">Privacy</a>
            <a href="#" class="hover:text-blue-600 dark:hover:text-blue-400">Terms</a>
            <a href="#" class="hover:text-blue-600 dark:hover:text-blue-400">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Import components
import SearchForm from '~/components/SearchForm.vue'
import ResultCard from '~/components/ResultCard.vue'
import StreamingLinks from '~/components/StreamingLinks.vue'
import FandomLinks from '~/components/FandomLinks.vue'
import RecommendationGrid from '~/components/RecommendationGrid.vue'
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import ErrorMessage from '~/components/ErrorMessage.vue'
import HowItWorks from '~/components/HowItWorks.vue'

// Types
interface Anime {
  id: string
  title: {
    english?: string
    romaji: string
  }
  description?: string
  coverImage: {
    large: string
    medium: string
  }
  genres: string[]
  episodes?: number
  seasonYear?: number
  averageScore?: number
  status: string
  format: string
  studios: Array<{ name: string }>
  tags?: Array<{ name: string }>
  siteUrl: string
  source: string
}

interface SceneMatch {
  anime: Anime
  confidence: number
  reasoning: string
  episode?: number
  timestamp?: string
  matchedElements: string[]
}

interface IdentificationResponse {
  matches: SceneMatch[]
  searchQuery: string
  processingTime: number
}

interface ProcessingStatus {
  stage: 'analyzing' | 'searching' | 'matching' | 'complete' | 'error'
  message: string
  progress: number
}

// State
const isSearching = ref(false)
const hasSearched = ref(false)
const searchResults = ref<IdentificationResponse | null>(null)
const selectedAnime = ref<Anime | null>(null)
const error = ref<string | null>(null)
const searchStatus = ref<ProcessingStatus>({
  stage: 'analyzing',
  message: 'Starting analysis...',
  progress: 0
})

// Last search query for retry functionality
const lastSearchQuery = ref<string>('')

// Import the real useAnimeIdentify composable instead of the mock one
const { identify } = useAnimeIdentify()

// Force light mode on app initialization
onMounted(() => {
  // Ensure light mode on mount
  if (process.client) {
    document.documentElement.classList.remove('dark')
    // Only set localStorage if it doesn't exist
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'light')
    }
  }
})

// Methods
const handleSearch = async (description: string, filters?: any) => {
  if (!description.trim()) return
  
  isSearching.value = true
  hasSearched.value = true
  error.value = null
  searchResults.value = null
  selectedAnime.value = null
  lastSearchQuery.value = description
  
  try {
    // Update search status
    updateSearchStatus('analyzing', 'Analyzing your scene description...', 25)
    await new Promise(resolve => setTimeout(resolve, 500)) // UI feedback
    
    updateSearchStatus('searching', 'Searching anime database...', 50)
    
    // Use the real API with proper request format
    const request: IdentificationRequest = {
      description: description.trim(),
      additionalInfo: filters
    }
    
    const results = await identify(request)
    
    updateSearchStatus('matching', 'Finding best matches...', 75)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    updateSearchStatus('complete', 'Search complete!', 100)
    
    // Convert the API response to the expected format
    const convertedResults: IdentificationResponse = {
      matches: results.matches || [],
      searchQuery: description,
      processingTime: results.searchTime || 2000
    }
    
    searchResults.value = convertedResults
    
    // Auto-select first match if confidence is high
    if (convertedResults.matches.length > 0 && convertedResults.matches[0].confidence > 0.8) {
      selectedAnime.value = convertedResults.matches[0].anime
    }
    
  } catch (err) {
    console.error('Search error:', err)
    error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
    updateSearchStatus('error', 'Search failed', 0)
  } finally {
    isSearching.value = false
  }
}

const updateSearchStatus = (stage: ProcessingStatus['stage'], message: string, progress: number) => {
  searchStatus.value = { stage, message, progress }
}

const viewAnimeDetails = (anime: Anime) => {
  selectedAnime.value = anime
  
  // Smooth scroll to additional info section
  nextTick(() => {
    const element = document.querySelector('.additional-info')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

const retrySearch = () => {
  if (lastSearchQuery.value) {
    handleSearch(lastSearchQuery.value)
  }
}

const clearSearch = () => {
  hasSearched.value = false
  searchResults.value = null
  selectedAnime.value = null
  error.value = null
  lastSearchQuery.value = ''
}

// SEO
useHead({
  title: 'Anime Finder - AI Scene Identification',
  meta: [
    { name: 'description', content: 'Describe any anime scene and instantly discover what anime it\'s from using AI-powered recognition.' }
  ]
})
</script>
