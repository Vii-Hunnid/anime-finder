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
        <!-- Official Links -->
        <div>
          <h4 class="font-medium text-gray-900 dark:text-white mb-3">Official Sources</h4>
          <div class="space-y-2">
            <a
              :href="anime.siteUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              <GlobeAltIcon class="w-5 h-5 mr-3 text-blue-600" />
              <div>
                <p class="font-medium text-blue-900 dark:text-blue-200">AniList Page</p>
                <p class="text-sm text-blue-700 dark:text-blue-300">Official database entry</p>
              </div>
              <ArrowTopRightOnSquareIcon class="w-4 h-4 ml-auto text-blue-600" />
            </a>
          </div>
        </div>
  
        <!-- Wiki Links -->
        <div v-if="wikiLinks.length > 0">
          <h4 class="font-medium text-gray-900 dark:text-white mb-3">Wiki & Community</h4>
          <div class="space-y-2">
            <a
              v-for="wiki in wikiLinks"
              :key="wiki.url"
              :href="wiki.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
            >
              <DocumentTextIcon class="w-5 h-5 mr-3 text-green-600" />
              <div>
                <p class="font-medium text-green-900 dark:text-green-200">{{ wiki.title }}</p>
                <p class="text-sm text-green-700 dark:text-green-300">{{ wiki.description }}</p>
              </div>
              <ArrowTopRightOnSquareIcon class="w-4 h-4 ml-auto text-green-600" />
            </a>
          </div>
        </div>
  
        <!-- Manga/Source Material -->
        <div v-if="sourceLinks.length > 0">
          <h4 class="font-medium text-gray-900 dark:text-white mb-3">Source Material</h4>
          <div class="space-y-2">
            <a
              v-for="source in sourceLinks"
              :key="source.url"
              :href="source.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
            >
              <BookOpenIcon class="w-5 h-5 mr-3 text-orange-600" />
              <div>
                <p class="font-medium text-orange-900 dark:text-orange-200">{{ source.title }}</p>
                <p class="text-sm text-orange-700 dark:text-orange-300">{{ source.type }}</p>
              </div>
              <ArrowTopRightOnSquareIcon class="w-4 h-4 ml-auto text-orange-600" />
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
        <div v-if="anime.studios.length > 0" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
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
    GlobeAltIcon, 
    DocumentTextIcon, 
    ArrowTopRightOnSquareIcon 
  } from '@heroicons/vue/24/outline'
  import type { Anime } from '~/types/anime'
  
  interface Props {
    anime: Anime
  }
  
  const props = defineProps<Props>()
  
  // State
  const loading = ref(false)
  const wikiLinks = ref<Array<{ title: string; url: string; description: string }>>([])
  const sourceLinks = ref<Array<{ title: string; url: string; type: string }>>([])
  
  // Computed
  const displayTitle = computed(() => {
    return props.anime.title.english || props.anime.title.romaji
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
  
  const fetchAdditionalLinks = async () => {
    loading.value = true
    
    try {
      // Generate some common wiki links based on the anime title
      const searchTitle = displayTitle.value.replace(/[^\w\s]/g, '').replace(/\s+/g, '_')
      
      wikiLinks.value = [
        {
          title: `${displayTitle.value} Wiki`,
          url: `https://${searchTitle.toLowerCase().replace(/\s+/g, '')}.fandom.com/wiki/Main_Page`,
          description: 'Fandom wiki with detailed information'
        },
        {
          title: 'MyAnimeList',
          url: `https://myanimelist.net/search/all?q=${encodeURIComponent(displayTitle.value)}`,
          description: 'Community ratings and reviews'
        }
      ]
  
      // Add source material links based on anime source
      if (props.anime.source === 'MANGA') {
        sourceLinks.value.push({
          title: `${displayTitle.value} Manga`,
          url: `https://myanimelist.net/search/manga?q=${encodeURIComponent(displayTitle.value)}`,
          type: 'Original Manga'
        })
      } else if (props.anime.source === 'LIGHT_NOVEL') {
        sourceLinks.value.push({
          title: `${displayTitle.value} Light Novel`,
          url: `https://myanimelist.net/search/manga?q=${encodeURIComponent(displayTitle.value)}`,
          type: 'Light Novel'
        })
      } else if (props.anime.source === 'VISUAL_NOVEL') {
        sourceLinks.value.push({
          title: `${displayTitle.value} Visual Novel`,
          url: `https://vndb.org/v/all?q=${encodeURIComponent(displayTitle.value)}`,
          type: 'Visual Novel'
        })
      }
  
    } catch (error) {
      console.error('Error fetching additional links:', error)
    } finally {
      loading.value = false
    }
  }
  
  // Fetch data when anime changes
  watch(() => props.anime.id, fetchAdditionalLinks, { immediate: true })
  </script>
  