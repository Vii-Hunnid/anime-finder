<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Anime Finder
          </h1>
          <button 
            @click="toggleDark"
            class="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <svg v-if="isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
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
        <div class="max-w-4xl mx-auto mb-8">
          <form @submit.prevent="handleSearch" class="space-y-6">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div class="relative">
                <textarea
                  v-model="description"
                  :disabled="isSearching"
                  placeholder="Describe the anime scene you remember... (e.g., 'A blonde-haired character fights a giant humanoid creature on top of a wall')"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 min-h-32 resize-none text-lg"
                  rows="4"
                  maxlength="1000"
                />
                <div class="absolute bottom-3 right-3 text-sm text-gray-400">
                  {{ description.length }}/1000
                </div>
              </div>

              <button
                type="submit"
                :disabled="!description.trim() || isSearching"
                class="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center"
              >
                <svg v-if="!isSearching" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {{ isSearching ? 'Searching...' : 'Find My Anime' }}
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- Loading State -->
      <section v-if="isSearching" class="text-center py-12">
        <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-lg text-gray-600 dark:text-gray-400">{{ searchStatus }}</p>
        <div class="max-w-md mx-auto mt-4">
          <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>
      </section>

      <!-- Results -->
      <section v-if="searchResults && !isSearching" class="mb-12">
        <h2 class="text-2xl font-bold text-center mb-6">Search Results</h2>
        
        <div v-if="searchResults.success" class="space-y-6">
          <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <div class="flex items-center mb-2">
              <svg class="w-6 h-6 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <h3 class="text-lg font-semibold text-green-800 dark:text-green-200">
                Search Completed Successfully
              </h3>
            </div>
            <p class="text-green-700 dark:text-green-300">
              Found {{ searchResults.matches?.length || 0 }} potential matches.
            </p>
            <p class="text-sm text-green-600 dark:text-green-400 mt-2">
              Search took {{ searchResults.searchTime }}ms
            </p>
          </div>
          
          <div v-if="searchResults.matches?.length" class="grid gap-4">
            <div 
              v-for="(match, index) in searchResults.matches" 
              :key="index"
              class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-200"
            >
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-semibold text-lg">{{ match.anime?.title || `Anime Result ${index + 1}` }}</h4>
                <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                  {{ Math.round(match.confidence * 100) }}% match
                </span>
              </div>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {{ match.reasoning }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="element in match.matchedElements" 
                  :key="element"
                  class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                >
                  {{ element }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div class="flex items-center mb-2">
            <svg class="w-6 h-6 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <h3 class="text-lg font-semibold text-red-800 dark:text-red-200">
              Search Failed
            </h3>
          </div>
          <p class="text-red-700 dark:text-red-300">
            {{ searchResults.error || 'Unknown error occurred' }}
          </p>
          <button 
            @click="retrySearch"
            class="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>

      <!-- How It Works -->
      <section v-if="!hasSearched" class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">How It Works</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Describe</h3>
            <p class="text-gray-600 dark:text-gray-400">Tell us what you remember about the anime scene</p>
          </div>
          <div class="text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">AI Analysis</h3>
            <p class="text-gray-600 dark:text-gray-400">Our AI searches through thousands of anime</p>
          </div>
          <div class="text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Find Results</h3>
            <p class="text-gray-600 dark:text-gray-400">Get ranked matches with confidence scores</p>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-16">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; 2024 Anime Finder. Built with care for the anime community.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// State
const description = ref('')
const isSearching = ref(false)
const hasSearched = ref(false)
const searchResults = ref(null)
const searchStatus = ref('Starting search...')
const progress = ref(0)
const isDark = ref(false)

// Composable
const { identify, validateDescription } = useAnimeIdentify()

// Dark mode toggle
const toggleDark = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Search handler
const handleSearch = async () => {
  if (!description.value.trim()) return
  
  const validation = validateDescription(description.value)
  if (!validation.valid) {
    alert(validation.message)
    return
  }
  
  isSearching.value = true
  hasSearched.value = true
  searchResults.value = null
  progress.value = 0
  
  try {
    searchStatus.value = 'Analyzing scene description...'
    progress.value = 25
    await new Promise(resolve => setTimeout(resolve, 800))
    
    searchStatus.value = 'Searching anime database...'
    progress.value = 50
    await new Promise(resolve => setTimeout(resolve, 800))
    
    searchStatus.value = 'Processing results...'
    progress.value = 75
    
    const results = await identify({ description: description.value })
    
    progress.value = 100
    searchStatus.value = 'Search complete!'
    
    searchResults.value = results
    
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = {
      success: false,
      error: error.message || 'Search failed'
    }
  } finally {
    isSearching.value = false
    progress.value = 0
  }
}

const retrySearch = () => {
  if (description.value.trim()) {
    handleSearch()
  }
}

// SEO
useHead({
  title: 'Anime Finder - AI Scene Identification',
  meta: [
    { name: 'description', content: 'Describe any anime scene and instantly discover what anime it\'s from using AI-powered recognition.' }
  ]
})
</script>
