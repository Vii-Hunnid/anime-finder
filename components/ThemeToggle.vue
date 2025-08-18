<template>
    <button
      @click="toggleTheme"
      class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <SunIcon v-if="isDark" class="w-5 h-5 text-yellow-500" />
      <MoonIcon v-else class="w-5 h-5 text-gray-600" />
    </button>
  </template>
  
  <script setup lang="ts">
  import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'
  
  const { isDark, toggle: toggleTheme } = useTheme()
  </script>
  