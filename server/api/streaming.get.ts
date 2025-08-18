export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const title = query.title as string
    const animeId = query.animeId as string
  
    if (!title) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title parameter is required'
      })
    }
  
    try {
      const streamingLinks: Array<{
        provider: {
          id: string
          name: string
          logo: string
          type: 'subscription' | 'rent' | 'buy' | 'free'
          price?: { amount: string; currency: string }
        }
        url: string
        region: string[]
        quality: string[]
      }> = []
  
      // Generate referral/search links for major streaming platforms
      const encodedTitle = encodeURIComponent(title)
      const searchTitle = title.replace(/[^\w\s]/g, '').toLowerCase()
  
      // Crunchyroll
      streamingLinks.push({
        provider: {
          id: 'crunchyroll',
          name: 'Crunchyroll',
          logo: 'https://img.icons8.com/color/48/crunchyroll.png',
          type: 'subscription'
        },
        url: `https://www.crunchyroll.com/search?q=${encodedTitle}&type=series`,
        region: ['US', 'CA', 'GB', 'AU', 'DE', 'FR'],
        quality: ['1080p', '720p']
      })
  
      // Netflix
      streamingLinks.push({
        provider: {
          id: 'netflix',
          name: 'Netflix',
          logo: 'https://img.icons8.com/color/48/netflix.png',
          type: 'subscription'
        },
        url: `https://www.netflix.com/search?q=${encodedTitle}`,
        region: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP'],
        quality: ['4K', '1080p', '720p']
      })
  
      // Amazon Prime Video
      streamingLinks.push({
        provider: {
          id: 'prime-video',
          name: 'Amazon Prime Video',
          logo: 'https://img.icons8.com/color/48/amazon-prime-video.png',
          type: 'subscription'
        },
        url: `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodedTitle}`,
        region: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP'],
        quality: ['4K', '1080p', '720p']
      })
  
      // Disney+
      streamingLinks.push({
        provider: {
          id: 'disney-plus',
          name: 'Disney+',
          logo: 'https://img.icons8.com/color/48/disney-plus.png',
          type: 'subscription'
        },
        url: `https://www.disneyplus.com/search?q=${encodedTitle}`,
        region: ['US', 'CA', 'GB', 'AU', 'DE', 'FR'],
        quality: ['4K', '1080p']
      })
  
      // Hulu
      streamingLinks.push({
        provider: {
          id: 'hulu',
          name: 'Hulu',
          logo: 'https://img.icons8.com/color/48/hulu.png',
          type: 'subscription'
        },
        url: `https://www.hulu.com/search?q=${encodedTitle}`,
        region: ['US'],
        quality: ['1080p', '720p']
      })
  
      // Funimation (now part of Crunchyroll)
      streamingLinks.push({
        provider: {
          id: 'funimation',
          name: 'Funimation',
          logo: 'https://img.icons8.com/color/48/000000/funimation.png',
          type: 'subscription'
        },
        url: `https://www.funimation.com/search/?q=${encodedTitle}`,
        region: ['US', 'CA', 'GB', 'AU'],
        quality: ['1080p', '720p']
      })
  
      // HIDIVE
      streamingLinks.push({
        provider: {
          id: 'hidive',
          name: 'HIDIVE',
          logo: 'https://img.icons8.com/color/48/000000/hidive.png',
          type: 'subscription'
        },
        url: `https://www.hidive.com/search?q=${encodedTitle}`,
        region: ['US', 'CA'],
        quality: ['1080p', '720p']
      })
  
      // YouTube (for free/rental options)
      streamingLinks.push({
        provider: {
          id: 'youtube',
          name: 'YouTube Movies',
          logo: 'https://img.icons8.com/color/48/youtube-play.png',
          type: 'rent',
          price: { amount: '$3.99', currency: 'USD' }
        },
        url: `https://www.youtube.com/results?search_query=${encodedTitle}+anime+full`,
        region: ['US', 'CA', 'GB', 'AU'],
        quality: ['1080p', '720p']
      })
  
      // Apple TV
      streamingLinks.push({
        provider: {
          id: 'apple-tv',
          name: 'Apple TV',
          logo: 'https://img.icons8.com/color/48/apple-tv.png',
          type: 'rent',
          price: { amount: '$4.99', currency: 'USD' }
        },
        url: `https://tv.apple.com/search?term=${encodedTitle}`,
        region: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP'],
        quality: ['4K', '1080p']
      })
  
      // Vudu
      streamingLinks.push({
        provider: {
          id: 'vudu',
          name: 'Vudu',
          logo: 'https://img.icons8.com/color/48/vudu.png',
          type: 'rent',
          price: { amount: '$3.99', currency: 'USD' }
        },
        url: `https://www.vudu.com/content/movies/search/${encodedTitle}`,
        region: ['US'],
        quality: ['4K', '1080p', '720p']
      })
  
      // Try to use actual streaming availability API if available
      try {
        // This would integrate with services like JustWatch API, Watchmode API, etc.
        // For now, we'll filter the list based on common availability
        
        // Simulate some logic for filtering based on anime popularity/availability
        const popularStreamingServices = ['crunchyroll', 'netflix', 'prime-video', 'funimation']
        const availableLinks = streamingLinks.filter(link => 
          popularStreamingServices.includes(link.provider.id)
        )
  
        // Add the filtered free/rental options
        const additionalOptions = streamingLinks.filter(link => 
          ['youtube', 'apple-tv'].includes(link.provider.id)
        )
  
        return {
          success: true,
          links: [...availableLinks, ...additionalOptions],
          totalProviders: streamingLinks.length,
          note: 'Search results may vary by region. Click to search on each platform.'
        }
  
      } catch (apiError) {
        console.log('Streaming API integration failed, using fallback links')
        
        // Return top streaming services as fallback
        const fallbackLinks = streamingLinks.filter(link => 
          ['crunchyroll', 'netflix', 'prime-video', 'disney-plus'].includes(link.provider.id)
        )
        
        return {
          success: true,
          links: fallbackLinks,
          totalProviders: fallbackLinks.length,
          note: 'Showing popular streaming platforms. Availability may vary by region.'
        }
      }
  
    } catch (error) {
      console.error('Streaming links error:', error)
      
      return {
        success: false,
        error: 'Failed to generate streaming links',
        fallback: {
          crunchyroll: `https://www.crunchyroll.com/search?q=${encodeURIComponent(title)}`,
          netflix: `https://www.netflix.com/search?q=${encodeURIComponent(title)}`,
          primevideo: `https://www.primevideo.com/search?phrase=${encodeURIComponent(title)}`
        }
      }
    }
  })
  