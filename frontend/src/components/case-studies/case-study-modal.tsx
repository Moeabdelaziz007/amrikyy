'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/enhanced-button'
import { Badge } from '@/components/ui/badge'
import { FocusTrap } from '@/components/ui/accessibility-helpers'
import { 
  X,
  Target,
  Brain,
  TrendingUp,
  Zap,
  Users,
  Database,
  Clock,
  PlayCircle,
  Github,
  ExternalLink,
  Download,
  Star,
  Calendar,
  Award,
  Lightbulb,
  Code,
  BarChart3
} from 'lucide-react'

interface CaseStudyModalProps {
  study: {
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
    category: string
    status: string
    metrics: {
      label: string
      value: string
      improvement?: string
    }[]
    links: {
      live?: string
      github?: string
      demo?: string
    }
    testimonial?: {
      text: string
      author: string
      role: string
      company: string
    }
  }
  isOpen: boolean
  onClose: () => void
}

export function CaseStudyModal({ study, isOpen, onClose }: CaseStudyModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'results'>('overview')

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: Lightbulb },
    { id: 'technical', label: 'التفاصيل التقنية', icon: Code },
    { id: 'results', label: 'النتائج والتأثير', icon: BarChart3 }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <FocusTrap enabled={isOpen}>
        <div 
          className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="pr-12">
              <h2 id="modal-title" className="text-2xl font-bold mb-2">
                {study.title}
              </h2>
              <p className="text-blue-100 mb-4">
                {study.subtitle}
              </p>
              
              <div className="flex items-center gap-3">
                <Badge className="bg-white/20 text-white">
                  {study.status}
                </Badge>
                <Badge className="bg-white/20 text-white">
                  {study.category}
                </Badge>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  {study.duration}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-4">
              {study.links.live && (
                <a href={study.links.live} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="sm" className="gap-2">
                    <PlayCircle className="w-4 h-4" />
                    تجربة مباشرة
                  </Button>
                </a>
              )}
              {study.links.github && (
                <a href={study.links.github} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2 border-white/20 text-white hover:bg-white/10">
                    <Github className="w-4 h-4" />
                    الكود المصدري
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-medium transition-colors
                      ${activeTab === tab.id
                        ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    وصف المشروع
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {study.description}
                  </p>
                </div>

                {/* Challenge */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-500" />
                    التحدي
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {study.challenge}
                  </p>
                </div>

                {/* Solution */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-500" />
                    الحل المطبق
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {study.solution}
                  </p>
                </div>

                {/* Testimonial */}
                {study.testimonial && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-500" />
                      تجربة العميل
                    </h3>
                    <blockquote className="text-gray-700 dark:text-gray-300 italic mb-4 text-lg">
                      "{study.testimonial.text}"
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {study.testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {study.testimonial.author}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {study.testimonial.role} - {study.testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'technical' && (
              <div className="space-y-6">
                {/* Technologies */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-500" />
                    التقنيات المستخدمة
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {study.technologies.map((tech, index) => (
                      <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {tech}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">مدة التطوير</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{study.duration}</p>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">التصنيف</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{study.category}</p>
                  </div>
                </div>

                {/* Architecture or Technical Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    الهيكل التقني
                  </h3>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-600 dark:text-gray-300">
                      تم تطوير المشروع باستخدام architecture حديث يضمن الأداء العالي والقابلية للتوسع. 
                      تم استخدام best practices في التطوير مع التركيز على User Experience والأمان.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'results' && (
              <div className="space-y-6">
                {/* Metrics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-500" />
                    مقاييس الأداء
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {study.metrics.map((metric, index) => (
                      <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                          {metric.value}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {metric.label}
                        </div>
                        {metric.improvement && (
                          <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400">
                            <TrendingUp className="w-3 h-3" />
                            <span className="text-xs">{metric.improvement}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    النتائج المحققة
                  </h3>
                  <div className="space-y-3">
                    {study.results.map((result, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="w-6 h-6 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{result}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-300" />
                    التأثير الإجمالي
                  </h3>
                  <p className="text-blue-100 leading-relaxed">
                    {study.impact}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                آخر تحديث: {new Date().toLocaleDateString('ar')}
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={onClose}>
                  إغلاق
                </Button>
                {study.links.live && (
                  <a href={study.links.live} target="_blank" rel="noopener noreferrer">
                    <Button variant="gradient" className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      زيارة المشروع
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </FocusTrap>
    </div>
  )
}
