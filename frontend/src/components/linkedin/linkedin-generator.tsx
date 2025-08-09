'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
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
    { id: 'inspirational' as const, label: 'تحفيزية', icon: '🚀', description: 'محتوى ملهم ومحفز' },
    { id: 'technical' as const, label: 'تقنية', icon: '⚡', description: 'تحليل تقني عميق' },
    { id: 'storytelling' as const, label: 'قصصية', icon: '📖', description: 'سرد جذاب وشخصي' }
  ]

  const fetchTrendingNews = async () => {
    if (!keyword.trim()) {
      setError('الرجاء إدخال كلمة مفتاحية')
      return
    }

    setIsLoadingNews(true)
    setError('')
    
    try {
      // Using GNews API (free tier)
      const response = await fetch(`/api/news?q=${encodeURIComponent(keyword)}&lang=en&max=5`)
      
      if (!response.ok) {
        throw new Error('فشل في جلب الأخبار')
      }
      
      const data = await response.json()
      setNews(data.articles || [])
      
      if (data.articles?.length === 0) {
        setError('لم يتم العثور على أخبار لهذه الكلمة المفتاحية')
      }
    } catch (err) {
      setError('حدث خطأ في جلب الأخبار. تأكد من الاتصال بالإنترنت.')
      console.error('Error fetching news:', err)
    } finally {
      setIsLoadingNews(false)
    }
  }

  const generateViralPost = async () => {
    if (news.length === 0) {
      setError('الرجاء جلب الأخبار أولاً')
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
        throw new Error('فشل في توليد المنشور')
      }

      const data = await response.json()
      setGeneratedPost(data)
    } catch (err) {
      setError('حدث خطأ في توليد المنشور')
      console.error('Error generating post:', err)
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
            مولد منشورات LinkedIn الفيروسية
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          اكتشف آخر الأخبار والتريندات وحولها إلى منشورات LinkedIn جذابة تحصد آلاف المشاهدات والتفاعلات
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Input & News */}
        <div className="space-y-6">
          {/* Search Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              البحث عن التريندات
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الكلمة المفتاحية
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="مثال: AI, Blockchain, Startups, Technology"
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
                    جاري البحث...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    جلب الأخبار المتداولة
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Tone Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">اختر نبرة المنشور</h3>
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
                آخر الأخبار ({news.length})
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
                          {new Date(item.publishedAt).toLocaleDateString('ar')}
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
                    جاري التوليد...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    توليد منشور فيروسي
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
                  المنشور المولد
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
                      تم النسخ
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      نسخ
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

                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  النبرة: {tones.find(t => t.id === selectedTone)?.label}
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
            <h3 className="text-lg font-semibold mb-3 text-blue-900">💡 نصائح للحصول على أفضل النتائج</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                استخدم كلمات مفتاحية محددة (AI, Blockchain, Tech Startups)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                اختر النبرة التي تناسب جمهورك المستهدف
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                انشر في أوقات الذروة لزيادة المشاهدات
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                تفاعل مع التعليقات لزيادة الانتشار
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
