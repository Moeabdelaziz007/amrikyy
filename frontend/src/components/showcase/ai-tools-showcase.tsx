'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Atom, 
  BarChart3, 
  Share2, 
  Sparkles,
  Brain,
  Zap,
  Users,
  Eye,
  TrendingUp,
  Star,
  PlayCircle,
  ExternalLink,
  Code,
  Database,
  Cpu,
  Globe
} from 'lucide-react'

interface Tool {
  id: string
  title: string
  description: string
  icon: any
  color: string
  gradient: string
  href: string
  status: 'live' | 'demo' | 'coming-soon'
  features: string[]
  techStack: string[]
  demo?: {
    type: 'interactive' | 'video' | 'image'
    url?: string
    placeholder?: string
  }
}

export function AiToolsShowcase() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)

  const tools: Tool[] = [
    {
      id: 'linkedin-generator',
      title: 'LinkedIn Viral Post Generator',
      description: 'AI-powered tool that generates viral LinkedIn posts based on trending news and topics. Uses RAG architecture and advanced LLM prompting.',
      icon: Share2,
      color: 'text-blue-400',
      gradient: 'from-blue-600 to-purple-600',
      href: '/linkedin-generator',
      status: 'live',
      features: [
        'Real-time news fetching via APIs',
        'Multiple tone options (Inspirational, Technical, Storytelling)',
        'AI-optimized prompts for maximum engagement',
        'Copy to clipboard functionality',
        'Hashtag generation'
      ],
      techStack: ['Next.js', 'OpenAI API', 'GNews API', 'TailwindCSS'],
      demo: {
        type: 'interactive',
        placeholder: 'Try the live demo by entering a trending keyword like "AI" or "Blockchain"'
      }
    },
    {
      id: 'quantum-id',
      title: 'Quantum Digital ID Generator',
      description: 'Revolutionary quantum-inspired identity generator with AI personality analysis. Creates unique digital signatures with quantum metrics.',
      icon: Atom,
      color: 'text-cyan-400',
      gradient: 'from-cyan-600 to-purple-600',
      href: '/quantum-id-generator',
      status: 'live',
      features: [
        'Quantum-inspired personality analysis',
        'AI-powered recommendations',
        'Digital signature generation',
        'Multiple ID types (Professional, Creative, Tech, Gaming)',
        'Downloadable digital identity cards'
      ],
      techStack: ['React', 'TypeScript', 'Quantum Algorithms', 'AI Analytics'],
      demo: {
        type: 'interactive',
        placeholder: 'Generate your quantum digital identity in real-time'
      }
    },
    {
      id: 'analytics-dashboard',
      title: 'Smart Analytics Dashboard',
      description: 'Real-time analytics dashboard with AI insights, system monitoring, and quantum-powered data visualization.',
      icon: BarChart3,
      color: 'text-green-400',
      gradient: 'from-green-600 to-blue-600',
      href: '/analytics-dashboard',
      status: 'live',
      features: [
        'Real-time data streaming',
        'AI performance metrics',
        'System health monitoring',
        'Live activity feeds',
        'Quantum analytics tools'
      ],
      techStack: ['Next.js', 'Real-time APIs', 'Data Visualization', 'WebSockets'],
      demo: {
        type: 'interactive',
        placeholder: 'View live system metrics and AI performance data'
      }
    },
    {
      id: 'social-ai',
      title: 'Social Media AI Optimizer',
      description: 'Comprehensive social media content optimization using advanced AI algorithms and trend analysis.',
      icon: Users,
      color: 'text-purple-400',
      gradient: 'from-purple-600 to-pink-600',
      href: '#',
      status: 'coming-soon',
      features: [
        'Multi-platform content optimization',
        'Trend prediction algorithms',
        'Engagement rate prediction',
        'Optimal posting time analysis',
        'Competitor analysis'
      ],
      techStack: ['Python', 'Machine Learning', 'Social APIs', 'Data Analytics'],
      demo: {
        type: 'image',
        placeholder: 'Coming soon - Advanced social media AI optimization'
      }
    }
  ]

  const statusColors = {
    live: 'bg-green-600 text-white',
    demo: 'bg-blue-600 text-white',
    'coming-soon': 'bg-orange-600 text-white'
  }

  const statusLabels = {
    live: 'Live & Interactive',
    demo: 'Demo Available',
    'coming-soon': 'Coming Soon'
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Brain className="w-10 h-10 text-blue-400 animate-pulse" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            AI Tools Showcase
          </h1>
        </div>
        <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
          Interactive AI-powered tools with real functionality. Each tool demonstrates advanced AI capabilities, 
          modern UI/UX design, and production-ready architecture.
        </p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <Badge className="bg-green-600 text-white px-4 py-2">
            <Zap className="w-4 h-4 mr-2" />
            3 Live Tools
          </Badge>
          <Badge className="bg-blue-600 text-white px-4 py-2">
            <Code className="w-4 h-4 mr-2" />
            Production Ready
          </Badge>
          <Badge className="bg-purple-600 text-white px-4 py-2">
            <Database className="w-4 h-4 mr-2" />
            Real APIs
          </Badge>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className={`bg-gray-900/50 backdrop-blur-lg rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
              selectedTool === tool.id ? 'border-cyan-500/50 ring-2 ring-cyan-500/20' : 'border-gray-700/50 hover:border-gray-600/50'
            }`}
          >
            {/* Tool Header */}
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center`}>
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{tool.title}</h3>
                    <Badge className={statusColors[tool.status]}>
                      {statusLabels[tool.status]}
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {selectedTool === tool.id ? 'Hide' : 'Details'}
                </Button>
              </div>
              <p className="text-gray-300 leading-relaxed">{tool.description}</p>
            </div>

            {/* Tool Content */}
            <div className="p-6">
              {/* Features */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Key Features
                </h4>
                <ul className="space-y-2">
                  {tool.features.slice(0, selectedTool === tool.id ? tool.features.length : 3).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                  {!selectedTool && tool.features.length > 3 && (
                    <li className="text-gray-500 italic">
                      +{tool.features.length - 3} more features...
                    </li>
                  )}
                </ul>
              </div>

              {/* Tech Stack - Show when expanded */}
              {selectedTool === tool.id && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-blue-400" />
                    Technology Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tool.techStack.map((tech, index) => (
                      <Badge key={index} variant="outline" className="border-blue-500/20 text-blue-400">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Demo Section */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-green-400" />
                  Try It Now
                </h4>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <p className="text-gray-300 text-sm mb-3">{tool.demo?.placeholder}</p>
                  {tool.status === 'live' ? (
                    <Link href={tool.href}>
                      <Button className={`w-full bg-gradient-to-r ${tool.gradient} hover:opacity-90 text-white`}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Live Tool
                      </Button>
                    </Link>
                  ) : tool.status === 'demo' ? (
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      View Demo
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-gray-600 text-gray-300"
                      disabled
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Coming Soon
                    </Button>
                  )}
                </div>
              </div>

              {/* Performance Metrics - Show when expanded */}
              {selectedTool === tool.id && tool.status === 'live' && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-400">99.9%</div>
                    <div className="text-xs text-gray-400">Uptime</div>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-400">&lt;1.5s</div>
                    <div className="text-xs text-gray-400">Response</div>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-purple-400">95%+</div>
                    <div className="text-xs text-gray-400">Accuracy</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-500/20">
        <h2 className="text-3xl font-bold text-white mb-4">
          Experience the Future of AI Tools
        </h2>
        <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
          Each tool demonstrates production-ready AI capabilities with real APIs, 
          modern architecture, and intuitive user experiences.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/linkedin-generator">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              Start with LinkedIn Generator
            </Button>
          </Link>
          <Link href="/quantum-id-generator">
            <Button variant="outline" className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10">
              <Atom className="w-4 h-4 mr-2" />
              Try Quantum ID Generator
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
