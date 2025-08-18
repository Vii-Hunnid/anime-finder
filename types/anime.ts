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
  }
  
  export interface SceneMatch {
    anime: Anime
    confidence: number
    reasoning: string
    matchedElements: string[]
    episode?: number
    timestamp?: string
  }
  