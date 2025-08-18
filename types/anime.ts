// Core anime data types
export interface Anime {
  id: string
  title: {
    english?: string
    romaji: string
    native?: string
  }
  description?: string
  coverImage: {
    large: string
    medium: string
    color?: string
  }
  bannerImage?: string
  genres: string[]
  episodes?: number
  duration?: number
  seasonYear?: number
  season?: 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL'
  averageScore?: number
  meanScore?: number
  popularity?: number
  status: 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS'
  format: 'TV' | 'TV_SHORT' | 'MOVIE' | 'SPECIAL' | 'OVA' | 'ONA' | 'MUSIC'
  studios: Array<{
    id: string
    name: string
    isMain?: boolean
  }>
  tags?: Array<{
    id: string
    name: string
    description?: string
    rank?: number
    isMediaSpoiler?: boolean
  }>
  relations?: Array<{
    id: string
    relationType: string
    title: {
      english?: string
      romaji: string
    }
  }>
  characters?: Array<{
    id: string
    name: {
      first?: string
      last?: string
      full: string
    }
    image: {
      large: string
      medium: string
    }
    role?: string
  }>
  staff?: Array<{
    id: string
    name: {
      first?: string
      last?: string
      full: string
    }
    role: string
  }>
  siteUrl: string
  source: 'ORIGINAL' | 'MANGA' | 'LIGHT_NOVEL' | 'VISUAL_NOVEL' | 'VIDEO_GAME' | 'OTHER'
  trailer?: {
    id: string
    site: string
    thumbnail: string
  }
  updatedAt?: number
  nextAiringEpisode?: {
    airingAt: number
    timeUntilAiring: number
    episode: number
  }
}

// Scene matching types
export interface SceneMatch {
  anime: Anime
  confidence: number
  reasoning: string
  episode?: number
  timestamp?: string
  matchedElements: string[]
  sceneDescription?: string
  characterMatches?: string[]
  settingMatches?: string[]
  plotMatches?: string[]
}

// Search and identification types
export interface IdentificationRequest {
  description: string
  additionalInfo?: {
    approximateYear?: string
    genre?: string
    style?: string
    characterCount?: number
    setting?: string
    language?: 'sub' | 'dub' | 'both'
  }
  options?: {
    maxResults?: number
    minConfidence?: number
    includeAdult?: boolean
  }
}

export interface IdentificationResponse {
  success: boolean
  matches: SceneMatch[]
  searchQuery: string
  processingTime: number
  totalPossibleMatches?: number
  searchMetadata?: {
    analyzedElements: string[]
    keyTerms: string[]
    confidence: number
  }
  error?: string
}

// Processing status
export interface ProcessingStatus {
  stage: 'analyzing' | 'searching' | 'matching' | 'complete' | 'error'
  message: string
  progress: number
  currentStep?: string
  estimatedTimeRemaining?: number
}

// Recommendation types
export interface AnimeRecommendation {
  anime: Anime
  score: number
  reason: string
  similarities: string[]
  recommendationType: 'genre' | 'studio' | 'staff' | 'user' | 'ai'
}

// User preferences (for personalized recommendations)
export interface UserPreferences {
  favoriteGenres: string[]
  dislikedGenres: string[]
  preferredFormats: string[]
  languagePreference: 'sub' | 'dub' | 'both'
  maturityRating: 'all' | 'teen' | 'mature'
  watchedAnime: string[] // anime IDs
  watchlist: string[] // anime IDs
  ratings: Record<string, number> // anime ID -> rating
}

// Search filters
export interface SearchFilters {
  genres?: string[]
  excludeGenres?: string[]
  year?: number | [number, number]
  format?: string[]
  status?: string[]
  source?: string[]
  minScore?: number
  minPopularity?: number
  studios?: string[]
  sort?: 'POPULARITY_DESC' | 'SCORE_DESC' | 'TRENDING_DESC' | 'START_DATE_DESC'
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: number
  requestId?: string
}

// Paginated results
export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    total: number
    page: number
    perPage: number
    hasNextPage: boolean
  }
}

// Export commonly used types as default
export type {
  Anime as default,
  SceneMatch,
  IdentificationRequest,
  IdentificationResponse,
  ProcessingStatus,
  AnimeRecommendation,
  UserPreferences,
  SearchFilters,
  ApiResponse,
  PaginatedResponse
}
