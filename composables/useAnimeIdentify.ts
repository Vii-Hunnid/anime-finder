import type { IdentificationRequest, IdentificationResponse } from '~/types/identification'

export const useAnimeIdentify = () => {
  const { $fetch } = useNuxtApp()

  const identify = async (request: IdentificationRequest): Promise<IdentificationResponse> => {
    try {
      const response = await $fetch<IdentificationResponse>('/api/identify', {
        method: 'POST',
        body: request
      })

      if (!response.success) {
        throw new Error(response.error || 'Identification failed')
      }

      return response
    } catch (error) {
      console.error('Identification error:', error)
      
      if (error instanceof Error) {
        throw error
      }
      
      throw new Error('Failed to identify anime scene. Please try again.')
    }
  }

  const validateDescription = (description: string): { valid: boolean; message?: string } => {
    if (!description.trim()) {
      return { valid: false, message: 'Please describe the anime scene' }
    }

    if (description.trim().length < 10) {
      return { valid: false, message: 'Please provide a more detailed description (at least 10 characters)' }
    }

    if (description.trim().length > 1000) {
      return { valid: false, message: 'Description is too long (maximum 1000 characters)' }
    }

    return { valid: true }
  }

  const extractSceneElements = (description: string) => {
    const elements = {
      characters: [] as string[],
      settings: [] as string[],
      actions: [] as string[],
      emotions: [] as string[],
      visualStyle: [] as string[]
    }

    const text = description.toLowerCase()

    // Character descriptors
    const characterTerms = [
      'blonde', 'brunette', 'redhead', 'pink hair', 'blue hair', 'green hair',
      'long hair', 'short hair', 'twin tails', 'ponytail',
      'tall', 'short', 'muscular', 'slim',
      'glasses', 'mask', 'uniform', 'sword', 'gun'
    ]

    // Setting descriptors
    const settingTerms = [
      'school', 'rooftop', 'classroom', 'city', 'forest', 'beach', 'mountain',
      'hospital', 'restaurant', 'cafe', 'park', 'train', 'subway',
      'apartment', 'house', 'castle', 'battlefield', 'space', 'underground'
    ]

    // Action descriptors
    const actionTerms = [
      'fight', 'battle', 'running', 'walking', 'crying', 'laughing',
      'kissing', 'hugging', 'cooking', 'eating', 'studying', 'training',
      'flying', 'falling', 'jumping', 'dancing', 'singing'
    ]

    // Emotion descriptors
    const emotionTerms = [
      'happy', 'sad', 'angry', 'scared', 'excited', 'confused',
      'determined', 'shocked', 'embarrassed', 'jealous', 'love', 'hate'
    ]

    // Visual style descriptors
    const styleTerms = [
      'dark', 'bright', 'colorful', 'black and white', 'dramatic',
      'comedic', 'realistic', 'stylized', 'detailed', 'simple'
    ]

    // Extract elements
    characterTerms.forEach(term => {
      if (text.includes(term)) elements.characters.push(term)
    })
    
    settingTerms.forEach(term => {
      if (text.includes(term)) elements.settings.push(term)
    })
    
    actionTerms.forEach(term => {
      if (text.includes(term)) elements.actions.push(term)
    })
    
    emotionTerms.forEach(term => {
      if (text.includes(term)) elements.emotions.push(term)
    })
    
    styleTerms.forEach(term => {
      if (text.includes(term)) elements.visualStyle.push(term)
    })

    return elements
  }

  return {
    identify,
    validateDescription,
    extractSceneElements
  }
}
