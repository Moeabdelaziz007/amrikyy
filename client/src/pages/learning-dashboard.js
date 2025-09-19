"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LearningDashboard;
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const tabs_1 = require("@/components/ui/tabs");
const badge_1 = require("@/components/ui/badge");
const progress_card_1 = require("@/components/learning/progress-card");
const leaderboard_1 = require("@/components/learning/leaderboard");
const challenges_1 = require("@/components/learning/challenges");
const recommendations_1 = require("@/components/learning/recommendations");
const lucide_react_1 = require("lucide-react");
function LearningDashboard() {
    const [activeTab, setActiveTab] = (0, react_1.useState)("overview");
    const [userProgress, setUserProgress] = (0, react_1.useState)(null);
    const [leaderboard, setLeaderboard] = (0, react_1.useState)([]);
    const [challenges, setChallenges] = (0, react_1.useState)([]);
    const [recommendations, setRecommendations] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        loadDashboardData();
    }, []);
    const loadDashboardData = async () => {
        try {
            setLoading(true);
            // Simulate API calls - in real app, these would be actual API endpoints
            const mockUserProgress = {
                userId: 'user-1',
                totalPoints: 2450,
                level: 8,
                experience: 1900,
                badges: ['first_ai_interaction', 'automation_master'],
                achievements: [
                    {
                        id: 'level_10',
                        name: 'Rising Star',
                        description: 'Reached level 8',
                        icon: '⭐',
                        category: 'progression',
                        points: 500,
                        rarity: 'rare',
                        unlockedAt: new Date(),
                        metadata: {}
                    }
                ],
                learningStreak: 12,
                lastActivityDate: new Date(),
                skillPoints: {
                    'ai_interaction': 450,
                    'automation_creation': 380,
                    'social_media': 280,
                    'workflow_design': 320
                },
                weeklyGoal: 500,
                monthlyGoal: 2000
            };
            const mockLeaderboard = [
                { userId: 'user-1', points: 2450, level: 8, badges: 2 },
                { userId: 'user-2', points: 3200, level: 10, badges: 4 },
                { userId: 'user-3', points: 1800, level: 6, badges: 1 },
                { userId: 'user-4', points: 5600, level: 15, badges: 8 },
                { userId: 'user-5', points: 1200, level: 4, badges: 1 }
            ];
            const mockChallenges = [
                {
                    id: 'weekly_automation',
                    title: 'Weekly Automation Challenge',
                    description: 'Create 3 new automations this week',
                    type: 'weekly',
                    category: 'automation',
                    requirements: [{ type: 'automation_created', threshold: 3, timeframe: '7_days' }],
                    rewards: { points: 500, badges: [], achievements: [] },
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    participants: ['user-1', 'user-2', 'user-3'],
                    isActive: true
                },
                {
                    id: 'ai_explorer',
                    title: 'AI Explorer Quest',
                    description: 'Use 5 different AI features',
                    type: 'daily',
                    category: 'ai',
                    requirements: [{ type: 'ai_interaction', threshold: 5, timeframe: '1_day' }],
                    rewards: { points: 200, badges: ['ai_explorer'], achievements: [] },
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    participants: ['user-1', 'user-4'],
                    isActive: true
                }
            ];
            const mockRecommendations = [
                {
                    id: 'rec-1',
                    userId: 'user-1',
                    type: 'feature_tutorial',
                    title: 'Advanced AI Prompting',
                    description: 'Learn to create more sophisticated AI prompts',
                    difficulty: 'intermediate',
                    estimatedTime: 25,
                    points: 150,
                    prerequisites: [],
                    category: 'ai_interaction',
                    priority: 8,
                    createdAt: new Date()
                },
                {
                    id: 'rec-2',
                    userId: 'user-1',
                    type: 'automation_template',
                    title: 'Social Media Automation',
                    description: 'Build an automation for social media posting',
                    difficulty: 'beginner',
                    estimatedTime: 30,
                    points: 200,
                    prerequisites: ['basic_automation'],
                    category: 'automation_creation',
                    priority: 7,
                    createdAt: new Date()
                }
            ];
            setUserProgress(mockUserProgress);
            setLeaderboard(mockLeaderboard);
            setChallenges(mockChallenges);
            setRecommendations(mockRecommendations);
        }
        catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleJoinChallenge = (challengeId) => {
        console.log('Joining challenge:', challengeId);
        // Implement challenge joining logic
    };
    const handleStartRecommendation = (recommendation) => {
        console.log('Starting recommendation:', recommendation);
        // Implement recommendation starting logic
    };
    const handleDismissRecommendation = (recommendationId) => {
        setRecommendations(prev => prev.filter(r => r.id !== recommendationId));
    };
    if (loading) {
        return (<div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <lucide_react_1.Brain className="h-12 w-12 text-primary animate-pulse mx-auto mb-4"/>
            <p className="text-muted-foreground">Loading learning dashboard...</p>
          </div>
        </div>
      </div>);
    }
    return (<div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold cyber-text">Learning Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your progress, earn rewards, and discover new learning opportunities
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <badge_1.Badge variant="secondary" className="neon-glow-sm">
            <lucide_react_1.Zap className="h-3 w-3 mr-1"/>
            {userProgress?.totalPoints || 0} Points
          </badge_1.Badge>
          <badge_1.Badge variant="outline" className="neon-glow-sm">
            <lucide_react_1.Users className="h-3 w-3 mr-1"/>
            #{leaderboard.findIndex(entry => entry.userId === 'user-1') + 1} Rank
          </badge_1.Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <card_1.Card className="glass-card neon-glow-sm">
          <card_1.CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <lucide_react_1.Trophy className="h-5 w-5 text-yellow-500"/>
              <div>
                <div className="text-2xl font-bold">{userProgress?.level || 1}</div>
                <div className="text-xs text-muted-foreground">Level</div>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card className="glass-card neon-glow-sm">
          <card_1.CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <lucide_react_1.Zap className="h-5 w-5 text-primary"/>
              <div>
                <div className="text-2xl font-bold">{userProgress?.totalPoints || 0}</div>
                <div className="text-xs text-muted-foreground">Points</div>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card className="glass-card neon-glow-sm">
          <card_1.CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <lucide_react_1.Award className="h-5 w-5 text-purple-500"/>
              <div>
                <div className="text-2xl font-bold">{userProgress?.badges.length || 0}</div>
                <div className="text-xs text-muted-foreground">Badges</div>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card className="glass-card neon-glow-sm">
          <card_1.CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <lucide_react_1.TrendingUp className="h-5 w-5 text-green-500"/>
              <div>
                <div className="text-2xl font-bold">{userProgress?.learningStreak || 0}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* Main Content Tabs */}
      <tabs_1.Tabs value={activeTab} onValueChange={setActiveTab}>
        <tabs_1.TabsList className="grid w-full grid-cols-4">
          <tabs_1.TabsTrigger value="overview" className="flex items-center space-x-2">
            <lucide_react_1.Brain className="h-4 w-4"/>
            <span>Overview</span>
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="challenges" className="flex items-center space-x-2">
            <lucide_react_1.Target className="h-4 w-4"/>
            <span>Challenges</span>
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="leaderboard" className="flex items-center space-x-2">
            <lucide_react_1.Trophy className="h-4 w-4"/>
            <span>Leaderboard</span>
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="recommendations" className="flex items-center space-x-2">
            <lucide_react_1.Lightbulb className="h-4 w-4"/>
            <span>Learn</span>
          </tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        <tabs_1.TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userProgress && (<progress_card_1.ProgressCard progress={userProgress}/>)}
            
            <leaderboard_1.Leaderboard entries={leaderboard} currentUserId="user-1"/>
          </div>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="challenges" className="space-y-6">
          <challenges_1.Challenges challenges={challenges} onJoinChallenge={handleJoinChallenge}/>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="leaderboard" className="space-y-6">
          <leaderboard_1.Leaderboard entries={leaderboard} currentUserId="user-1"/>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="recommendations" className="space-y-6">
          <recommendations_1.Recommendations recommendations={recommendations} onStartRecommendation={handleStartRecommendation} onDismissRecommendation={handleDismissRecommendation}/>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>
    </div>);
}
