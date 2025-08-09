// Demo data generators for GitHub Pages deployment
// Since GitHub Pages doesn't support API routes, we generate data client-side

export interface NewsArticle {
  title: string
  description: string
  url: string
  publishedAt: string
  source: {
    name: string
  }
  urlToImage?: string
  content?: string
}

export interface GeneratedPost {
  content: string
  hashtags: string[]
  tone: string
  metrics?: {
    estimatedReach?: number
    engagementRate?: string
    viralPotential?: number
  }
}

export interface QuantumProfile {
  id: string
  fullName: string
  primarySkill: string
  experienceLevel: number
  personalityTrait: string
  idType: string
  quantumScore: number
  aiPersonality: number
  skillProficiency: number
  futurePotential: number
  careerMatch: number
  quantumAnalysis: string
  recommendations: string[]
  digitalSignature: string
  timestamp: string
  quantumHash?: string
}

// News data generator
export function generateMockNews(query: string, count: number = 5): NewsArticle[] {
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
      url: `https://example-news.com/${query.toLowerCase().replace(/\s+/g, '-')}-article-${index + 1}`,
      publishedAt: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
      source: { name: randomSource },
      urlToImage: `https://images.unsplash.com/800x600/?${query}&sig=${index}`,
      content: `Full article content about ${query} developments...`
    }
  })
}

// LinkedIn post generator
export function generateLinkedInPost(keyword: string, tone: string, newsSummary: string): GeneratedPost {
  const hooks = {
    inspirational: `🚀 The ${keyword} revolution is transforming everything!`,
    technical: `⚡ Breaking: ${keyword} technology reaches new milestone`,
    storytelling: `💡 Here's what I discovered about ${keyword} that changed my perspective...`
  }

  const toneStyles = {
    inspirational: {
      emoji: '🌟',
      callToAction: `Ready to be part of the ${keyword} revolution? Share your thoughts below! 👇`,
      structure: 'motivational'
    },
    technical: {
      emoji: '🔬',
      callToAction: `What's your analysis of these ${keyword} developments? Let's discuss the implications! 💬`,
      structure: 'analytical'
    },
    storytelling: {
      emoji: '📖',
      callToAction: `What's your ${keyword} story? I'd love to hear your experiences! ✨`,
      structure: 'narrative'
    }
  }

  const style = toneStyles[tone as keyof typeof toneStyles] || toneStyles.inspirational
  const firstNews = newsSummary.split('\n\n')[0] || newsSummary.slice(0, 200)

  const content = `${hooks[tone as keyof typeof hooks]}

${firstNews}

${style.emoji} Key insights:
• This represents a major shift in how we approach ${keyword}
• Early adopters are already seeing significant advantages
• The implications extend far beyond what we initially expected

This isn't just another trend – it's a fundamental transformation that will reshape our industry.

${style.callToAction}`

  // Generate relevant hashtags based on keyword
  const baseHashtags = [keyword.toLowerCase().replace(/\s+/g, ''), 'innovation', 'technology', 'future']
  const additionalHashtags = {
    'ai': ['artificialintelligence', 'machinelearning', 'tech'],
    'blockchain': ['crypto', 'web3', 'fintech'],
    'startup': ['entrepreneur', 'business', 'growth'],
    'marketing': ['digitalmarketing', 'branding', 'strategy'],
    'tech': ['software', 'development', 'coding']
  }

  const keywordLower = keyword.toLowerCase()
  let hashtags = [...baseHashtags]
  
  Object.entries(additionalHashtags).forEach(([key, tags]) => {
    if (keywordLower.includes(key)) {
      hashtags = [...hashtags, ...tags.slice(0, 2)]
    }
  })

  // Add tone-specific hashtags
  if (tone === 'inspirational') hashtags.push('motivation', 'leadership')
  if (tone === 'technical') hashtags.push('analysis', 'research')
  if (tone === 'storytelling') hashtags.push('experience', 'insights')

  return {
    content,
    hashtags: hashtags.slice(0, 8), // Limit to 8 hashtags
    tone,
    metrics: {
      estimatedReach: Math.floor(Math.random() * 5000) + 2000,
      engagementRate: (Math.random() * 3 + 4).toFixed(1) + '%',
      viralPotential: Math.floor(Math.random() * 40) + 60
    }
  }
}

// Quantum ID generator
export function generateQuantumProfile(formData: {
  fullName: string
  primarySkill: string
  experienceLevel: number
  personalityTrait: string
  idType: string
}): QuantumProfile {
  const quantumScore = Math.floor(Math.random() * 40) + 60 // 60-100
  const aiPersonality = Math.floor(Math.random() * 30) + 70 // 70-100
  const skillProficiency = Math.min(95, formData.experienceLevel * 15 + Math.random() * 20)
  const futurePotential = Math.floor(Math.random() * 25) + 75 // 75-100
  const careerMatch = Math.floor(Math.random() * 20) + 80 // 80-100

  const analyses = {
    innovative: {
      main: `Your quantum field resonates with innovation frequencies at ${quantumScore}%. Neural pathway analysis reveals exceptional pattern recognition capabilities and forward-thinking quantum entanglement with emerging technologies.`,
      recommendations: [
        'Lead cutting-edge projects in quantum computing and AI',
        'Establish innovation labs for disruptive technology research',
        'Collaborate with R&D teams to drive technological breakthroughs',
        'Develop quantum-inspired solutions for complex problems'
      ]
    },
    analytical: {
      main: `Quantum coherence analysis shows ${aiPersonality}% logical processing power. Your analytical neural pathways exhibit superior data interpretation capabilities with quantum-level precision in complex problem solving.`,
      recommendations: [
        'Specialize in quantum data analytics and AI model optimization',
        'Lead complex algorithmic problem-solving initiatives',
        'Develop predictive models using quantum machine learning',
        'Create analytical frameworks for big data processing'
      ]
    },
    creative: {
      main: `Your creative quantum state operates at ${futurePotential}% potential. Artistic and innovative synapses show exceptional neural plasticity with quantum creativity resonance patterns.`,
      recommendations: [
        'Pursue interdisciplinary projects combining art and technology',
        'Lead quantum-inspired design thinking workshops',
        'Innovate at the intersection of creativity and AI',
        'Develop immersive experiences using quantum principles'
      ]
    },
    leadership: {
      main: `Leadership quantum entanglement analysis reveals ${careerMatch}% strategic alignment. Your neural networks show exceptional team synchronization and quantum decision-making capabilities.`,
      recommendations: [
        'Lead cross-functional teams in quantum technology projects',
        'Develop quantum leadership methodologies',
        'Mentor next-generation quantum computing professionals',
        'Create strategic roadmaps for quantum technology adoption'
      ]
    },
    collaborative: {
      main: `Quantum collaboration field strength measures ${quantumScore}% team resonance. Your neural pathways show optimal entanglement for distributed quantum computing and team-based innovation.`,
      recommendations: [
        'Facilitate quantum computing research collaborations',
        'Build interdisciplinary quantum research networks',
        'Develop collaborative frameworks for quantum projects',
        'Lead global quantum computing communities'
      ]
    },
    'detail-oriented': {
      main: `Quantum precision analysis indicates ${Math.floor(skillProficiency)}% accuracy resonance. Your neural pathways demonstrate exceptional quantum state measurement and error correction capabilities.`,
      recommendations: [
        'Specialize in quantum error correction and fault tolerance',
        'Lead precision engineering projects in quantum hardware',
        'Develop quality assurance frameworks for quantum systems',
        'Create detailed documentation for quantum algorithms'
      ]
    }
  }

  const analysis = analyses[formData.personalityTrait as keyof typeof analyses] || analyses.innovative

  // Generate digital signature
  const generateDigitalSignature = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result.match(/.{4}/g)?.join('-') || result
  }

  // Generate quantum hash
  const generateQuantumHash = (name: string, skill: string, timestamp: number): string => {
    const combined = `${name}${skill}${timestamp}`
    let hash = 0
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')
  }

  return {
    id: `QID-${Date.now().toString(36).toUpperCase()}`,
    fullName: formData.fullName,
    primarySkill: formData.primarySkill,
    experienceLevel: formData.experienceLevel,
    personalityTrait: formData.personalityTrait,
    idType: formData.idType,
    quantumScore,
    aiPersonality,
    skillProficiency: Math.floor(skillProficiency),
    futurePotential,
    careerMatch,
    quantumAnalysis: analysis.main,
    recommendations: analysis.recommendations,
    digitalSignature: generateDigitalSignature(),
    timestamp: new Date().toISOString(),
    quantumHash: generateQuantumHash(formData.fullName, formData.primarySkill, Date.now())
  }
}

// Analytics data generator
export function generateAnalyticsData() {
  return {
    totalQueries: Math.floor(Math.random() * 5000) + 10000,
    successRate: Math.random() * 5 + 95, // 95-100%
    responseTime: Math.random() * 1 + 0.8, // 0.8-1.8s
    activeUsers: Math.floor(Math.random() * 300) + 200,
    aiAccuracy: Math.random() * 8 + 90, // 90-98%
    vectorDbSize: `${(Math.random() * 20 + 20).toFixed(1)}K`,
    systemHealth: Math.random() * 5 + 95, // 95-100%
    aiUsage: Math.random() * 20 + 60, // 60-80%
    trends: {
      queries: Math.random() * 20 - 5, // -5 to +15%
      successRate: Math.random() * 5, // 0-5%
      responseTime: Math.random() * 20 - 10, // -10 to +10%
      users: Math.random() * 15 // 0-15%
    },
    lastUpdate: new Date().toISOString()
  }
}

export function generateLiveActivity() {
  const activities = [
    { type: 'query' as const, message: 'New LinkedIn post generated', accuracy: Math.floor(Math.random() * 10) + 90 },
    { type: 'query' as const, message: 'Quantum ID created successfully', accuracy: Math.floor(Math.random() * 8) + 92 },
    { type: 'success' as const, message: 'Analytics query processed', responseTime: Math.random() * 0.5 + 0.8 },
    { type: 'query' as const, message: 'News data fetched and analyzed', accuracy: Math.floor(Math.random() * 5) + 95 },
    { type: 'success' as const, message: 'Vector database updated', responseTime: Math.random() * 0.3 + 1.0 },
    { type: 'query' as const, message: 'User authentication completed', accuracy: 99 },
    { type: 'success' as const, message: 'RAG pipeline optimized', responseTime: Math.random() * 0.2 + 0.9 },
    { type: 'query' as const, message: 'Social media content analyzed', accuracy: Math.floor(Math.random() * 7) + 93 }
  ]

  const randomActivity = activities[Math.floor(Math.random() * activities.length)]
  return {
    id: Date.now().toString(),
    ...randomActivity,
    timestamp: new Date().toISOString()
  }
}
