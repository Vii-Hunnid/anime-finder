<template>
  <div class="flex flex-col items-center justify-center py-12">
    <!-- Main Spinner -->
    <div class="relative mb-6">
      <div class="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
      <div class="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-pulse border-t-purple-400 opacity-40"></div>
    </div>

    <!-- Status Information -->
    <div class="text-center max-w-md">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {{ stageTitle }}
      </h3>
      <p class="text-gray-600 dark:text-gray-300 mb-4">
        {{ status.message }}
      </p>

      <!-- Progress Bar -->
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
        <div 
          class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
          :style="{ width: `${status.progress}%` }"
        ></div>
      </div>

      <!-- Current Step Indicator -->
      <div class="flex justify-center space-x-2">
        <div 
          v-for="(step, index) in steps" 
          :key="step"
          :class="[
            'w-2 h-2 rounded-full transition-all duration-300',
            getCurrentStepIndex() >= index 
              ? 'bg-blue-500 dark:bg-blue-400' 
              : 'bg-gray-300 dark:bg-gray-600'
          ]"
        ></div>
      </div>

      <!-- Fun Facts -->
      <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
        <p class="text-sm text-blue-700 dark:text-blue-300">
          <span class="font-medium">💡 Did you know?</span> {{ currentFunFact }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ProcessingStatus {
  stage: 'analyzing' | 'searching' | 'matching' | 'complete' | 'error'
  message: string
  progress: number
}

interface Props {
  status: ProcessingStatus
}

const props = defineProps<Props>()

const steps = ['Analyzing', 'Searching', 'Matching', 'Complete']

const stageMap = {
  analyzing: 'Analyzing Scene',
  searching: 'Searching Database',
  matching: 'Finding Matches',
  complete: 'Search Complete',
  error: 'Search Failed'
}

const funFacts = [
  'Our AI can identify anime from over 50,000 different scenes!',
  'The average anime has over 300 unique identifiable scenes.',
  'Scene descriptions work better when you include visual details.',
  'We can identify anime from the 1960s to current releases!',
  'Character descriptions help improve match accuracy by 40%.',
  'Background settings are often the most unique identifiers.',
  'Dialogue snippets can help narrow down specific episodes.',
  'Our database includes both popular and obscure anime series.'
]

const stageTitle = computed(() => {
  return stageMap[props.status.stage] || 'Processing...'
})

const currentFunFact = ref(funFacts[0])

const getCurrentStepIndex = () => {
  switch (props.status.stage) {
    case 'analyzing': return 0
    case 'searching': return 1
    case 'matching': return 2
    case 'complete': return 3
    case 'error': return -1
    default: return 0
  }
}

// Rotate fun facts every 3 seconds
let factInterval: NodeJS.Timeout

onMounted(() => {
  let factIndex = 0
  factInterval = setInterval(() => {
    factIndex = (factIndex + 1) % funFacts.length
    currentFunFact.value = funFacts[factIndex]
  }, 3000)
})

onUnmounted(() => {
  if (factInterval) {
    clearInterval(factInterval)
  }
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
