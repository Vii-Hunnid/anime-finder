// composables/useTheme.ts - Fixed to properly default to light mode
export const useTheme = () => {
  const isDark = ref(false) // Start with light mode

  // Initialize theme from localStorage or default to light
  const initializeTheme = () => {
    if (process.client) {
      const stored = localStorage.getItem('theme')
      if (stored === 'dark') {
        isDark.value = true
      } else {
        // Explicitly set to light mode (false)
        isDark.value = false
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
  })

  return {
    isDark: readonly(isDark),
    toggle
  }
}
  