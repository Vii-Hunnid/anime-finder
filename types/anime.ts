export interface Anime {
  id: number
  title: {
    romaji: string
    english?: string
    native: string
  }
  description?: string
  coverImage: {
    large: string
    medium: string
    color?: string
  }
  bannerImage?: string
  episodes?: number
  duration?: number
  status: 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED'
  season?: 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL'
  seasonYear?: number
  genres: string[]
  tags: Array<{
    name: string
    rank: number
  }>
  studios: Array<{
    name: string
  }>
  averageScore?: number
  meanScore?: number
  popularity: number
  format: 'TV' | 'MOVIE' | 'OVA' | 'ONA' | 'SPECIAL' | 'MUSIC'
  source: 'ORIGINAL' | 'MANGA' | 'ANIME' | 'LIGHT_NOVEL' | 'VISUAL_NOVEL' | 'VIDEO_GAME' | 'OTHER'
  siteUrl: string
}

export interface AnimeScene {
  description: string
  episode?: number
  timestamp?: string
  characters?: string[]
  setting?: string
  emotions?: string[]
  visualElements?: string[]
  dialogue?: string[]
  actions?: string[]
}

export interface SceneMatch {
  anime: Anime
  confidence: number
  reasoning: string
  matchedElements: string[]
  episode?: number
  timestamp?: string
  score?: number
}

export interface AnimeCharacter {
  id: number
  name: {
    full: string
    native?: string
  }
  image?: {
    large: string
    medium: string
  }
  description?: string
  role?: 'MAIN' | 'SUPPORTING' | 'BACKGROUND'
}

export interface AnimeStudio {
  id: number
  name: string
  isAnimationStudio: boolean
  siteUrl?: string
}

export interface AnimeTag {
  id: number
  name: string
  description?: string
  category?: string
  rank?: number
  isMediaSpoiler?: boolean
  isGeneralSpoiler?: boolean
}

export interface AnimeStats {
  scoreDistribution?: Array<{
    score: number
    amount: number
  }>
  statusDistribution?: Array<{
    status: string
    amount: number
  }>
}

export interface AnimeRelation {
  id: number
  relationType: 'SEQUEL' | 'PREQUEL' | 'SIDE_STORY' | 'ALTERNATIVE' | 'SUMMARY' | 'OTHER'
  anime: Anime
}

// Utility types for search and filtering
export type AnimeStatus = Anime['status']
export type AnimeFormat = Anime['format']
export type AnimeSeason = Anime['season']
export type AnimeSource = Anime['source']

export interface AnimeSearchFilters {
  genres?: string[]
  tags?: string[]
  year?: number
  season?: AnimeSeason
  format?: AnimeFormat
  status?: AnimeStatus
  source?: AnimeSource
  minimumScore?: number
  sort?: 'POPULARITY_DESC' | 'SCORE_DESC' | 'TITLE_ROMAJI' | 'START_DATE_DESC'
}

export interface AnimeSearchResult {
  data: Anime[]
  pageInfo: {
    total: number
    currentPage: number
    lastPage: number
    hasNextPage: boolean
    perPage: number
  }
}
