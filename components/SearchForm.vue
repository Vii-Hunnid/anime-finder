<template>
    <div class="max-w-4xl mx-auto">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Main search input -->
        <div class="relative">
          <textarea
            v-model="description"
            :disabled="loading"
            placeholder="Describe the anime scene you remember... (e.g., 'A blonde-haired character fights a giant humanoid creature on top of a wall')"
            class="input-field min-h-32 resize-none text-lg"
            rows="4"
            maxlength="1000"
            @input="handleInput"
          />
          
          <!-- Character count -->
          <div class="absolute bottom-3 right-3 text-sm text-gray-400">
            {{ description.length }}/1000
          </div>
        </div>
  
        <!-- Example suggestions -->
        <div v-if="!description.length" class="flex flex-wrap gap-2 justify-center">
          <button
            v-for="example in examples"
            :key="example"
            type="button"
            @click="useExample(example)"
            class="px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm transition-colors duration-200"
          >
            {{ example }}
          </button>
        </div>
  
        <!-- Additional filters (collapsible) -->
        <div class="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
          <button
            type="button"
            @click="showAdvanced = !showAdvanced"
            class="flex items-center justify-between w-full text-left"
          >
            <span class="font-medium text-gray-700 dark:text-gray-300">
              Advanced Options
            </span>
            <ChevronDownIcon 
              :class="['w-5 h-5 transition-transform duration-200', showAdvanced ? 'rotate-180' : '']"
            />
          </button>
  
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-96"
            leave-active-class="transition-all duration-300"
            leave-from-class="opacity-100 max-h-96"
            leave-to-class="opacity-0 max-h-0"
          >
            <div v-if="showAdvanced" class="mt-4 space-y-4 overflow-hidden">
              <div class="grid md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Approximate Year
                  </label>
                  <select v-model="filters.year" class="input-field text-sm">
                    <option value="">Any year</option>
                    <option value="2020s">2020s</option>
                    <option value="2010s">2010s</option>
                    <option value="2000s">2000s</option>
                    <option value="1990s">1990s</option>
                    <option value="1980s">1980s or earlier</option>
                  </select>
                </div>
  
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Genre Hint
                  </label>
                  <select v-model="filters.genre" class="input-field text-sm">
                    <option value="">Any genre</option>
                    <option value="action">Action</option>
                    <option value="romance">Romance</option>
                    <option value="comedy">Comedy</option>
                    <option value="drama">Drama</option>
                    <option value="supernatural">Supernatural</option>
                    <option value="sci-fi">Sci-Fi</option>
                    <option value="slice-of-life">Slice of Life</option>
                  </select>
                </div>
  
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Animation Style
                  </label>
                  <select v-model="filters.style" class="input-field text-sm">
                    <option value="">Any style</option>
                    <option value="modern">Modern (clean, digital)</option>
                    <option value="classic">Classic (hand-drawn)</option>
                    <option value="realistic">Realistic</option>
                    <option value="stylized">Stylized/Unique</option>
                  </select>
                </div>
              </div>
            </div>
          </Transition>
        </div>
  
        <!-- Search button -->
        <div class="text-center">
          <button
            type="submit"
            :disabled="!canSubmit || loading"
            class="btn-primary text-lg px-8 py-4 relative"
          >
            <span v-if="!loading">
              <MagnifyingGlassIcon class="w-5 h-5 inline-block mr-2" />
              Find My Anime
            </span>
            <span v-else class="flex items-center">
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Searching...
            </span>
          </button>
        </div>
      </form>
  
      <!-- Search tips -->
      <div class="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <p class="mb-2">💡 <strong>Pro tip:</strong> Include visual details, character descriptions, and memorable dialogue</p>
        <p>The more specific you are, the better the AI can identify your anime!</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
  
  // Props & Emits
  interface Props {
    loading?: boolean
  }
  
  const props = withDefaults(defineProps<Props>(), {
    loading: false
  })
  
  const emit = defineEmits<{
    search: [description: string, filters?: any]
  }>()
  
  // State
  const description = ref('')
  const showAdvanced = ref(false)
  const filters = ref({
    year: '',
    genre: '',
    style: ''
  })
  
  // Examples for quick start
  const examples = [
    'Girl with pink hair fights with a sword',
    'Characters confess on school rooftop at sunset',
    'Giant robot battles in city',
    'Cooking competition in school',
    'Time travel using phone microwave'
  ]
  
  // Computed
  const canSubmit = computed(() => {
    return description.value.trim().length >= 10 && !props.loading
  })
  
  // Debounced input handling
  const { debouncedValue } = useDebounce(description, 300)
  
  // Methods
  const handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement
    description.value = target.value
  }
  
  const handleSubmit = () => {
    if (!canSubmit.value) return
    
    const searchData = {
      description: description.value.trim(),
      additionalInfo: {
        approximateYear: filters.value.year || undefined,
        genre: filters.value.genre || undefined,
        style: filters.value.style || undefined
      }
    }
    
    emit('search', searchData.description, searchData.additionalInfo)
  }
  
  const useExample = (example: string) => {
    description.value = example
    
    // Auto-focus textarea after setting example
    nextTick(() => {
      const textarea = document.querySelector('textarea')
      if (textarea) {
        textarea.focus()
        textarea.setSelectionRange(textarea.value.length, textarea.value.length)
      }
    })
  }
  
  // Clear form when not loading
  watch(() => props.loading, (isLoading) => {
    if (!isLoading) {
      // Optional: clear form after successful search
      // description.value = ''
      // filters.value = { year: '', genre: '', style: '' }
    }
  })
  </script>
  