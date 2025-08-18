export const useDebounce = <T>(value: Ref<T>, delay: number = 300) => {
    const debouncedValue = ref<T>(value.value)
  
    let timeoutId: NodeJS.Timeout
  
    const updateDebouncedValue = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        debouncedValue.value = value.value
      }, delay)
    }
  
    // Watch for changes in the original value
    watch(value, updateDebouncedValue, { immediate: true })
  
    // Cleanup on unmount
    onUnmounted(() => {
      clearTimeout(timeoutId)
    })
  
    return {
      debouncedValue: readonly(debouncedValue)
    }
  }
  