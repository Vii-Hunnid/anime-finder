// composables/useAnimeIdentify.ts - FIXED to use real AI API
import type { IdentificationRequest, IdentificationResponse } from '~/types/identification'

export const useAnimeIdentify = () => {
  const identify = async (request: IdentificationRequest): Promise<IdentificationResponse> => {
    try {
      console.log('Making API call to /api/identify with:', request)
      
      const response = await $fetch<IdentificationResponse>('/api/identify', {
        method: 'POST',
        body: request
      })

      console.log('API response:', response)

      if (!response.success) {
        throw new Error(response.error || 'Identification failed')
      }

      return response

    } catch (error) {
      console.error('Identification error:', error)
      
      return {
        success: false,
        matches: [],
        query: {
          processedDescription: request.description,
          extractedElements: {
            characters: [],
            setting: [],
            actions: [],
            emotions: [],
            visualStyle: []
          }
        },
        searchTime: 0,
        error: error instanceof Error ? error.message : 'Failed to identify anime scene'
      }
    }
  }

  const validateDescription = (description: string): { valid: boolean; message?: string } => {
    if (!description.trim()) {
      return { valid: false, message: 'Please describe the anime scene' }
    }

    if (description.trim().length < 5) {
      return { valid: false, message: 'Please provide a more detailed description (at least 5 characters)' }
    }

    if (description.trim().length > 1000) {
      return { valid: false, message: 'Description is too long (maximum 1000 characters)' }
    }

    return { valid: true }
  }

  return {
    identify,
    validateDescription
  }
}
