export const useTheme = () => {
    const isDark = ref(false)
  
    // Initialize theme from localStorage or system preference
    const initializeTheme = () => {
      if (process.client) {
        const stored = localStorage.getItem('theme')
        if (stored) {
          isDark.value = stored === 'dark'
        } else {
          // Use system preference
          isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        updateTheme()
      }
    }
  
    // Update the DOM and localStorage
    const updateTheme = () => {
      if (process.client) {
        if (isDark.value) {
          document.documentElement.classList.add('dark')
          localStorage.setItem('theme', 'dark')
        } else {
          document.documentElement.classList.remove('dark')
          localStorage.setItem('theme', 'light')
        }
      }
    }
  
    // Toggle theme
    const toggle = () => {
      isDark.value = !isDark.value
      updateTheme()
    }
  
    // Watch for changes
    watch(isDark, updateTheme)
  
    // Initialize on mount
    onMounted(() => {
      initializeTheme()
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem('theme')) {
          isDark.value = e.matches
        }
      }
      
      mediaQuery.addEventListener('change', handleChange)
      
      // Cleanup
      onUnmounted(() => {
        mediaQuery.removeEventListener('change', handleChange)
      })
    })
  
    return {
      isDark: readonly(isDark),
      toggle
    }
  }
  