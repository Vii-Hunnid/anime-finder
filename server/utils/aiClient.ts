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

export async function generateAnimeIdentification(
  description: string, 
  additionalInfo?: {
    approximateYear?: string
    genre?: string
    style?: string
  }
): Promise<{
  analysis: any
  confidence: number
  reasoning: string
}> {
  const client = useAIClient()

  const systemPrompt = `You are an expert anime identifier with extensive knowledge of anime from the 1960s to 2024. Your job is to analyze scene descriptions and identify the most likely anime matches.

Key capabilities:
- Recognize distinctive visual elements, character designs, and art styles
- Identify memorable scenes from popular and obscure anime
- Understand contextual clues like time period, genre, and animation style
- Provide confidence scores and detailed reasoning

Always respond with structured JSON data that includes:
1. Scene analysis (characters, setting, emotions, visual elements)
2. Possible anime matches with confidence scores
3. Search strategy for database queries
4. Detailed reasoning for each match`

  const userPrompt = `Analyze this anime scene description and identify possible matches:

Description: "${description}"

${additionalInfo?.approximateYear ? `Time Period: ${additionalInfo.approximateYear}` : ''}
${additionalInfo?.genre ? `Genre: ${additionalInfo.genre}` : ''}
${additionalInfo?.style ? `Animation Style: ${additionalInfo.style}` : ''}

Please provide a detailed analysis in JSON format with:
1. Extracted scene elements
2. Top 3-5 possible anime matches with confidence scores (0.0-1.0)
3. Reasoning for each match
4. Search terms for database queries

Focus on unique, identifying features that distinguish this anime from others.`

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response generated')
    }

    const analysis = JSON.parse(content)
    
    return {
      analysis,
      confidence: analysis.topMatch?.confidence || 0.5,
      reasoning: analysis.topMatch?.reasoning || 'AI analysis completed'
    }

  } catch (error) {
    console.error('AI generation error:', error)
    throw new Error('Failed to analyze scene with AI')
  }
}

export async function generateRecommendations(
  baseAnime: { title: string; genres: string[]; tags: string[] },
  userPreferences?: { genres?: string[]; excludeGenres?: string[] }
): Promise<{
  recommendations: Array<{
    title: string
    reasoning: string
    confidence: number
    genres: string[]
  }>
}> {
  const client = useAIClient()

  const prompt = `Based on the anime "${baseAnime.title}" with genres [${baseAnime.genres.join(', ')}], recommend 5 similar anime that the user might enjoy.

Consider:
- Similar themes and storytelling style
- Character dynamics and development
- Visual style and production quality
- Emotional tone and pacing

${userPreferences?.genres?.length ? `User likes: ${userPreferences.genres.join(', ')}` : ''}
${userPreferences?.excludeGenres?.length ? `User dislikes: ${userPreferences.excludeGenres.join(', ')}` : ''}

Provide recommendations as JSON with title, reasoning, confidence score, and genres for each.`

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an anime recommendation expert. Provide thoughtful, diverse recommendations based on user preferences. Always respond with valid JSON.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.4,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No recommendations generated')
    }

    return JSON.parse(content)

  } catch (error) {
    console.error('Recommendation generation error:', error)
    throw new Error('Failed to generate recommendations')
  }
}
