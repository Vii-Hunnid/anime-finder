export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const title = query.title as string

  if (!title) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title parameter is required'
    })
  }

  try {
    // Clean title for Fandom URL
    const searchTitle = title.replace(/[^\w\s]/g, '').replace(/\s+/g, '_')
    const wikiName = searchTitle.toLowerCase().replace(/\s+/g, '')
    
    // Try multiple Fandom wiki approaches
    const possibleWikis = [
      `${wikiName}`,
      `${wikiName}wiki`,
      `${wikiName}anime`,
      `anime`
    ]

    for (const wiki of possibleWikis) {
      try {
        // Try to get the main page image from Fandom
        const fandomApiUrl = `https://${wiki}.fandom.com/api.php?action=query&format=json&titles=Main_Page&prop=pageimages&pithumbsize=400&origin=*`
        
        const response = await fetch(fandomApiUrl, {
          headers: {
            'User-Agent': 'AnimeFinderBot/1.0'
          }
        })

        if (response.ok) {
          const data = await response.json()
          const pages = data.query?.pages

          if (pages) {
            const page = Object.values(pages)[0] as any
            if (page?.thumbnail?.source) {
              return {
                success: true,
                imageUrl: page.thumbnail.source,
                source: 'fandom',
                wiki: `${wiki}.fandom.com`
              }
            }
          }
        }

        // Try searching for the anime title specifically
        const searchUrl = `https://${wiki}.fandom.com/api.php?action=opensearch&format=json&search=${encodeURIComponent(title)}&limit=5&origin=*`
        
        const searchResponse = await fetch(searchUrl, {
          headers: {
            'User-Agent': 'AnimeFinderBot/1.0'
          }
        })

        if (searchResponse.ok) {
          const searchData = await searchResponse.json()
          const suggestions = searchData[1] // OpenSearch format: [query, titles, descriptions, urls]
          
          if (suggestions && suggestions.length > 0) {
            // Try to get image from the first search result
            const firstPage = suggestions[0]
            const pageInfoUrl = `https://${wiki}.fandom.com/api.php?action=query&format=json&titles=${encodeURIComponent(firstPage)}&prop=pageimages&pithumbsize=400&origin=*`
            
            const pageResponse = await fetch(pageInfoUrl, {
              headers: {
                'User-Agent': 'AnimeFinderBot/1.0'
              }
            })

            if (pageResponse.ok) {
              const pageData = await pageResponse.json()
              const pageInfo = Object.values(pageData.query?.pages || {})[0] as any
              
              if (pageInfo?.thumbnail?.source) {
                return {
                  success: true,
                  imageUrl: pageInfo.thumbnail.source,
                  source: 'fandom',
                  wiki: `${wiki}.fandom.com`,
                  pageTitle: firstPage,
                  fandomUrl: `https://${wiki}.fandom.com/wiki/${encodeURIComponent(firstPage.replace(/\s+/g, '_'))}`
                }
              }
            }
          }
        }

      } catch (wikiError) {
        console.log(`Failed to fetch from ${wiki}.fandom.com:`, wikiError)
        continue
      }
    }

    // If no specific wiki found, try generic anime fandom
    try {
      const genericSearchUrl = `https://anime.fandom.com/api.php?action=opensearch&format=json&search=${encodeURIComponent(title)}&limit=3&origin=*`
      
      const response = await fetch(genericSearchUrl, {
        headers: {
          'User-Agent': 'AnimeFinderBot/1.0'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const suggestions = data[1]
        
        if (suggestions && suggestions.length > 0) {
          const firstPage = suggestions[0]
          
          return {
            success: true,
            imageUrl: null, // Will be fetched separately if needed
            source: 'fandom',
            wiki: 'anime.fandom.com',
            pageTitle: firstPage,
            fandomUrl: `https://anime.fandom.com/wiki/${encodeURIComponent(firstPage.replace(/\s+/g, '_'))}`
          }
        }
      }
    } catch (genericError) {
      console.log('Generic anime fandom search failed:', genericError)
    }

    // Fallback: return basic fandom search URL
    return {
      success: true,
      imageUrl: null,
      source: 'fandom',
      wiki: 'anime.fandom.com',
      fandomUrl: `https://anime.fandom.com/wiki/Special:Search?query=${encodeURIComponent(title)}`
    }

  } catch (error) {
    console.error('Fandom API error:', error)
    
    return {
      success: false,
      error: 'Failed to fetch Fandom data',
      fallback: {
        fandomUrl: `https://anime.fandom.com/wiki/Special:Search?query=${encodeURIComponent(title)}`
      }
    }
  }
})
