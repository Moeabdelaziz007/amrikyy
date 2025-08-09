import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Simulated analytics data store
let analyticsData = {
  totalQueries: 12847,
  successRate: 98.3,
  responseTime: 1.2,
  activeUsers: 342,
  aiAccuracy: 94.7,
  vectorDbSize: '25.6K',
  systemHealth: 99.1,
  aiUsage: 67.8,
  trends: {
    queries: 12.5,
    successRate: 2.1,
    responseTime: -8.3,
    users: 5.7
  },
  lastUpdate: new Date().toISOString()
}

let activityLog: Array<{
  id: string
  type: 'query' | 'success' | 'error'
  message: string
  timestamp: string
  responseTime?: number
  accuracy?: number
}> = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'

    // Simulate real-time data changes
    const now = new Date()
    const timeDiff = now.getTime() - new Date(analyticsData.lastUpdate).getTime()
    
    if (timeDiff > 5000) { // Update every 5 seconds
      // Update metrics with realistic variations
      analyticsData = {
        ...analyticsData,
        totalQueries: analyticsData.totalQueries + Math.floor(Math.random() * 5),
        successRate: Math.max(95, Math.min(100, analyticsData.successRate + (Math.random() - 0.5) * 0.5)),
        responseTime: Math.max(0.8, Math.min(2.0, analyticsData.responseTime + (Math.random() - 0.5) * 0.1)),
        activeUsers: Math.max(200, Math.min(500, analyticsData.activeUsers + Math.floor((Math.random() - 0.5) * 10))),
        aiAccuracy: Math.max(90, Math.min(98, analyticsData.aiAccuracy + (Math.random() - 0.5) * 0.3)),
        aiUsage: Math.max(60, Math.min(80, analyticsData.aiUsage + (Math.random() - 0.5) * 2)),
        lastUpdate: now.toISOString()
      }

      // Add new activity
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
      const newActivity = {
        id: Date.now().toString(),
        ...randomActivity,
        timestamp: now.toISOString()
      }

      activityLog = [newActivity, ...activityLog.slice(0, 19)] // Keep last 20 activities
    }

    if (type === 'activity') {
      return NextResponse.json({
        activities: activityLog.slice(0, 10),
        timestamp: analyticsData.lastUpdate
      })
    }

    if (type === 'metrics') {
      return NextResponse.json({
        metrics: analyticsData,
        timestamp: analyticsData.lastUpdate
      })
    }

    // Return all data
    return NextResponse.json({
      ...analyticsData,
      activities: activityLog.slice(0, 10)
    })

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case 'log_query':
        const queryActivity = {
          id: Date.now().toString(),
          type: 'query' as const,
          message: data.message || 'Query processed',
          timestamp: new Date().toISOString(),
          responseTime: data.responseTime,
          accuracy: data.accuracy
        }
        activityLog = [queryActivity, ...activityLog.slice(0, 19)]
        analyticsData.totalQueries += 1
        break

      case 'log_error':
        const errorActivity = {
          id: Date.now().toString(),
          type: 'error' as const,
          message: data.message || 'System error occurred',
          timestamp: new Date().toISOString()
        }
        activityLog = [errorActivity, ...activityLog.slice(0, 19)]
        break

      case 'update_metrics':
        analyticsData = {
          ...analyticsData,
          ...data,
          lastUpdate: new Date().toISOString()
        }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Analytics POST error:', error)
    return NextResponse.json(
      { error: 'Failed to update analytics' },
      { status: 500 }
    )
  }
}
