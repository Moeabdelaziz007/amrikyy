import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Enhanced mock data generator for better demos
function generateMockArticles(query: string, count: number = 5) {
  const sources = ['TechCrunch', 'Wired', 'MIT Technology Review', 'VentureBeat', 'The Verge', 'Forbes Tech', 'Bloomberg Technology']
  const articleTemplates = [
    {
      titleTemplate: `${query} Revolution: How AI is Transforming Industries`,
      descriptionTemplate: `Breakthrough developments in ${query} technology are reshaping business operations worldwide, with major implications for the future.`
    },
    {
      titleTemplate: `Market Analysis: ${query} Sector Shows Record Growth`,
      descriptionTemplate: `Industry analysts report unprecedented expansion in ${query} markets as companies race to adopt new technologies.`
    },
    {
      titleTemplate: `Leading Companies Double Down on ${query} Investment`,
      descriptionTemplate: `Fortune 500 companies announce multi-billion dollar investments in ${query} research and development initiatives.`
    },
    {
      titleTemplate: `Expert Insights: The Future of ${query} in 2024`,
      descriptionTemplate: `Technology leaders share predictions about ${query} trends and their potential impact on various industries.`
    },
    {
      titleTemplate: `${query} Startup Ecosystem Attracts Record Funding`,
      descriptionTemplate: `Venture capital firms pour billions into ${query} startups as the sector demonstrates unprecedented growth potential.`
    },
    {
      titleTemplate: `New ${query} Standards Set to Transform Industry`,
      descriptionTemplate: `Industry consortium announces new ${query} standards that promise to enhance interoperability and accelerate adoption.`
    }
  ]

  return Array.from({ length: count }, (_, index) => {
    const template = articleTemplates[index % articleTemplates.length]
    const randomSource = sources[Math.floor(Math.random() * sources.length)]
    const hoursAgo = Math.floor(Math.random() * 24) + 1
    
    return {
      title: template.titleTemplate,
      description: template.descriptionTemplate,
      url: `https://example-news.com/${query.toLowerCase()}-article-${index + 1}`,
      publishedAt: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
      source: { name: randomSource },
      urlToImage: `https://images.unsplash.com/800x600/?${query}&sig=${index}`,
      content: `Full article content about ${query} developments...`
    }
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const lang = searchParams.get('lang') || 'en'
    const max = parseInt(searchParams.get('max') || '5')

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    // Try to use real API if available
    const API_KEY = process.env.GNEWS_API_KEY
    
    if (API_KEY && typeof window === 'undefined') {
      try {
        const response = await fetch(
          `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=${lang}&max=${max}&apikey=${API_KEY}`,
          { 
            headers: { 'User-Agent': 'AmrikyyAI/1.0' },
            cache: 'no-cache'
          }
        )

        if (response.ok) {
          const data = await response.json()
          if (data.articles && data.articles.length > 0) {
            return NextResponse.json({
              articles: data.articles,
              source: 'live'
            })
          }
        }
      } catch (apiError) {
        console.warn('GNews API failed, falling back to mock data:', apiError)
      }
    }

    // Always fallback to enhanced mock data for GitHub Pages deployment
    const mockArticles = generateMockArticles(query, max)

    return NextResponse.json({
      articles: mockArticles,
      source: 'demo',
      message: 'Demo mode: Using simulated news data for showcase purposes'
    })

  } catch (error) {
    console.error('News API error:', error)
    
    // Even on error, return mock data
    const query = new URL(request.url).searchParams.get('q') || 'Technology'
    const max = parseInt(new URL(request.url).searchParams.get('max') || '5')
    const mockArticles = generateMockArticles(query, max)
    
    return NextResponse.json({
      articles: mockArticles,
      source: 'fallback',
      message: 'Fallback mode: Using simulated data due to service unavailability'
    })
  }
}
