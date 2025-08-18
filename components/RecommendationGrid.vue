<template>
    <section class="mt-12">
      <h2 class="text-2xl font-bold text-center mb-8">
        More Anime Like <span class="text-gradient">{{ displayTitle }}</span>
      </h2>
  
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Finding similar anime...</p>
      </div>
  
      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
        <button @click="fetchRecommendations" class="btn-primary">
          Try Again
        </button>
      </div>
  
      <div v-else-if="recommendations.length > 0" class="space-y-6">
        <!-- AI Recommendations -->
        <div v-if="aiRecommendations.length > 0">
          <h3 class="text-lg font-semibold mb-4 flex items-center">
            <SparklesIcon class="w-5 h-5 mr-2 text-purple-600" />
            AI Recommendations
            <span class="ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-full">
              Powered by AI
            </span>
          </h3>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div 
              v-for="rec in aiRecommendations.slice(0, 6)"
              :key="rec.title"
              class="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800"
            >
              <h4 class="font-semibold text-purple-900 dark:text-purple-200 mb-2">{{ rec.title }}</h4>
              <p class="text-sm text-purple-700 dark:text-purple-300 mb-3">{{ rec.reasoning }}</p>
              
              <div class="flex items-center justify-between">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="genre in rec.genres?.slice(0, 2)" 
                    :key="genre"
                    class="px-2 py-1 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-xs rounded-full"
                  >
                    {{ genre }}
                  </span>
                </div>
                <div class="flex items-center text-sm text-purple-600 dark:text-purple-400">
                  <StarIcon class="w-4 h-4 mr-1" />
                  {{ Math.round(rec.confidence * 100) }}%
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Database Recommendations -->
        <div v-if="similarAnime.length > 0">
          <h3 class="text-lg font-semibold mb-4 flex items-center">
            <HeartIcon class="w-5 h-5 mr-2 text-red-600" />
            Similar Anime
          </h3>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              v-for="anime in similarAnime.slice(0, 8)"
              :key="anime.id"
              class="card p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
              @click="$emit('anime-selected', anime)"
            >
              <img
                :src="anime.coverImage.medium"
                :alt="anime.title.romaji"
                class="w-full h-48 object-cover rounded-lg mb-3"
                loading="lazy"
              />
              
              <h4 class="font-medium text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
                {{ anime.title.english || anime.title.romaji }}
              </h4>
              
              <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                <span v-if="anime.seasonYear">{{ anime.seasonYear }}</span>
                <span v-if="anime.averageScore" class="flex items-center">
                  <StarIcon class="w-3 h-3 mr-1" />
                  {{ anime.averageScore }}%
                </span>
              </div>
              
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="genre in anime.genres.slice(0, 2)" 
                  :key="genre"
                  class="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                >
                  {{ genre }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div v-else class="text-center py-8">
        <HeartIcon class="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p class="text-gray-600 dark:text-gray-400">
          No recommendations available at the moment.
        </p>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { SparklesIcon, HeartIcon, StarIcon } from '@heroicons/vue/24/outline'
  import type { Anime } from '~/types/anime'
  
  interface Props {
    basedOn: Anime
  }
  
  interface AIRecommendation {
    title: string
    reasoning: string
    confidence: number
    genres: string[]
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits<{
    'anime-selected': [anime: Anime]
  }>()
  
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)
  const aiRecommendations = ref<AIRecommendation[]>([])
  const similarAnime = ref<Anime[]>([])
  
  // Computed
  const displayTitle = computed(() => {
    return props.basedOn.title.english || props.basedOn.title.romaji
  })
  
  const recommendations = computed(() => {
    return [...aiRecommendations.value, ...similarAnime.value]
  })
  
  // Methods
  const fetchRecommendations = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Fetch AI recommendations
      const aiResponse = await $fetch<{
        success: boolean
        recommendations: AIRecommendation[]
        error?: string
      }>('/api/recommend', {
        query: {
          animeId: props.basedOn.id,
          title: displayTitle.value,
          genres: props.basedOn.genres.join(',')
        }
      })
  
      if (aiResponse.success) {
        aiRecommendations.value = aiResponse.recommendations
      }
  
      // Fetch similar anime from database
      const { searchByGenreAndTags } = useAniList()
      const similar = await searchByGenreAndTags(
        props.basedOn.genres.slice(0, 3),
        props.basedOn.tags?.slice(0, 2).map(tag => tag.name) || [],
        { perPage: 12 }
      )
  
      // Filter out the original anime
      similarAnime.value = similar.filter(anime => anime.id !== props.basedOn.id)
  
    } catch (err) {
      console.error('Recommendations error:', err)
      error.value = 'Failed to fetch recommendations'
    } finally {
      loading.value = false
    }
  }
  
  // Composable for AniList (simplified version)
  const useAniList = () => {
    const searchByGenreAndTags = async (genres: string[], tags: string[], options: any) => {
      // This would use the actual AniList client
      // For now, return empty array as placeholder
      return []
    }
    
    return { searchByGenreAndTags }
  }
  
  // Fetch recommendations when component mounts or anime changes
  watch(() => props.basedOn.id, fetchRecommendations, { immediate: true })
  </script>
  
  <style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  </style>