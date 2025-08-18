// Streaming platform types
export interface StreamingProvider {
  id: string
  name: string
  displayName: string
  logo: string
  logoSmall?: string
  website: string
  type: 'subscription' | 'rent' | 'buy' | 'free' | 'ads'
  supportedRegions: string[]
  features: {
    hasSubtitles: boolean
    hasDubbing: boolean
    hasHD: boolean
    has4K: boolean
    hasOfflineDownload: boolean
    hasSimulcast: boolean
  }
  subscription?: {
    monthlyPrice: number
    yearlyPrice?: number
    currency: string
    freeTrial?: {
      days: number
      restrictions?: string[]
    }
  }
}

// Individual streaming link
export interface WatchLink {
  provider: StreamingProvider
  url: string
  region: string[]
  quality: ('480p' | '720p' | '1080p' | '4K')[]
  language: {
    subtitles: string[]
    dubbing: string[]
  }
  pricing?: {
    rent?: {
      sd?: { amount: number; currency: string }
      hd?: { amount: number; currency: string }
      uhd?: { amount: number; currency: string }
    }
    buy?: {
      sd?: { amount: number; currency: string }
      hd?: { amount: number; currency: string }
      uhd?: { amount: number; currency: string }
    }
  }
  availability: {
    from?: string // ISO date
    until?: string // ISO date
    episodeRange?: {
      start: number
      end: number
    }
  }
  deepLink?: {
    ios?: string
    android?: string
    web: string
  }
  lastUpdated: string
}

// Streaming availability response
export interface StreamingAvailability {
  animeId: string
  animeTitle: string
  links: WatchLink[]
  lastChecked: string
  region: string
  totalProviders: number
  freeOptions: WatchLink[]
  subscriptionOptions: WatchLink[]
  rentalOptions: WatchLink[]
  purchaseOptions: WatchLink[]
}

// Region-specific availability
export interface RegionalAvailability {
  region: string
  countryCode: string
  available: boolean
  providers: {
    free: StreamingProvider[]
    subscription: StreamingProvider[]
    rental: StreamingProvider[]
    purchase: StreamingProvider[]
  }
  restrictions?: {
    ageRating?: string
    contentWarnings?: string[]
    geoblocked?: boolean
  }
}

// Streaming search request
export interface StreamingSearchRequest {
  animeId?: string
  title: string
  alternativeTitles?: string[]
  year?: number
  region?: string
  providers?: string[] // specific providers to search
  types?: ('subscription' | 'rent' | 'buy' | 'free')[]
  maxResults?: number
}

// Streaming search response
export interface StreamingSearchResponse {
  success: boolean
  availability: StreamingAvailability
  recommendations?: {
    similarAvailable: Array<{
      anime: {
        id: string
        title: string
        coverImage: string
      }
      providers: string[]
    }>
  }
  error?: string
  searchMetadata: {
    searchTerms: string[]
    providersChecked: string[]
    regionsChecked: string[]
    lastUpdated: string
  }
}

// Popular streaming providers (predefined)
export const POPULAR_PROVIDERS: Record<string, Partial<StreamingProvider>> = {
  crunchyroll: {
    id: 'crunchyroll',
    name: 'Crunchyroll',
    displayName: 'Crunchyroll',
    type: 'subscription',
    website: 'https://www.crunchyroll.com'
  },
  netflix: {
    id: 'netflix',
    name: 'Netflix',
    displayName: 'Netflix',
    type: 'subscription',
    website: 'https://www.netflix.com'
  },
  'prime-video': {
    id: 'prime-video',
    name: 'Amazon Prime Video',
    displayName: 'Prime Video',
    type: 'subscription',
    website: 'https://www.primevideo.com'
  },
  'disney-plus': {
    id: 'disney-plus',
    name: 'Disney+',
    displayName: 'Disney+',
    type: 'subscription',
    website: 'https://www.disneyplus.com'
  },
  funimation: {
    id: 'funimation',
    name: 'Funimation',
    displayName: 'Funimation',
    type: 'subscription',
    website: 'https://www.funimation.com'
  },
  hidive: {
    id: 'hidive',
    name: 'HIDIVE',
    displayName: 'HIDIVE',
    type: 'subscription',
    website: 'https://www.hidive.com'
  },
  hulu: {
    id: 'hulu',
    name: 'Hulu',
    displayName: 'Hulu',
    type: 'subscription',
    website: 'https://www.hulu.com'
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    displayName: 'YouTube Movies',
    type: 'rent',
    website: 'https://www.youtube.com'
  },
  'apple-tv': {
    id: 'apple-tv',
    name: 'Apple TV',
    displayName: 'Apple TV',
    type: 'rent',
    website: 'https://tv.apple.com'
  },
  vudu: {
    id: 'vudu',
    name: 'Vudu',
    displayName: 'Vudu',
    type: 'rent',
    website: 'https://www.vudu.com'
  }
}

// Regional mappings
export const REGION_CODES: Record<string, string> = {
  'US': 'United States',
  'CA': 'Canada',
  'GB': 'United Kingdom',
  'AU': 'Australia',
  'DE': 'Germany',
  'FR': 'France',
  'JP': 'Japan',
  'BR': 'Brazil',
  'MX': 'Mexico',
  'IN': 'India',
  'KR': 'South Korea',
  'SA': 'South Africa'
}

export type {
  StreamingProvider,
  WatchLink,
  StreamingAvailability,
  RegionalAvailability,
  StreamingSearchRequest,
  StreamingSearchResponse
}
