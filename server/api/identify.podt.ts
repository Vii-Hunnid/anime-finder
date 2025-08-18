import type { IdentificationRequest, IdentificationResponse, AIAnalysis } from '~/types/identification'
import type { SceneMatch } from '~/types/anime'

export default defineEventHandler(async (event): Promise<IdentificationResponse> => {
  const startTime = Date.now()
  
  try {
    const body = await readBody<IdentificationRequest>(event)
    
    if (!body.description?.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Description is required'
      })
    }

    const description = body.description.trim()
    
    if (description.length < 10) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Description must be at least 10 characters long'
      })
    }

    // Step 1: Use AI to analyze the scene description
    const aiAnalysis = await analyzeSceneWithAI(description, body.additionalInfo)
    
    // Step 2: Search anime database using AI insights
    const matches = await searchAnimeDatabase(aiAnalysis)
    
    // Step 3: Rank and filter results
    const rankedMatches = rankMatches(matches, aiAnalysis)
    
    const searchTime = Date.now() - startTime

    return {
      success: true,
      matches: rankedMatches,
      query: {
        processedDescription: description,
        extractedElements: {
          characters: aiAnalysis.scene.characters || [],
          setting: [aiAnalysis.scene.setting || ''],
          actions: extractActions(description),
          emotions: aiAnalysis.scene.emotions || [],
          visualStyle: aiAnalysis.scene.visualElements || []
        }
      },
      searchTime
    }

  } catch (error) {
    console.error('Identification error:', error)
    
    return {
      success: false,
      matches: [],
      query: {
        processedDescription: '',
        extractedElements: {
          characters: [],
          setting: [],
          actions: [],
          emotions: [],
          visualStyle: []
        }
      },
      searchTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
})

async function analyzeSceneWithAI(description: string, additionalInfo?: any): Promise<AIAnalysis> {
  const { openaiApiKey } = useRuntimeConfig()
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured')
  }

  const aiClient = useAIClient()
  
  const prompt = `You are an anime expert. Analyze this scene description and provide structured data to help identify the anime.

Scene Description: "${description}"

${additionalInfo?.approximateYear ? `Approximate Year: ${additionalInfo.approximateYear}` : ''}
${additionalInfo?.genre ? `Genre Hint: ${additionalInfo.genre}` : ''}
${additionalInfo?.style ? `Animation Style: ${additionalInfo.style}` : ''}

Please provide a JSON response with this structure:
{
  "scene": {
    "characters": ["character descriptions with hair color, clothing, etc."],
    "setting": "location description",
    "emotions": ["emotional tone words"],
    "visualElements": ["art style, colors, atmosphere"]
  },
  "possibleAnimes": [
    {
      "title": "anime title",
      "confidence": 0.95,
      "reasoning": "why this matches",
      "searchTerms": ["key terms to search for"]
    }
  ],
  "searchStrategy": {
    "primaryTerms": ["most important search terms"],
    "secondaryTerms": ["supporting search terms"],
    "excludeTerms": ["terms that would exclude wrong results"]
  }
}

Focus on unique visual elements, character designs, and memorable scenes that could help identify the specific anime.`

  try {
    const response = await aiClient.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert anime identifier. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    return JSON.parse(content) as AIAnalysis
    
  } catch (error) {
    console.error('AI Analysis error:', error)
    
    // Fallback analysis
    return {
      scene: {
        characters: extractCharacters(description),
        setting: extractSetting(description),
        emotions: extractEmotions(description),
        visualElements: extractVisualElements(description)
      },
      possibleAnimes: [],
      searchStrategy: {
        primaryTerms: description.split(' ').slice(0, 5),
        secondaryTerms: [],
        excludeTerms: []
      }
    }
  }
}

async function searchAnimeDatabase(analysis: AIAnalysis): Promise<SceneMatch[]> {
  const anilistClient = useAniListClient()
  const matches: SceneMatch[] = []

  // Search using AI-suggested anime titles
  for (const suggestion of analysis.possibleAnimes) {
    try {
      const anime = await anilistClient.searchAnime(suggestion.title)
      if (anime) {
        matches.push({
          anime,
          confidence: suggestion.confidence,
          reasoning: suggestion.reasoning,
          matchedElements: suggestion.searchTerms
        })
      }
    } catch (error) {
      console.error(`Error searching for ${suggestion.title}:`, error)
    }
  }

  // If no direct matches, search using extracted elements
  if (matches.length === 0) {
    const searchTerms = [
      ...analysis.searchStrategy.primaryTerms,
      ...analysis.scene.characters?.slice(0, 2) || [],
      analysis.scene.setting
    ].filter(Boolean).slice(0, 3)

    for (const term of searchTerms) {
      try {
        const results = await anilistClient.searchAnime(term)
        if (results) {
          matches.push({
            anime: results,
            confidence: 0.3,
            reasoning: `Matched search term: ${term}`,
            matchedElements: [term]
          })
        }
      } catch (error) {
        console.error(`Error searching for term ${term}:`, error)
      }
    }
  }

  return matches
}

function rankMatches(matches: SceneMatch[], analysis: AIAnalysis): SceneMatch[] {
  return matches
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5) // Limit to top 5 matches
    .map(match => ({
      ...match,
      confidence: Math.min(match.confidence, 0.95) // Cap confidence
    }))
}

// Helper functions for fallback analysis
function extractCharacters(description: string): string[] {
  const characters = []
  const text = description.toLowerCase()
  
  if (text.includes('blonde') || text.includes('yellow hair')) characters.push('blonde character')
  if (text.includes('pink hair')) characters.push('pink-haired character')
  if (text.includes('blue hair')) characters.push('blue-haired character')
  if (text.includes('girl') || text.includes('female')) characters.push('female character')
  if (text.includes('boy') || text.includes('male')) characters.push('male character')
  
  return characters
}

function extractSetting(description: string): string {
  const text = description.toLowerCase()
  
  if (text.includes('school')) return 'school'
  if (text.includes('rooftop')) return 'rooftop'
  if (text.includes('city')) return 'city'
  if (text.includes('forest')) return 'forest'
  if (text.includes('beach')) return 'beach'
  if (text.includes('wall')) return 'wall or fortification'
  
  return 'unknown setting'
}

function extractEmotions(description: string): string[] {
  const emotions = []
  const text = description.toLowerCase()
  
  if (text.includes('fight') || text.includes('battle')) emotions.push('intense')
  if (text.includes('cry') || text.includes('sad')) emotions.push('sad')
  if (text.includes('happy') || text.includes('smile')) emotions.push('happy')
  if (text.includes('angry')) emotions.push('angry')
  if (text.includes('love') || text.includes('confess')) emotions.push('romantic')
  
  return emotions
}

function extractVisualElements(description: string): string[] {
  const elements = []
  const text = description.toLowerCase()
  
  if (text.includes('giant')) elements.push('large scale')
  if (text.includes('sunset')) elements.push('sunset lighting')
  if (text.includes('dark')) elements.push('dark atmosphere')
  if (text.includes('bright')) elements.push('bright colors')
  
  return elements
}

function extractActions(description: string): string[] {
  const actions = []
  const text = description.toLowerCase()
  
  if (text.includes('fight') || text.includes('battle')) actions.push('fighting')
  if (text.includes('run')) actions.push('running')
  if (text.includes('walk')) actions.push('walking')
  if (text.includes('fly')) actions.push('flying')
  if (text.includes('cook')) actions.push('cooking')
  
  return actions
}
