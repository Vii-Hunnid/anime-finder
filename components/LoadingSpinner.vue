<template>
    <div class="flex flex-col items-center justify-center py-12">
      <!-- Main Spinner -->
      <div class="relative mb-6">
        <div class="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
        <div class="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
  
      <!-- Status Text -->
      <div class="text-center max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ status.message }}
        </h3>
        
        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
          <div 
            class="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            :style="{ width: `${status.progress}%` }"
          ></div>
        </div>
  
        <!-- Stage Indicators -->
        <div class="flex justify-center space-x-4 mb-6">
          <div 
            v-for="(stage, index) in stages" 
            :key="stage.key"
            :class="[
              'flex items-center text-sm',
              getStageStatus(stage.key) === 'completed' ? 'text-green-600 dark:text-green-400' :
              getStageStatus(stage.key) === 'current' ? 'text-blue-600 dark:text-blue-400' :
              'text-gray-400 dark:text-gray-600'
            ]"
          >
            <!-- Stage Icon -->
            <div 
              :class="[
                'w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-bold',
                getStageStatus(stage.key) === 'completed' ? 'bg-green-600 text-white' :
                getStageStatus(stage.key) === 'current' ? 'bg-blue-600 text-white' :
                'bg-gray-300 dark:bg-gray-600 text-gray-500'
              ]"
            >
              <CheckIcon v-if="getStageStatus(stage.key) === 'completed'" class="w-4 h-4" />
              <div v-else-if="getStageStatus(stage.key) === 'current'" class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span v-else>{{ index + 1 }}</span>
            </div>
            
            <!-- Stage Label -->
            <span class="hidden sm:inline">{{ stage.label }}</span>
          </div>
        </div>
  
        <!-- Fun Facts -->
        <div class="text-sm text-gray-600 dark:text-gray-400">
          <p class="mb-1">{{ currentFact }}</p>
          <p class="text-xs opacity-75">{{ currentTip }}</p>
        </div>
      </div>
  
      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          v-for="i in 5" 
          :key="`dot-${i}`"
          :class="[
            'absolute w-2 h-2 bg-blue-400 dark:bg-blue-600 rounded-full opacity-30',
            `animation-delay-${i * 150}`
          ]"
          :style="{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 2}s`
          }"
          class="animate-bounce"
        ></div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { CheckIcon } from '@heroicons/vue/24/solid'
  import type { ProcessingStatus } from '~/types/identification'
  
  interface Props {
    status: ProcessingStatus
  }
  
  const props = defineProps<Props>()
  
  // Processing stages
  const stages = [
    { key: 'analyzing', label: 'Analyzing Scene' },
    { key: 'searching', label: 'Searching Database' },
    { key: 'matching', label: 'Finding Matches' },
    { key: 'complete', label: 'Complete' }
  ]
  
  // Fun facts and tips to show during loading
  const animeFacts = [
    "Did you know? The first anime was created in 1917!",
    "Studio Ghibli films have won numerous international awards.",
    "Anime covers every genre imaginable, from slice-of-life to sci-fi.",
    "The anime industry produces over 200 series per year.",
    "Many anime are adaptations of manga or light novels.",
    "Voice acting (seiyuu) is a prestigious career in Japan.",
    "Anime conventions happen worldwide, bringing fans together."
  ]
  
  const searchTips = [
    "Tip: Mention unique visual elements for better results",
    "Tip: Character hair colors are often distinctive in anime",
    "Tip: Describe the setting or time period if you remember",
    "Tip: Emotional scenes are often the most memorable",
    "Tip: Mention any distinctive art styles you noticed"
  ]
  
  // Reactive current fact and tip
  const currentFactIndex = ref(0)
  const currentTipIndex = ref(0)
  
  const currentFact = computed(() => animeFacts[currentFactIndex.value])
  const currentTip = computed(() => searchTips[currentTipIndex.value])
  
  // Rotate facts and tips every few seconds
  let factInterval: NodeJS.Timeout
  let tipInterval: NodeJS.Timeout
  
  onMounted(() => {
    factInterval = setInterval(() => {
      currentFactIndex.value = (currentFactIndex.value + 1) % animeFacts.length
    }, 4000)
    
    tipInterval = setInterval(() => {
      currentTipIndex.value = (currentTipIndex.value + 1) % searchTips.length
    }, 6000)
  })
  
  onUnmounted(() => {
    if (factInterval) clearInterval(factInterval)
    if (tipInterval) clearInterval(tipInterval)
  })
  
  // Methods
  const getStageStatus = (stageKey: string): 'completed' | 'current' | 'pending' => {
    const currentStageIndex = stages.findIndex(s => s.key === props.status.stage)
    const stageIndex = stages.findIndex(s => s.key === stageKey)
    
    if (stageIndex < currentStageIndex) return 'completed'
    if (stageIndex === currentStageIndex) return 'current'
    return 'pending'
  }
  </script>
  