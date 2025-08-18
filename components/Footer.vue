<template>
    <footer class="bg-gray-900 text-white py-12">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-4 gap-8">
          <!-- Brand Section -->
          <div class="md:col-span-2">
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FilmIcon class="w-5 h-5 text-white" />
              </div>
              <h3 class="text-xl font-bold text-gradient">Anime Finder</h3>
            </div>
            <p class="text-gray-400 mb-4 max-w-md">
              The first AI-powered anime scene identifier. Describe any scene and instantly discover what anime it's from.
            </p>
            <p class="text-sm text-gray-500">
              Built with ❤️ for the anime community
            </p>
          </div>
  
          <!-- Quick Links -->
          <div>
            <h4 class="font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#how-it-works" class="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#about" class="hover:text-white transition-colors">About</a></li>
              <li><a href="#privacy" class="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" class="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
  
          <!-- Data Sources -->
          <div>
            <h4 class="font-semibold mb-4">Powered By</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li>
                <a href="https://anilist.co" target="_blank" rel="noopener" class="hover:text-white transition-colors">
                  AniList Database
                </a>
              </li>
              <li>
                <a href="https://openai.com" target="_blank" rel="noopener" class="hover:text-white transition-colors">
                  OpenAI GPT-4
                </a>
              </li>
              <li>
                <a href="https://justwatch.com" target="_blank" rel="noopener" class="hover:text-white transition-colors">
                  JustWatch API
                </a>
              </li>
              <li>
                <a href="https://fandom.com" target="_blank" rel="noopener" class="hover:text-white transition-colors">
                  Fandom Wikis
                </a>
              </li>
            </ul>
          </div>
        </div>
  
        <!-- Bottom Bar -->
        <div class="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-500 text-sm">
            © 2024 Anime Finder. All rights reserved.
          </p>
          <div class="flex items-center space-x-4 mt-4 md:mt-0">
            <span class="text-gray-500 text-sm">Made with</span>
            <div class="flex items-center space-x-2 text-sm text-gray-400">
              <span>Nuxt 3</span>
              <span>•</span>
              <span>Tailwind CSS</span>
              <span>•</span>
              <span>TypeScript</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup lang="ts">
  import { FilmIcon } from '@heroicons/vue/24/outline'
  </script>
  