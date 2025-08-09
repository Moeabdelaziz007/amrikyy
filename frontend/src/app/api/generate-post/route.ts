import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { newsSummary, tone, keyword } = await request.json()

    if (!newsSummary || !tone || !keyword) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Professional LinkedIn post generation prompt
    const toneInstructions = {
      inspirational: 'Write in an inspirational and motivational tone. Focus on opportunities, growth, and positive change.',
      technical: 'Write in a technical and analytical tone. Focus on specific details, data, and technical insights.',
      storytelling: 'Write in a narrative and personal tone. Use storytelling elements and personal connections.'
    }

    const prompt = `You are an expert LinkedIn growth strategist and viral content creator.
Your task is to write a viral LinkedIn post based on the following trending news about ${keyword}:

${newsSummary}

Requirements:
1. Start with a strong hook in the first sentence (max 12 words).
2. Use short, impactful sentences and line breaks for readability.
3. Add an emotional or thought-provoking insight.
4. End with a question or call-to-action to boost engagement.
5. Include 3–5 relevant and trending hashtags.
6. Keep it under 150 words.
7. Style: ${toneInstructions[tone as keyof typeof toneInstructions]}

Output the response in JSON format with:
- content: The LinkedIn post content
- hashtags: Array of hashtags (without #)

Only return the JSON, no extra commentary.`

    // Check if OpenAI API key is available
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY
    
    if (!OPENAI_API_KEY) {
      // Fallback to mock generation for development
      const mockPost = generateMockPost(keyword, tone, newsSummary)
      return NextResponse.json(mockPost)
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedContent = data.choices[0]?.message?.content

    if (!generatedContent) {
      throw new Error('No content generated')
    }

    // Parse the JSON response
    try {
      const parsedContent = JSON.parse(generatedContent)
      return NextResponse.json(parsedContent)
    } catch (parseError) {
      // If JSON parsing fails, create a structured response
      const fallbackPost = {
        content: generatedContent,
        hashtags: extractHashtags(generatedContent, keyword)
      }
      return NextResponse.json(fallbackPost)
    }

  } catch (error) {
    console.error('Post generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate post' },
      { status: 500 }
    )
  }
}

function generateMockPost(keyword: string, tone: string, newsSummary: string) {
  const hooks = {
    inspirational: `The future of ${keyword} is here! 🚀`,
    technical: `Breaking: ${keyword} technology advances rapidly.`,
    storytelling: `I just discovered something incredible about ${keyword}...`
  }

  const content = `${hooks[tone as keyof typeof hooks]}

The latest developments in ${keyword} are reshaping our industry in ways we never imagined.

${newsSummary.slice(0, 200)}...

This isn't just another trend – it's a fundamental shift that will impact how we work, innovate, and grow.

What's your take on the ${keyword} revolution? Are you ready for what's coming next?`

  return {
    content,
    hashtags: [keyword.toLowerCase(), 'innovation', 'technology', 'future', 'business'],
    tone
  }
}

function extractHashtags(content: string, keyword: string): string[] {
  const hashtagRegex = /#[\w]+/g
  const matches = content.match(hashtagRegex) || []
  const hashtags = matches.map(tag => tag.substring(1))
  
  // If no hashtags found, generate some based on keyword
  if (hashtags.length === 0) {
    return [keyword.toLowerCase(), 'innovation', 'technology', 'linkedin', 'business']
  }
  
  return hashtags
}
