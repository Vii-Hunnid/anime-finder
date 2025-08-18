<template>
  <div class="max-w-md mx-auto">
    <div class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
      <!-- Error Icon -->
      <div class="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
      </div>

      <!-- Error Title -->
      <h3 class="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
        Oops! Something went wrong
      </h3>

      <!-- Error Message -->
      <p class="text-red-700 dark:text-red-300 mb-6">
        {{ message }}
      </p>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <button
          @click="$emit('retry')"
          class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Try Again
        </button>

        <button
          @click="goBack"
          class="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Start New Search
        </button>
      </div>

      <!-- Helpful Tips -->
      <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
        <h4 class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">💡 Tips for better results:</h4>
        <ul class="text-xs text-blue-700 dark:text-blue-300 space-y-1 text-left">
          <li>• Include specific visual details (hair color, clothing, setting)</li>
          <li>• Mention character actions or dialogue</li>
          <li>• Describe the art style or animation quality</li>
          <li>• Add any unique or memorable elements</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  retry: []
}>()

const goBack = () => {
  // Reload the page to start fresh
  window.location.reload()
}
</script>
  