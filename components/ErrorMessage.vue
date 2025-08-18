<template>
    <div class="max-w-md mx-auto text-center py-8">
      <div class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <!-- Error Icon -->
        <div class="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
          <ExclamationTriangleIcon class="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        
        <!-- Error Message -->
        <h3 class="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
          Oops! Something went wrong
        </h3>
        
        <p class="text-red-700 dark:text-red-300 text-sm mb-6">
          {{ message }}
        </p>
        
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            @click="$emit('retry')"
            class="btn-primary"
          >
            <ArrowPathIcon class="w-4 h-4 mr-2" />
            Try Again
          </button>
          
          <button
            @click="goHome"
            class="btn-secondary"
          >
            <HomeIcon class="w-4 h-4 mr-2" />
            Start Over
          </button>
        </div>
        
        <!-- Help Text -->
        <div class="mt-6 text-xs text-red-600 dark:text-red-400">
          <p class="mb-2">Still having trouble? Try:</p>
          <ul class="text-left space-y-1">
            <li>• Using more specific scene details</li>
            <li>• Checking your internet connection</li>
            <li>• Refreshing the page</li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ExclamationTriangleIcon, ArrowPathIcon, HomeIcon } from '@heroicons/vue/24/outline'
  
  interface Props {
    message: string
  }
  
  defineProps<Props>()
  defineEmits<{
    retry: []
  }>()
  
  const goHome = () => {
    window.location.reload()
  }
  </script>
  