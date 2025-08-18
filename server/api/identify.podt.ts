// server/api/identify.post.ts
import type { IdentificationRequest, IdentificationResponse } from '~/types/identification'
import type { Anime, SceneMatch } from '~/types/anime'

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
    
    if (description.length < 5) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Description must be at least 5 characters long'
      })
    }

    // Use AI to identify the anime
    const aiResult = await identifyAnimeWithAI(description, body.additionalInfo)
    
    const searchTime = Date.now() - startTime

    return {
      success: true,
      matches: aiResult.matches,
      query: {
        processedDescription: description,
        extractedElements: aiResult.extractedElements
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
      error: error instanceof Error ? error.message : 'Failed to identify anime'
    }
  }
})

async function identifyAnimeWithAI(
  description: string, 
  additionalInfo?: any
): Promise<{
  matches: SceneMatch[]
  extractedElements: any
}> {
  const aiClient = useAIClient()
  
  const systemPrompt = `You are an expert anime identifier with comprehensive knowledge of anime from 1960s to 2024. You can identify anime from scene descriptions, character details, plot points, and visual elements.

Your expertise includes:
- Popular anime (Naruto, One Piece, Attack on Titan, etc.)
- Niche and indie anime
- Classic anime from different eras
- Movies, OVAs, and web series
- Different animation studios and their distinctive styles

Analyze the user's description and identify the most likely anime matches. Focus on:
- Character names, appearances, and unique traits
- Distinctive plot elements or scenes
- Animation style and visual characteristics
- Setting and world-building elements
- Memorable quotes or dialogue

Always provide confidence scores and detailed reasoning.`

  const userPrompt = `Identify the anime from this description: "${description}"

${additionalInfo?.approximateYear ? `Time period hint: ${additionalInfo.approximateYear}` : ''}
${additionalInfo?.genre ? `Genre hint: ${additionalInfo.genre}` : ''}
${additionalInfo?.style ? `Animation style: ${additionalInfo.style}` : ''}

Provide your response in this exact JSON format:
{
  "matches": [
    {
      "title": {
        "romaji": "Japanese title",
        "english": "English title if available",
        "native": "Native script title"
      },
      "confidence": 0.95,
      "reasoning": "Detailed explanation of why this matches",
      "matchedElements": ["element1", "element2"],
      "episode": 12,
      "description": "Brief anime description",
      "year": 2021,
      "genres": ["Action", "Adventure"],
      "studio": "Studio name"
    }
  ],
  "extractedElements": {
    "characters": ["character descriptions"],
    "setting": ["setting details"],
    "actions": ["actions mentioned"],
    "emotions": ["emotional elements"],
    "visualStyle": ["visual characteristics"]
  }
}

Provide up to 3 matches, ordered by confidence. If you're not confident about any matches, be honest about it.`

  try {
    const response = await aiClient.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    const aiResponse = JSON.parse(content)
    
    // Convert AI response to proper SceneMatch format
    const matches: SceneMatch[] = aiResponse.matches.map((match: any) => ({
      anime: {
        id: Math.floor(Math.random() * 100000), // Generate temporary ID
        title: match.title,
        description: match.description,
        coverImage: {
          large: `https://via.placeholder.com/300x400?text=${encodeURIComponent(match.title.english || match.title.romaji)}`,
          medium: `https://via.placeholder.com/200x300?text=${encodeURIComponent(match.title.english || match.title.romaji)}`
        },
        episodes: match.episodes || null,
        status: 'FINISHED' as const,
        seasonYear: match.year,
        genres: match.genres || [],
        tags: [],
        studios: match.studio ? [{ name: match.studio }] : [],
        averageScore: 85,
        popularity: 100000,
        format: 'TV' as const,
        source: 'MANGA' as const,
        siteUrl: `https://anilist.co/search/anime?search=${encodeURIComponent(match.title.romaji)}`
      },
      confidence: match.confidence,
      reasoning: match.reasoning,
      matchedElements: match.matchedElements,
      episode: match.episode
    }))

    return {
      matches,
      extractedElements: aiResponse.extractedElements
    }

  } catch (error) {
    console.error('AI identification error:', error)
    
    // Fallback response when AI fails
    return {
      matches: [{
        anime: {
          id: 0,
          title: {
            romaji: "Unknown Anime",
            english: "Could not identify",
            native: "不明"
          },
          description: "Unable to identify this anime from the description provided.",
          coverImage: {
            large: "https://via.placeholder.com/300x400?text=Unknown",
            medium: "https://via.placeholder.com/200x300?text=Unknown"
          },
          status: 'FINISHED' as const,
          genres: [],
          tags: [],
          studios: [],
          popularity: 0,
          format: 'TV' as const,
          source: 'ORIGINAL' as const,
          siteUrl: ""
        },
        confidence: 0.1,
        reasoning: "Could not identify the anime from the provided description. The AI service may be unavailable or the description may not contain enough identifying information.",
        matchedElements: []
      }],
      extractedElements: {
        characters: [],
        setting: [],
        actions: [],
        emotions: [],
        visualStyle: []
      }
    }
  }
}

// server/utils/aiClient.ts - Updated version
import OpenAI from 'openai'

let openaiClient: OpenAI | null = null

export function useAIClient(): OpenAI {
  if (!openaiClient) {
    const { openaiApiKey } = useRuntimeConfig()
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.')
    }

    openaiClient = new OpenAI({
      apiKey: openaiApiKey
    })
  }

  return openaiClient
}

// composables/useAnimeIdentify.ts - Updated to use real API
import type { IdentificationRequest, IdentificationResponse } from '~/types/identification'

export const useAnimeIdentify = () => {
  const identify = async (request: IdentificationRequest): Promise<IdentificationResponse> => {
    try {
      const response = await $fetch<IdentificationResponse>('/api/identify', {
        method: 'POST',
        body: request
      })

      return response

    } catch (error) {
      console.error('Identification error:', error)
      
      return {
        success: false,
        matches: [],
        query: {
          processedDescription: request.description,
          extractedElements: {
            characters: [],
            setting: [],
            actions: [],
            emotions: [],
            visualStyle: []
          }
        },
        searchTime: 0,
        error: error instanceof Error ? error.message : 'Failed to identify anime scene'
      }
    }
  }

  const validateDescription = (description: string): { valid: boolean; message?: string } => {
    if (!description.trim()) {
      return { valid: false, message: 'Please describe the anime scene' }
    }

    if (description.trim().length < 5) {
      return { valid: false, message: 'Please provide a more detailed description (at least 5 characters)' }
    }

    if (description.trim().length > 1000) {
      return { valid: false, message: 'Description is too long (maximum 1000 characters)' }
    }

    return { valid: true }
  }

  return {
    identify,
    validateDescription
  }
}
