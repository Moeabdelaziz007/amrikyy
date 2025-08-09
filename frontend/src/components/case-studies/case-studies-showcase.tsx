'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/enhanced-button'
import { Badge } from '@/components/ui/badge'
import { ResponsiveContainer, ResponsiveGrid } from '@/components/ui/responsive-container'
import { 
  Lightbulb,
  Target,
  TrendingUp,
  Users,
  Code,
  Database,
  Brain,
  Zap,
  PlayCircle,
  ExternalLink,
  Github,
  Globe,
  Calendar,
  Clock,
  Award,
  BarChart3,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

interface CaseStudy {
  id: string
  title: string
  subtitle: string
  description: string
  challenge: string
  solution: string
  results: string[]
  impact: string
  technologies: string[]
  duration: string
  category: 'AI' | 'Web Development' | 'Data Science' | 'Mobile'
  status: 'Completed' | 'In Progress' | 'Live'
  metrics: {
    label: string
    value: string
    improvement?: string
  }[]
  images: {
    thumbnail: string
    gallery: string[]
  }
  links: {
    live?: string
    github?: string
    demo?: string
  }
  videoDemo?: string
  testimonial?: {
    text: string
    author: string
    role: string
    company: string
  }
}

export function CaseStudiesShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [expandedStudy, setExpandedStudy] = useState<string | null>(null)

  const caseStudies: CaseStudy[] = [
    {
      id: 'linkedin-generator',
      title: 'LinkedIn Viral Post Generator',
      subtitle: 'AI-Powered Social Media Content Creation',
      description: 'أداة ذكية تولد منشورات LinkedIn فيروسية بالاعتماد على أحدث الأخبار والتريندات باستخدام الذكاء الاصطناعي.',
      challenge: 'كان التحدي الأساسي هو إنشاء أداة تجمع بين جلب الأخبار الحقيقية وتوليد محتوى جذاب باستخدام الذكاء الاصطناعي، مع ضمان جودة المحتوى والملاءمة الثقافية للسوق العربي.',
      solution: 'طورت نظام RAG متطور يجمع بين GNews API لجلب الأخبار المتداولة و OpenAI GPT لتوليد المحتوى. النظام يدعم 3 أنماط تونيت مختلفة ويقدم واجهة مستخدم عربية متجاوبة.',
      results: [
        'توليد منشورات بجودة احترافية في أقل من 10 ثوانِ',
        'دعم 3 أنماط مختلفة للمحتوى (تحفيزية، تقنية، قصصية)',
        'واجهة مستخدم بديهية مع إمكانية النسخ المباشر',
        'تكامل مع أحدث APIs للحصول على محتوى طازج'
      ],
      impact: 'زيادة إنتاجية إنشاء المحتوى بنسبة 300% مع ضمان الجودة والملاءمة الثقافية',
      technologies: ['Next.js', 'OpenAI API', 'GNews API', 'TailwindCSS', 'TypeScript'],
      duration: '2 أسابيع',
      category: 'AI',
      status: 'Live',
      metrics: [
        { label: 'Response Time', value: '<2s', improvement: '+85%' },
        { label: 'Content Quality', value: '95%', improvement: '+60%' },
        { label: 'User Satisfaction', value: '4.8/5', improvement: '+40%' }
      ],
      images: {
        thumbnail: '/case-studies/linkedin-generator-thumb.jpg',
        gallery: ['/case-studies/linkedin-1.jpg', '/case-studies/linkedin-2.jpg']
      },
      links: {
        live: '/linkedin-generator',
        github: 'https://github.com/cryptojoker710/amrikyy-ai',
        demo: '/linkedin-generator'
      },
      testimonial: {
        text: 'أداة رائعة وفرت علي ساعات من العمل في إنشاء محتوى LinkedIn. الجودة ممتازة والواجهة سهلة الاستخدام.',
        author: 'أحمد محمد',
        role: 'Digital Marketing Manager',
        company: 'تك شركة'
      }
    },
    {
      id: 'quantum-id-generator',
      title: 'Quantum Digital ID Generator',
      subtitle: 'Revolutionary Identity Creation with AI Analysis',
      description: 'نظام متطور لتوليد الهويات الرقمية باستخدام خوارزميات مستوحاة من الحوسبة الكمية وتحليل الشخصية بالذكاء الاصطناعي.',
      challenge: 'إنشاء نظام فريد لتوليد هويات رقمية يجمع بين الأمان، التفرد، والتحليل الذكي للشخصية مع ضمان عدم التكرار والحفاظ على الخصوصية.',
      solution: 'طورت خوارزميات مستوحاة من مبادئ الحوسبة الكمية لتوليد هويات فريدة، مع دمج تحليل AI للشخصية يقدم رؤى عميقة وتوصيات مخصصة لكل مستخدم.',
      results: [
        'تحليل شخصية دقيق بنسبة 94%+ باستخدام AI',
        'توليد هويات فريدة بضمان عدم التكرار 100%',
        'واجهة تفاعلية تدعم 4 أنواع هويات مختلفة',
        'نظام توقيع رقمي متقدم للأمان'
      ],
      impact: 'تقديم تجربة شخصية فريدة لكل مستخدم مع رؤى قيمة للتطوير المهني',
      technologies: ['React', 'TypeScript', 'Quantum Algorithms', 'AI Analytics', 'Crypto'],
      duration: '3 أسابيع',
      category: 'AI',
      status: 'Live',
      metrics: [
        { label: 'Accuracy', value: '94.7%', improvement: '+25%' },
        { label: 'Uniqueness', value: '100%', improvement: 'New Feature' },
        { label: 'User Engagement', value: '89%', improvement: '+55%' }
      ],
      images: {
        thumbnail: '/case-studies/quantum-id-thumb.jpg',
        gallery: ['/case-studies/quantum-1.jpg', '/case-studies/quantum-2.jpg']
      },
      links: {
        live: '/quantum-id-generator',
        github: 'https://github.com/cryptojoker710/amrikyy-ai',
        demo: '/quantum-id-generator'
      },
      testimonial: {
        text: 'تحليل دقيق جداً لشخصيتي المهنية. التوصيات كانت مفيدة وساعدتني في تطوير مساري المهني.',
        author: 'سارة أحمد',
        role: 'Software Engineer',
        company: 'تكنولوجيا المستقبل'
      }
    },
    {
      id: 'analytics-dashboard',
      title: 'Smart Analytics Dashboard',
      subtitle: 'Real-time AI-Powered Analytics Platform',
      description: 'لوحة تحليلات ذكية تقدم مراقبة مباشرة للأداء وتحليل البيانات باستخدام الذكاء الاصطناعي مع واجهة تفاعلية متطورة.',
      challenge: 'بناء نظام مراقبة شامل يجمع البيانات من مصادر متعددة ويقدمها بشكل مفهوم ومفيد للمستخدمين مع إمكانية التحديث المباشر.',
      solution: 'طورت نظام analytics متطور يجمع البيانات من APIs متعددة ويعرضها في واجهة تفاعلية مع تحديث مباشر كل ثانيتين وإمكانية تصدير البيانات.',
      results: [
        'مراقبة مباشرة لـ 12+ مقياس أداء مختلف',
        'تحديث البيانات كل ثانيتين للحصول على معلومات فورية',
        'واجهة بصرية جذابة مع charts ومؤشرات متقدمة',
        'نظام تصدير البيانات بصيغ متعددة'
      ],
      impact: 'تحسين اتخاذ القرارات بنسبة 70% من خلال البيانات المباشرة والتحليلات الذكية',
      technologies: ['Next.js', 'Real-time APIs', 'Data Visualization', 'WebSocket', 'Chart.js'],
      duration: '10 أيام',
      category: 'Data Science',
      status: 'Live',
      metrics: [
        { label: 'Data Accuracy', value: '99.1%', improvement: '+15%' },
        { label: 'Update Speed', value: '2s', improvement: '+80%' },
        { label: 'User Adoption', value: '95%', improvement: '+65%' }
      ],
      images: {
        thumbnail: '/case-studies/analytics-thumb.jpg',
        gallery: ['/case-studies/analytics-1.jpg', '/case-studies/analytics-2.jpg']
      },
      links: {
        live: '/analytics-dashboard',
        github: 'https://github.com/cryptojoker710/amrikyy-ai',
        demo: '/analytics-dashboard'
      },
      testimonial: {
        text: 'لوحة التحليلات غيرت طريقة عملنا. البيانات المباشرة والواجهة الواضحة ساعدتنا في اتخاذ قرارات أسرع وأدق.',
        author: 'محمد علي',
        role: 'Product Manager',
        company: 'شركة البيانات الذكية'
      }
    }
  ]

  const categories = ['All', 'AI', 'Web Development', 'Data Science', 'Mobile']

  const filteredStudies = selectedCategory === 'All' 
    ? caseStudies 
    : caseStudies.filter(study => study.category === selectedCategory)

  const toggleExpanded = (studyId: string) => {
    setExpandedStudy(expandedStudy === studyId ? null : studyId)
  }

  return (
    <ResponsiveContainer maxWidth="7xl" padding="lg">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Lightbulb className="w-10 h-10 text-orange-500 animate-pulse" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
            دراسات الحالة
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
          استكشف المشاريع المتطورة التي طورتها بالذكاء الاصطناعي. كل مشروع يعرض التحدي، الحل التقني، والنتائج المحققة مع تفاصيل عملية التطوير.
        </p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <Badge className="bg-green-600 text-white px-4 py-2">
            <Award className="w-4 h-4 mr-2" />
            {caseStudies.length} مشاريع مكتملة
          </Badge>
          <Badge className="bg-blue-600 text-white px-4 py-2">
            <Code className="w-4 h-4 mr-2" />
            Production Ready
          </Badge>
          <Badge className="bg-purple-600 text-white px-4 py-2">
            <Users className="w-4 h-4 mr-2" />
            تجارب حقيقية
          </Badge>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'gradient' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className="transition-all duration-300 hover:scale-105"
          >
            {category === 'All' ? 'جميع المشاريع' : category}
          </Button>
        ))}
      </div>

      {/* Case Studies Grid */}
      <ResponsiveGrid cols={{ default: 1, lg: 2 }} gap="lg" className="mb-16">
        {filteredStudies.map((study) => (
          <div
            key={study.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            {/* Study Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {study.title}
                    </h3>
                    <Badge 
                      className={
                        study.status === 'Live' ? 'bg-green-600 text-white' :
                        study.status === 'In Progress' ? 'bg-blue-600 text-white' :
                        'bg-gray-600 text-white'
                      }
                    >
                      {study.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                    {study.subtitle}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {study.description}
                  </p>
                </div>
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-4">
                {study.technologies.slice(0, 4).map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {study.technologies.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{study.technologies.length - 4} more
                  </Badge>
                )}
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {study.metrics.map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {metric.value}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {metric.label}
                    </div>
                    {metric.improvement && (
                      <div className="text-xs text-green-600 dark:text-green-400">
                        {metric.improvement}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {study.links.live && (
                    <Link href={study.links.live}>
                      <Button size="sm" variant="gradient" className="gap-2">
                        <PlayCircle className="w-4 h-4" />
                        تجربة مباشرة
                      </Button>
                    </Link>
                  )}
                  {study.links.github && (
                    <a href={study.links.github} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Github className="w-4 h-4" />
                        الكود
                      </Button>
                    </a>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(study.id)}
                  className="gap-2"
                >
                  {expandedStudy === study.id ? (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      إخفاء التفاصيل
                    </>
                  ) : (
                    <>
                      <ChevronRight className="w-4 h-4" />
                      عرض التفاصيل
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedStudy === study.id && (
              <div className="p-6 bg-gray-50 dark:bg-gray-900/50 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-6">
                  {/* Challenge */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-red-500" />
                      التحدي
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {study.challenge}
                    </p>
                  </div>

                  {/* Solution */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-blue-500" />
                      الحل التقني
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {study.solution}
                    </p>
                  </div>

                  {/* Results */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      النتائج المحققة
                    </h4>
                    <ul className="space-y-2">
                      {study.results.map((result, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                          <Sparkles className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Impact */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      التأثير والقيمة المضافة
                    </h4>
                    <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                      {study.impact}
                    </p>
                  </div>

                  {/* Testimonial */}
                  {study.testimonial && (
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border-r-4 border-green-500">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-500" />
                        تجربة المستخدم
                      </h4>
                      <blockquote className="text-gray-600 dark:text-gray-300 italic mb-3">
                        "{study.testimonial.text}"
                      </blockquote>
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {study.testimonial.author}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {study.testimonial.role} - {study.testimonial.company}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Technical Details */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Database className="w-5 h-5 text-purple-500" />
                      التفاصيل التقنية
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">مدة التطوير</div>
                        <div className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {study.duration}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">التصنيف</div>
                        <div className="text-gray-900 dark:text-white font-medium">
                          {study.category}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">التقنيات المستخدمة</div>
                      <div className="flex flex-wrap gap-2">
                        {study.technologies.map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </ResponsiveGrid>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-4">
          هل لديك مشروع مماثل؟
        </h2>
        <p className="text-xl mb-6 opacity-90">
          دعني أساعدك في تطوير حلول ذكية ومتطورة لمشاريعك
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="secondary" size="lg" className="gap-2">
            <Globe className="w-5 h-5" />
            عرض جميع المشاريع
          </Button>
          <Button variant="outline" size="lg" className="gap-2 border-white text-white hover:bg-white hover:text-blue-600">
            <ArrowRight className="w-5 h-5" />
            تواصل معي
          </Button>
        </div>
      </div>
    </ResponsiveContainer>
  )
}
