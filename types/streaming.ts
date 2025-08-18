export interface StreamingProvider {
    id: string
    name: string
    logo: string
    url: string
    type: 'subscription' | 'rent' | 'buy' | 'free'
    price?: {
      amount: number
      currency: string
    }
    quality?: 'SD' | 'HD' | '4K'
    regions: string[]
  }
  
  export interface StreamingAvailability {
    animeId: number
    providers: StreamingProvider[]
    lastUpdated: string
    region: string
  }
  
  export interface WatchLink {
    provider: StreamingProvider
    url: string
    episodeRange?: {
      start: number
      end: number
    }
    dubbed: boolean
    subtitled: boolean
    languages: string[]
  }
  
  export const POPULAR_PROVIDERS = {
    crunchyroll: {
      name: 'Crunchyroll',
      logo: '/providers/crunchyroll.svg',
      baseUrl: 'https://www.crunchyroll.com'
    },
    netflix: {
      name: 'Netflix',
      logo: '/providers/netflix.svg',
      baseUrl: 'https://www.netflix.com'
    },
    funimation: {
      name: 'Funimation',
      logo: '/providers/funimation.svg',
      baseUrl: 'https://www.funimation.com'
    },
    hulu: {
      name: 'Hulu',
      logo: '/providers/hulu.svg',
      baseUrl: 'https://www.hulu.com'
    },
    hidive: {
      name: 'HIDIVE',
      logo: '/providers/hidive.svg',
      baseUrl: 'https://www.hidive.com'
    }
  } as const
  