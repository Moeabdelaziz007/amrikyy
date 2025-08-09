'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { generateQuantumProfile, type QuantumProfile } from '@/lib/demo-data'
import { 
  User, 
  Atom, 
  Brain, 
  Zap, 
  Star,
  Download,
  Share2,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Target,
  Award,
  Eye,
  Copy,
  CheckCircle
} from 'lucide-react'

// Using QuantumProfile type from demo-data.ts

export function QuantumIdGenerator() {
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [profile, setProfile] = useState<QuantumProfile | null>(null)
  const [copied, setCopied] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: '',
    primarySkill: '',
    experienceLevel: 0,
    personalityTrait: 'innovative',
    idType: 'professional'
  })

  const idTypes = [
    { id: 'professional', label: 'Professional', icon: '💼', color: 'bg-blue-600' },
    { id: 'creative', label: 'Creative', icon: '🎨', color: 'bg-purple-600' },
    { id: 'tech', label: 'Tech', icon: '⚡', color: 'bg-green-600' },
    { id: 'gaming', label: 'Gaming', icon: '🎮', color: 'bg-red-600' }
  ]

  const personalityTraits = [
    'innovative', 'analytical', 'creative', 'leadership', 'collaborative', 'detail-oriented'
  ]

  const generateQuantumId = async () => {
    setIsGenerating(true)
    
    try {
      // Simulate AI processing with quantum-inspired calculations
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Generate quantum profile using client-side function
      const newProfile = generateQuantumProfile(formData)
      setProfile(newProfile)
      
    } catch (error) {
      console.error('Error generating quantum ID:', error)
      // Still generate a profile even on error for demo purposes
      const fallbackProfile = generateQuantumProfile(formData)
      setProfile(fallbackProfile)
    } finally {
      setIsGenerating(false)
    }
  }

  // Helper functions moved to demo-data.ts

  const copyProfile = async () => {
    if (!profile) return
    
    const profileText = `🆔 Quantum Digital Identity
━━━━━━━━━━━━━━━━━━━━━
👤 ${profile.fullName}
🎯 ${profile.primarySkill}
📊 Experience: ${profile.experienceLevel} years
🧠 AI Personality: ${profile.aiPersonality}%
⚡ Skill Proficiency: ${profile.skillProficiency}%
🚀 Future Potential: ${profile.futurePotential}%
🎯 Career Match: ${profile.careerMatch}%
━━━━━━━━━━━━━━━━━━━━━
🔮 Quantum Analysis:
${profile.quantumAnalysis}
━━━━━━━━━━━━━━━━━━━━━
🔐 Digital Signature: ${profile.digitalSignature}
📅 Generated: ${new Date(profile.timestamp).toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━
Powered by Amrikyy AI Quantum Engine`

    try {
      await navigator.clipboard.writeText(profileText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const resetGenerator = () => {
    setStep(1)
    setProfile(null)
    setFormData({
      fullName: '',
      primarySkill: '',
      experienceLevel: 0,
      personalityTrait: 'innovative',
      idType: 'professional'
    })
  }

  if (profile) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Atom className="w-8 h-8 text-cyan-400 animate-spin" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Quantum Digital Identity Generated
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Your unique quantum-powered digital identity profile
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-cyan-500/20 p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{profile.fullName}</h2>
                  <p className="text-cyan-400">{profile.primarySkill}</p>
                  <Badge className={`mt-2 ${idTypes.find(t => t.id === profile.idType)?.color} text-white`}>
                    {idTypes.find(t => t.id === profile.idType)?.icon} {idTypes.find(t => t.id === profile.idType)?.label}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Quantum ID</div>
                  <div className="text-lg font-mono text-cyan-400">{profile.id}</div>
                </div>
              </div>

              {/* Quantum Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-gray-300">AI Personality</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">{profile.aiPersonality}%</div>
                  <div className="text-xs text-gray-400">Neural Analysis</div>
                </div>

                <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-gray-300">Skill Proficiency</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">{profile.skillProficiency}%</div>
                  <div className="text-xs text-gray-400">Quantum Assessed</div>
                </div>

                <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-gray-300">Future Potential</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">{profile.futurePotential}%</div>
                  <div className="text-xs text-gray-400">AI Predicted</div>
                </div>

                <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-orange-400" />
                    <span className="text-sm text-gray-300">Career Match</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-400">{profile.careerMatch}%</div>
                  <div className="text-xs text-gray-400">Perfect Alignment</div>
                </div>
              </div>

              {/* Quantum Analysis */}
              <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                  <Atom className="w-5 h-5" />
                  Quantum AI Analysis
                </h3>
                <p className="text-gray-300 leading-relaxed">{profile.quantumAnalysis}</p>
              </div>

              {/* Recommendations */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI Recommendations
                </h3>
                <ul className="space-y-2">
                  {profile.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <Award className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Digital Signature */}
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-cyan-500/20 p-6">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Digital Signature
              </h3>
              <div className="font-mono text-sm text-gray-300 bg-gray-800/50 rounded p-3 mb-4">
                {profile.digitalSignature}
              </div>
              <div className="text-xs text-gray-400">
                Generated: {new Date(profile.timestamp).toLocaleString()}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-cyan-500/20 p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={copyProfile}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Profile
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline" 
                  className="w-full border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Digital ID
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-purple-500/20 text-purple-400 hover:bg-purple-500/10"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share ID
                </Button>

                <Button
                  onClick={resetGenerator}
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate New ID
                </Button>
              </div>
            </div>

            {/* Quantum Score */}
            <div className="bg-gradient-to-br from-cyan-900/30 to-purple-900/30 rounded-2xl border border-cyan-500/20 p-6">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quantum Score
              </h3>
              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {profile.quantumScore}
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  Quantum Coherence Level
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Atom className="w-8 h-8 text-cyan-400 animate-spin" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Quantum Digital AI ID Generator
          </h1>
        </div>
        <p className="text-gray-300 text-lg">
          Revolutionary quantum-powered digital identity creation with AI analysis
        </p>
      </div>

      {/* Generation Form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-cyan-500/20 p-8">
          {/* ID Type Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-6 h-6 text-cyan-400" />
              Select ID Type
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {idTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFormData({...formData, idType: type.id})}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.idType === type.id
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="text-sm text-white font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                👤 Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🎯 Primary Skill
              </label>
              <input
                type="text"
                value={formData.primarySkill}
                onChange={(e) => setFormData({...formData, primarySkill: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                placeholder="e.g., AI Engineering, Web Development"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                💼 Experience Level ({formData.experienceLevel} years)
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={formData.experienceLevel}
                onChange={(e) => setFormData({...formData, experienceLevel: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0 years</span>
                <span>10+ years</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🌟 Personality Trait
              </label>
              <select
                value={formData.personalityTrait}
                onChange={(e) => setFormData({...formData, personalityTrait: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
              >
                {personalityTraits.map(trait => (
                  <option key={trait} value={trait}>
                    {trait.charAt(0).toUpperCase() + trait.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-8">
            <Button
              onClick={generateQuantumId}
              disabled={!formData.fullName || !formData.primarySkill || isGenerating}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-semibold text-lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Generating Quantum Digital ID...
                </>
              ) : (
                <>
                  <Atom className="w-5 h-5 mr-2" />
                  Generate Quantum Digital ID
                </>
              )}
            </Button>
          </div>

          {/* Loading Animation */}
          {isGenerating && (
            <div className="mt-8 space-y-4">
              <div className="text-center text-cyan-400">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Atom className="w-6 h-6 animate-spin" />
                  <span>Quantum processing in progress...</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'AI Personality Score', icon: Brain },
                  { label: 'Skill Proficiency', icon: Star },
                  { label: 'Future Potential', icon: TrendingUp },
                  { label: 'Career Match', icon: Target }
                ].map((item, index) => (
                  <div key={index} className="bg-gray-800/30 rounded-lg p-4 border border-gray-600/20">
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs text-gray-400">{item.label}</span>
                    </div>
                    <div className="text-lg font-bold text-cyan-400 animate-pulse">
                      Analyzing...
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
