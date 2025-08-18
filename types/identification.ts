import type { Anime, AnimeScene, SceneMatch } from './anime'

export interface IdentificationRequest {
  description: string
  additionalInfo?: {
    approximateYear?: string
    genre?: string
    style?: string
    language?: 'japanese' | 'english' | 'any'
  }
}

export interface IdentificationResponse {
  success: boolean
  matches: SceneMatch[]
  query: {
    processedDescription: string
    extractedElements: {
      characters: string[]
      setting: string[]
      actions: string[]
      emotions: string[]
      visualStyle: string[]
    }
  }
  searchTime: number
  error?: string
}

export interface AIAnalysis {
  scene: AnimeScene
  possibleAnimes: Array<{
    title: string
    confidence: number
    reasoning: string
    searchTerms: string[]
  }>
  searchStrategy: {
    primaryTerms: string[]
    secondaryTerms: string[]
    excludeTerms: string[]
  }
}

export interface ProcessingStatus {
  stage: 'analyzing' | 'searching' | 'matching' | 'complete' | 'error'
  message: string
  progress: number
}
