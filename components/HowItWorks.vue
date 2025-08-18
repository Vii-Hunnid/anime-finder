<template>
    <section class="max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
        How It Works
      </h2>
  
      <!-- Process Steps -->
      <div class="grid md:grid-cols-3 gap-8 mb-12">
        <div 
          v-for="(step, index) in steps" 
          :key="step.title"
          class="text-center group"
        >
          <!-- Step Icon -->
          <div class="relative mb-6">
            <div class="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <component :is="step.icon" class="w-10 h-10 text-white" />
            </div>
            
            <!-- Step Number -->
            <div class="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 text-yellow-900 rounded-full flex items-center justify-center text-sm font-bold shadow-md">
              {{ index + 1 }}
            </div>
            
            <!-- Connecting Line (except for last step) -->
            <div 
              v-if="index < steps.length - 1"
              class="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 transform -translate-y-1/2"
            ></div>
          </div>
  
          <!-- Step Content -->
          <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            {{ step.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {{ step.description }}
          </p>
        </div>
      </div>
  
      <!-- Example Section -->
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 mb-12">
        <h3 class="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Example Search
        </h3>
        
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <!-- Input Example -->
          <div>
            <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-3">
              💭 Your Description:
            </h4>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-blue-500">
              <p class="text-gray-700 dark:text-gray-300 italic">
                "A blonde character with blue eyes fights giant humanoid creatures outside massive walls. The character uses special gear to move around and has a very determined expression."
              </p>
            </div>
          </div>
  
          <!-- Result Example -->
          <div>
            <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-3">
              ✨ AI Identifies:
            </h4>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-green-500">
              <div class="flex items-center mb-2">
                <div class="w-12 h-16 bg-gray-200 dark:bg-gray-700 rounded mr-3 flex-shrink-0"></div>
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white">Attack on Titan</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">95% confidence match</p>
                </div>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                Matched: blonde character, giant humanoids, walls, special gear
              </p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Features Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div 
          v-for="feature in features" 
          :key="feature.title"
          class="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          <component :is="feature.icon" class="w-8 h-8 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">{{ feature.title }}</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ feature.description }}</p>
        </div>
      </div>
  
      <!-- Tips Section -->
      <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6">
        <h3 class="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-4 flex items-center">
          <LightBulbIcon class="w-6 h-6 mr-2" />
          Pro Tips for Better Results
        </h3>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div v-for="tip in tips" :key="tip.title" class="flex items-start">
            <div class="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
              <span class="text-yellow-900 text-xs font-bold">✓</span>
            </div>
            <div>
              <h5 class="font-medium text-yellow-800 dark:text-yellow-200">{{ tip.title }}</h5>
              <p class="text-sm text-yellow-700 dark:text-yellow-300">{{ tip.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { 
    ChatBubbleLeftRightIcon,
    MagnifyingGlassIcon,
    PresentationChartLineIcon,
    BoltIcon,
    GlobeAltIcon,
    HeartIcon,
    ShieldCheckIcon,
    LightBulbIcon
  } from '@heroicons/vue/24/outline'
  
  const steps = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Describe the Scene",
      description: "Tell us what you remember about the anime scene - characters, setting, actions, or any visual details that stood out to you."
    },
    {
      icon: MagnifyingGlassIcon,
      title: "AI Analysis & Search",
      description: "Our AI analyzes your description, extracts key elements, and searches through thousands of anime to find potential matches."
    },
    {
      icon: PresentationChartLineIcon,
      title: "Get Results & Watch",
      description: "View ranked matches with confidence scores, detailed explanations, and direct links to streaming platforms."
    }
  ]
  
  const features = [
    {
      icon: BoltIcon,
      title: "Lightning Fast",
      description: "Get results in seconds with our optimized AI search engine"
    },
    {
      icon: GlobeAltIcon,
      title: "Vast Database",
      description: "Search through thousands of anime from classic to current"
    },
    {
      icon: HeartIcon,
      title: "Smart Matching",
      description: "AI understands context, emotions, and visual elements"
    },
    {
      icon: ShieldCheckIcon,
      title: "Accurate Results",
      description: "Confidence scores help you identify the best matches"
    }
  ]
  
  const tips = [
    {
      title: "Be Specific About Visuals",
      description: "Hair colors, clothing, and unique visual elements are great identifiers"
    },
    {
      title: "Mention the Setting",
      description: "School, city, forest, or any memorable locations help narrow results"
    },
    {
      title: "Describe Character Actions",
      description: "Fighting, cooking, running - actions are often unique to specific scenes"
    },
    {
      title: "Include Emotional Context",
      description: "Happy, sad, intense moments can help distinguish similar-looking scenes"
    },
    {
      title: "Add Time Period Hints",
      description: "If you remember when you watched it or the animation style"
    },
    {
      title: "Use Multiple Details",
      description: "The more details you provide, the better the AI can identify your anime"
    }
  ]
  </script>
  