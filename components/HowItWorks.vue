<template>
  <section class="max-w-6xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
      <p class="text-xl text-gray-600 dark:text-gray-300">
        Powered by AI to identify anime from your scene descriptions
      </p>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Step 1 -->
      <div class="text-center">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
          1
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Describe the Scene</h3>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          Tell us about any anime scene you remember - characters, setting, plot details, visual elements, or memorable dialogue. The more specific, the better!
        </p>
        <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm text-blue-700 dark:text-blue-300">
          <strong>Example:</strong> "A blonde character fights giant humanoid creatures on top of a wall"
        </div>
      </div>
      
      <!-- Step 2 -->
      <div class="text-center">
        <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
          2
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">AI Analysis</h3>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          Our advanced AI analyzes your description and matches it against thousands of anime scenes, characters, and plot points to find the best matches.
        </p>
        <div class="mt-4 flex justify-center space-x-2">
          <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs">
            Scene Analysis
          </span>
          <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs">
            Character Matching
          </span>
        </div>
      </div>
      
      <!-- Step 3 -->
      <div class="text-center">
        <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
          3
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Watch & Discover</h3>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          Get the exact anime title, episode details, and where to stream it. Plus discover similar recommendations and detailed information!
        </p>
        <div class="mt-4 flex justify-center space-x-2">
          <span class="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-xs">
            Streaming Links
          </span>
          <span class="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-xs">
            Recommendations
          </span>
        </div>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
        <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Smart Recognition</h4>
        <p class="text-sm text-gray-600 dark:text-gray-300">AI-powered scene analysis with high accuracy</p>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a2 2 0 002 2h6a2 2 0 002-2V8M7 8h10"></path>
          </svg>
        </div>
        <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Vast Database</h4>
        <p class="text-sm text-gray-600 dark:text-gray-300">Thousands of anime series and episodes covered</p>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v1"></path>
          </svg>
        </div>
        <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Instant Results</h4>
        <p class="text-sm text-gray-600 dark:text-gray-300">Get matches in seconds with confidence scores</p>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Streaming Links</h4>
        <p class="text-sm text-gray-600 dark:text-gray-300">Direct links to watch on popular platforms</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// No additional props needed for this component
</script>
