<template>
    <header class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo & Brand -->
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FilmIcon class="w-5 h-5 text-white" />
            </div>
            <h1 class="text-xl font-bold">
              <span class="text-gradient">Anime Finder</span>
            </h1>
          </div>
  
          <!-- Navigation -->
          <nav class="hidden md:flex items-center space-x-6">
            <a href="#how-it-works" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              How It Works
            </a>
            <a href="#about" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              About
            </a>
          </nav>
  
          <!-- Theme Toggle -->
          <ThemeToggle />
        </div>
      </div>
    </header>
  </template>
  
  <script setup lang="ts">
  import { FilmIcon } from '@heroicons/vue/24/outline'
  </script>
  