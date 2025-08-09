'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/enhanced-button'
import { Badge } from '@/components/ui/badge'
import { ProgressRing } from '@/components/ui/loading-spinner'
import { 
  PlayCircle,
  Github,
  ExternalLink,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Code,
  ChevronRight,
  Star,
  Heart,
  Share2
} from 'lucide-react'

interface CaseStudyCardProps {
  id: string
  title: string
  subtitle: string
  description: string
  technologies: string[]
  status: 'Completed' | 'In Progress' | 'Live'
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
  duration: string
  category: string
  featured?: boolean
  popularity: number
  onViewDetails: () => void
}

export function CaseStudyCard({ 
  id, 
  title, 
  subtitle, 
  description, 
  technologies, 
  status, 
  metrics, 
  links, 
  duration, 
  category,
  featured = false,
  popularity = 85,
  onViewDetails 
}: CaseStudyCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 20)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: window.location.href + '#' + id
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href + '#' + id)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live': return 'bg-green-600 text-white'
      case 'In Progress': return 'bg-blue-600 text-white'
      case 'Completed': return 'bg-purple-600 text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  return (
    <div className={`
      group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 
      overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
      ${featured ? 'ring-2 ring-yellow-500 ring-opacity-50' : ''}
    `}>
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-yellow-500 text-white px-3 py-1 flex items-center gap-2">
            <Star className="w-3 h-3" />
            مُختار
          </Badge>
        </div>
      )}

      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {title}
              </h3>
              <Badge className={getStatusColor(status)}>
                {status}
              </Badge>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
              {subtitle}
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>
        </div>

        {/* Popularity Indicator */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <ProgressRing progress={popularity} size={32} strokeWidth={2} />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              شعبية {popularity}%
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            {duration}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Code className="w-4 h-4" />
            {category}
          </div>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.slice(0, 3).map((tech, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {technologies.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{technologies.length - 3} more
            </Badge>
          )}
        </div>

        {/* Metrics Preview */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {metrics.slice(0, 3).map((metric, index) => (
            <div key={index} className="text-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {metric.value}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {metric.label}
              </div>
              {metric.improvement && (
                <div className="text-xs text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {metric.improvement}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {links.live && (
              <Link href={links.live}>
                <Button size="sm" variant="gradient" className="gap-2 shadow-lg">
                  <PlayCircle className="w-4 h-4" />
                  تجربة
                </Button>
              </Link>
            )}
            {links.github && (
              <a href={links.github} target="_blank" rel="noopener noreferrer">
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
            onClick={onViewDetails}
            className="gap-2 group/btn"
          >
            التفاصيل
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`
                flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-all duration-300
                ${isLiked 
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-red-100 hover:text-red-600'
                }
              `}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              {likes}
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300"
            >
              <Share2 className="w-4 h-4" />
              مشاركة
            </button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            {Math.floor(Math.random() * 500) + 100} مشاهدة
          </div>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  )
}
