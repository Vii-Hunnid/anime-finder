<template>
  <div class="min-h-screen gradient-bg">
    <Header />
    
    <main class="container mx-auto px-4 py-8">
      <!-- Hero Section -->
      <section class="text-center mb-12">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          <span class="text-gradient">Anime Finder</span>
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
      <HowItWorks v-if="!hasSearched" class="mb-12" />

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
          <div class="grid md:grid-cols-2 gap-6 mt-8">
            <StreamingLinks 
              v-if="selectedAnime"
              :anime="selectedAnime"
            />
            
            <FandomLinks 
              v-if="selectedAnime"
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
            class="btn-primary"
          >
            Try Another Search
          </button>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import type { IdentificationRequest, IdentificationResponse, ProcessingStatus } from '~/types/identification'
import type { Anime } from '~/types/anime'

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

// Composables
const { identify } = useAnimeIdentify()

// Methods
const handleSearch = async (description: string) => {
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
    
    const request: IdentificationRequest = {
      description: description.trim()
    }
    
    const results = await identify(request)
    
    updateSearchStatus('matching', 'Finding best matches...', 75)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    updateSearchStatus('complete', 'Search complete!', 100)
    
    searchResults.value = results
    
    // Auto-select first match if confidence is high
    if (results.matches.length > 0 && results.matches[0].confidence > 0.8) {
      selectedAnime.value = results.matches[0].anime
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