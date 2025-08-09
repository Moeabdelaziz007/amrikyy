import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const lang = searchParams.get('lang') || 'en'
    const max = searchParams.get('max') || '5'

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    // Using GNews API (free tier) - you'll need to get API key from gnews.io
    const API_KEY = process.env.GNEWS_API_KEY
    
    if (!API_KEY) {
      // Fallback to mock data for development
      const mockArticles = [
        {
          title: `Latest ${query} Developments Shake Industry`,
          description: `Revolutionary ${query} breakthrough promises to transform how businesses operate worldwide.`,
          url: 'https://example.com/article1',
          publishedAt: new Date().toISOString(),
          source: { name: 'Tech News Daily' }
        },
        {
          title: `${query} Market Reaches New Heights`,
          description: `Industry experts predict massive growth in ${query} sector with new innovations.`,
          url: 'https://example.com/article2',
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: { name: 'Business Insider' }
        },
        {
          title: `Top Companies Invest Heavily in ${query}`,
          description: `Major corporations announce billion-dollar investments in ${query} technology.`,
          url: 'https://example.com/article3',
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          source: { name: 'Financial Times' }
        }
      ]

      return NextResponse.json({
        articles: mockArticles.slice(0, parseInt(max))
      })
    }

    const response = await fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=${lang}&max=${max}&apikey=${API_KEY}`
    )

    if (!response.ok) {
      throw new Error(`GNews API error: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      articles: data.articles || []
    })

  } catch (error) {
    console.error('News API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}
