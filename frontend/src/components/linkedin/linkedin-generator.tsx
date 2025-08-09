'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { generateMockNews, generateLinkedInPost, type NewsArticle, type GeneratedPost } from '@/lib/demo-data'
import { 
  TrendingUp, 
  Copy, 
  Search, 
  Sparkles, 
  Share2, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'

interface NewsItem {
  title: string
  description: string
  url: string
  publishedAt: string
  source: {
    name: string
  }
}

interface GeneratedPost {
  content: string
  hashtags: string[]
  tone: string
  metrics?: {
    estimatedReach?: number
    engagementRate?: string
    viralPotential?: number
  }
}

export function LinkedInGenerator() {
  const [keyword, setKeyword] = useState('')
  const [news, setNews] = useState<NewsItem[]>([])
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null)
  const [isLoadingNews, setIsLoadingNews] = useState(false)
  const [isGeneratingPost, setIsGeneratingPost] = useState(false)
  const [selectedTone, setSelectedTone] = useState<'inspirational' | 'technical' | 'storytelling'>('inspirational')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const tones = [
    { id: 'inspirational' as const, label: 'Inspirational', icon: '🚀', description: 'Motivational and uplifting content' },
    { id: 'technical' as const, label: 'Technical', icon: '⚡', description: 'Deep technical analysis' },
    { id: 'storytelling' as const, label: 'Storytelling', icon: '📖', description: 'Engaging personal narrative' }
  ]

  const fetchTrendingNews = async () => {
    if (!keyword.trim()) {
      setError('Please enter a keyword')
      return
    }

    setIsLoadingNews(true)
    setError('')
    
    try {
      const response = await fetch(`/api/news?q=${encodeURIComponent(keyword)}&lang=en&max=5`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch news')
      }
      
      const data = await response.json()
      setNews(data.articles || [])
      
      // Show demo mode message if applicable
      if (data.source === 'demo' || data.source === 'fallback') {
        setError(`✨ Demo Mode: Showing simulated trending news for "${keyword}". In production, this would fetch real-time news data.`)
      } else if (data.articles?.length === 0) {
        setError('No news found for this keyword')
      }
    } catch (err) {
      setError('Unable to fetch news. Displaying demo data instead.')
      console.error('Error fetching news:', err)
      
      // Fallback to client-side mock data
      const mockArticles = [
        {
          title: `${keyword} Technology Breakthrough Changes Everything`,
          description: `Revolutionary developments in ${keyword} promise to transform industries worldwide.`,
          url: 'https://example.com/article1',
          publishedAt: new Date().toISOString(),
          source: { name: 'Tech Innovation Daily' }
        },
        {
          title: `Market Leaders Invest Billions in ${keyword}`,
          description: `Major corporations announce unprecedented investments in ${keyword} technology.`,
          url: 'https://example.com/article2',
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: { name: 'Business Technology' }
        }
      ]
      setNews(mockArticles)
    } finally {
      setIsLoadingNews(false)
    }
  }

  const generateViralPost = async () => {
    if (news.length === 0) {
      setError('Please fetch news first')
      return
    }

    setIsGeneratingPost(true)
    setError('')

    try {
      const newsSummary = news.map(item => 
        `${item.title}: ${item.description}`
      ).join('\n\n')

      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newsSummary,
          tone: selectedTone,
          keyword
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate post')
      }

      const data = await response.json()
      setGeneratedPost(data)
      
      // Clear any demo mode errors since post generation succeeded
      if (error.includes('Demo Mode')) {
        setError('')
      }
    } catch (err) {
      setError('Post generation failed. Showing demo content instead.')
      console.error('Error generating post:', err)
      
      // Fallback to client-side generation
      const fallbackPost = {
        content: `🚀 Exciting developments in ${keyword}!

Based on the latest industry insights, ${keyword} is reshaping how we think about innovation and technology.

🌟 Key highlights:
• Revolutionary breakthroughs are emerging daily
• Industry leaders are investing heavily in this space
• The potential for transformation is unprecedented

This isn't just another trend – it's a fundamental shift that will define the future of our industry.

What's your perspective on the ${keyword} revolution? Share your thoughts below! 👇`,
        hashtags: [keyword.toLowerCase().replace(/\s+/g, ''), 'innovation', 'technology', 'future', 'business', 'trends'],
        tone: selectedTone,
        metrics: {
          estimatedReach: Math.floor(Math.random() * 3000) + 1500,
          engagementRate: '4.2%',
          viralPotential: 75
        }
      }
      setGeneratedPost(fallbackPost)
    } finally {
      setIsGeneratingPost(false)
    }
  }

  const copyToClipboard = async () => {
    if (!generatedPost) return

    const fullPost = `${generatedPost.content}\n\n${generatedPost.hashtags.join(' ')}`
    
    try {
      await navigator.clipboard.writeText(fullPost)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Share2 className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LinkedIn Viral Post Generator
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover trending news and transform them into engaging LinkedIn posts that generate thousands of views and interactions
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Input & News */}
        <div className="space-y-6">
          {/* Search Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Search Trending Topics
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keyword
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Example: AI, Blockchain, Startups, Technology"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && fetchTrendingNews()}
                />
              </div>

              <Button 
                onClick={fetchTrendingNews}
                disabled={isLoadingNews || !keyword.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                {isLoadingNews ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Fetching News...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Fetch Trending News
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Tone Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Choose Post Tone</h3>
            <div className="grid grid-cols-1 gap-3">
              {tones.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-right ${
                    selectedTone === tone.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tone.icon}</span>
                    <div>
                      <div className="font-medium">{tone.label}</div>
                      <div className="text-sm text-gray-600">{tone.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* News Results */}
          {news.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                Latest News ({news.length})
              </h3>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {news.map((item, index) => (
                    <div key={index} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">{item.title}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {item.source.name}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(item.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <Button 
                onClick={generateViralPost}
                disabled={isGeneratingPost}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {isGeneratingPost ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Viral Post
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Right Column - Generated Post */}
        <div className="space-y-6">
          {generatedPost && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Generated Post
                </h3>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className={copied ? 'bg-green-50 border-green-200' : ''}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border-r-4 border-blue-500">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {generatedPost.content}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {generatedPost.hashtags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-blue-600">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Tone: {tones.find(t => t.id === selectedTone)?.label}
                  </div>
                  
                  {generatedPost.metrics && (
                    <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-blue-600">{generatedPost.metrics.estimatedReach?.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Est. Reach</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-green-600">{generatedPost.metrics.engagementRate}</div>
                        <div className="text-xs text-gray-500">Engagement</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-purple-600">{generatedPost.metrics.viralPotential}%</div>
                        <div className="text-xs text-gray-500">Viral Score</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold mb-3 text-blue-900">💡 Tips for Best Results</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                Use specific keywords (AI, Blockchain, Tech Startups)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                Choose the tone that fits your target audience
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                Post during peak hours to increase views
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                Engage with comments to boost reach
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
