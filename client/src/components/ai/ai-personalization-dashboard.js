"use strict";
// AI Personalization Dashboard
// Comprehensive dashboard for AI-powered personalization features
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIPersonalizationDashboard = AIPersonalizationDashboard;
const react_1 = require("react");
const card_1 = require("../ui/card");
const tabs_1 = require("../ui/tabs");
const button_1 = require("../ui/button");
const badge_1 = require("../ui/badge");
const progress_1 = require("../ui/progress");
const lucide_react_1 = require("lucide-react");
const use_ai_personalization_1 = require("../../hooks/use-ai-personalization");
function AIPersonalizationDashboard({ userId }) {
    const [activeTab, setActiveTab] = (0, react_1.useState)('overview');
    const [selectedRecommendationType, setSelectedRecommendationType] = (0, react_1.useState)('content');
    const { profile, loading: profileLoading, analyzeBehavior } = (0, use_ai_personalization_1.useAIPersonalization)();
    const { recommendations, loading: recLoading, loadRecommendations } = (0, use_ai_personalization_1.usePersonalizedRecommendations)(selectedRecommendationType);
    const { insights, loading: insightsLoading } = (0, use_ai_personalization_1.usePersonalizationInsights)();
    const { uiPreferences, getLayoutConfig, isAdaptive } = (0, use_ai_personalization_1.useAdaptiveUI)();
    const handleRecommendationFeedback = async (itemId, feedback) => {
        // This would integrate with the personalization engine
        console.log(`Feedback for ${itemId}: ${feedback}`);
    };
    if (profileLoading) {
        return (<div className="flex items-center justify-center p-8">
        <lucide_react_1.RefreshCw className="h-6 w-6 animate-spin"/>
        <span className="ml-2">Analyzing your behavior...</span>
      </div>);
    }
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <lucide_react_1.Brain className="h-6 w-6 text-purple-500"/>
            AI Personalization
          </h2>
          <p className="text-muted-foreground">Your personalized AI experience</p>
        </div>
        <div className="flex items-center gap-2">
          <button_1.Button onClick={analyzeBehavior} variant="outline" size="sm" disabled={profileLoading}>
            <lucide_react_1.RefreshCw className={`h-4 w-4 mr-2 ${profileLoading ? 'animate-spin' : ''}`}/>
            Refresh Analysis
          </button_1.Button>
          <button_1.Button variant="outline" size="sm">
            <lucide_react_1.Settings className="h-4 w-4 mr-2"/>
            Settings
          </button_1.Button>
        </div>
      </div>

      <tabs_1.Tabs value={activeTab} onValueChange={setActiveTab}>
        <tabs_1.TabsList className="grid w-full grid-cols-4">
          <tabs_1.TabsTrigger value="overview">Overview</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="recommendations">Recommendations</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="insights">Insights</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="preferences">Preferences</tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        <tabs_1.TabsContent value="overview" className="space-y-6">
          <OverviewTab profile={profile} insights={insights} isAdaptive={isAdaptive}/>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="recommendations" className="space-y-6">
          <RecommendationsTab recommendations={recommendations} loading={recLoading} selectedType={selectedRecommendationType} onTypeChange={setSelectedRecommendationType} onFeedback={handleRecommendationFeedback}/>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="insights" className="space-y-6">
          <InsightsTab insights={insights} loading={insightsLoading}/>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="preferences" className="space-y-6">
          <PreferencesTab profile={profile} uiPreferences={uiPreferences} layoutConfig={getLayoutConfig()}/>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>
    </div>);
}
function OverviewTab({ profile, insights, isAdaptive }) {
    const totalPreferences = profile?.preferences?.length || 0;
    const totalInsights = insights?.length || 0;
    const behaviorPatterns = profile?.behaviorPatterns?.length || 0;
    const interests = profile?.interests?.length || 0;
    return (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <card_1.Card>
        <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <card_1.CardTitle className="text-sm font-medium">AI Profile</card_1.CardTitle>
          <lucide_react_1.Brain className="h-4 w-4 text-purple-500"/>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="text-2xl font-bold">{isAdaptive ? 'Active' : 'Learning'}</div>
          <p className="text-xs text-muted-foreground">
            {totalPreferences} preferences learned
          </p>
        </card_1.CardContent>
      </card_1.Card>

      <card_1.Card>
        <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <card_1.CardTitle className="text-sm font-medium">Behavior Patterns</card_1.CardTitle>
          <lucide_react_1.TrendingUp className="h-4 w-4 text-blue-500"/>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="text-2xl font-bold">{behaviorPatterns}</div>
          <p className="text-xs text-muted-foreground">
            Patterns identified
          </p>
        </card_1.CardContent>
      </card_1.Card>

      <card_1.Card>
        <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <card_1.CardTitle className="text-sm font-medium">Interests</card_1.CardTitle>
          <lucide_react_1.Target className="h-4 w-4 text-green-500"/>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="text-2xl font-bold">{interests}</div>
          <p className="text-xs text-muted-foreground">
            Topics of interest
          </p>
        </card_1.CardContent>
      </card_1.Card>

      <card_1.Card>
        <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <card_1.CardTitle className="text-sm font-medium">AI Insights</card_1.CardTitle>
          <lucide_react_1.Lightbulb className="h-4 w-4 text-yellow-500"/>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="text-2xl font-bold">{totalInsights}</div>
          <p className="text-xs text-muted-foreground">
            Personalized insights
          </p>
        </card_1.CardContent>
      </card_1.Card>

      {/* Personality Traits */}
      <card_1.Card className="col-span-1 md:col-span-2">
        <card_1.CardHeader>
          <card_1.CardTitle>Personality Traits</card_1.CardTitle>
          <card_1.CardDescription>AI-detected personality characteristics</card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="space-y-4">
            {profile?.personalityTraits?.slice(0, 4).map((trait, index) => (<div key={trait.trait} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{trait.trait}</span>
                  <span className="text-sm text-muted-foreground">
                    {(trait.score * 100).toFixed(0)}%
                  </span>
                </div>
                <progress_1.Progress value={trait.score * 100} className="h-2"/>
              </div>))}
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Recent Insights */}
      <card_1.Card className="col-span-1 md:col-span-2">
        <card_1.CardHeader>
          <card_1.CardTitle>Recent Insights</card_1.CardTitle>
          <card_1.CardDescription>Latest AI-generated insights</card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="space-y-4">
            {insights?.slice(0, 3).map((insight, index) => (<div key={insight.type} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${insight.type === 'usage_pattern' ? 'bg-blue-500' :
                insight.type === 'new_interest' ? 'bg-green-500' :
                    insight.type === 'preference_change' ? 'bg-yellow-500' : 'bg-gray-500'}`}/>
                <div className="flex-1">
                  <div className="text-sm font-medium">{insight.title}</div>
                  <div className="text-xs text-muted-foreground">{insight.description}</div>
                  {insight.actionable && (<badge_1.Badge variant="outline" className="mt-1 text-xs">
                      Actionable
                    </badge_1.Badge>)}
                </div>
              </div>))}
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
function RecommendationsTab({ recommendations, loading, selectedType, onTypeChange, onFeedback }) {
    const types = [
        { id: 'content', name: 'Content', icon: '📄' },
        { id: 'feature', name: 'Features', icon: '⚡' },
        { id: 'workflow', name: 'Workflows', icon: '🔄' },
        { id: 'agent', name: 'AI Agents', icon: '🤖' }
    ];
    if (loading) {
        return (<div className="flex items-center justify-center p-8">
        <lucide_react_1.RefreshCw className="h-6 w-6 animate-spin"/>
        <span className="ml-2">Loading recommendations...</span>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Type Selector */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Recommendation Type:</span>
        {types.map(type => (<button_1.Button key={type.id} variant={selectedType === type.id ? "default" : "outline"} size="sm" onClick={() => onTypeChange(type.id)} className="flex items-center gap-2">
            <span>{type.icon}</span>
            {type.name}
          </button_1.Button>))}
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => (<card_1.Card key={rec.id} className="relative">
            <card_1.CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <card_1.CardTitle className="text-lg">{rec.title}</card_1.CardTitle>
                  <card_1.CardDescription>{rec.description}</card_1.CardDescription>
                </div>
                <badge_1.Badge variant="secondary">
                  {(rec.score * 100).toFixed(0)}% match
                </badge_1.Badge>
              </div>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <strong>Why recommended:</strong> {rec.reason}
                </div>
                
                <div className="flex items-center justify-between">
                  <badge_1.Badge variant="outline" className="text-xs">
                    {rec.category}
                  </badge_1.Badge>
                  <div className="flex items-center space-x-1">
                    <button_1.Button size="sm" variant="ghost" onClick={() => onFeedback(rec.itemId, 'positive')}>
                      <lucide_react_1.Heart className="h-4 w-4"/>
                    </button_1.Button>
                    <button_1.Button size="sm" variant="ghost" onClick={() => onFeedback(rec.itemId, 'negative')}>
                      <lucide_react_1.Eye className="h-4 w-4"/>
                    </button_1.Button>
                  </div>
                </div>

                <button_1.Button className="w-full" size="sm">
                  Explore {selectedType}
                </button_1.Button>
              </div>
            </card_1.CardContent>
          </card_1.Card>))}
      </div>

      {recommendations.length === 0 && (<div className="text-center py-8">
          <lucide_react_1.Target className="h-12 w-12 mx-auto text-muted-foreground mb-4"/>
          <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
          <p className="text-muted-foreground">
            Keep using the platform to get personalized recommendations
          </p>
        </div>)}
    </div>);
}
function InsightsTab({ insights, loading }) {
    if (loading) {
        return (<div className="flex items-center justify-center p-8">
        <lucide_react_1.RefreshCw className="h-6 w-6 animate-spin"/>
        <span className="ml-2">Analyzing insights...</span>
      </div>);
    }
    return (<div className="space-y-6">
      {insights.map((insight, index) => (<card_1.Card key={insight.type} className="relative">
          <card_1.CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${insight.type === 'usage_pattern' ? 'bg-blue-100 text-blue-600' :
                insight.type === 'new_interest' ? 'bg-green-100 text-green-600' :
                    insight.type === 'preference_change' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'}`}>
                  {insight.type === 'usage_pattern' ? <lucide_react_1.BarChart3 className="h-4 w-4"/> :
                insight.type === 'new_interest' ? <lucide_react_1.Target className="h-4 w-4"/> :
                    insight.type === 'preference_change' ? <lucide_react_1.TrendingUp className="h-4 w-4"/> : <lucide_react_1.AlertCircle className="h-4 w-4"/>}
                </div>
                <div>
                  <card_1.CardTitle className="text-lg">{insight.title}</card_1.CardTitle>
                  <card_1.CardDescription>{insight.description}</card_1.CardDescription>
                </div>
              </div>
              <badge_1.Badge variant={insight.actionable ? "default" : "secondary"}>
                {insight.actionable ? 'Actionable' : 'Informational'}
              </badge_1.Badge>
            </div>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Confidence:</span>
                <progress_1.Progress value={insight.confidence * 100} className="flex-1 h-2"/>
                <span className="text-sm text-muted-foreground">
                  {(insight.confidence * 100).toFixed(0)}%
                </span>
              </div>

              {insight.recommendations && insight.recommendations.length > 0 && (<div>
                  <span className="text-sm font-medium mb-2 block">Recommendations:</span>
                  <ul className="space-y-1">
                    {insight.recommendations.map((rec, recIndex) => (<li key={recIndex} className="text-sm text-muted-foreground flex items-center space-x-2">
                        <lucide_react_1.CheckCircle className="h-3 w-3 text-green-500"/>
                        <span>{rec}</span>
                      </li>))}
                  </ul>
                </div>)}

              {insight.actionable && (<button_1.Button size="sm" className="w-full">
                  Take Action
                </button_1.Button>)}
            </div>
          </card_1.CardContent>
        </card_1.Card>))}

      {insights.length === 0 && (<div className="text-center py-8">
          <lucide_react_1.Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4"/>
          <h3 className="text-lg font-medium mb-2">No insights yet</h3>
          <p className="text-muted-foreground">
            Continue using the platform to generate personalized insights
          </p>
        </div>)}
    </div>);
}
function PreferencesTab({ profile, uiPreferences, layoutConfig }) {
    return (<div className="space-y-6">
      {/* AI-Detected Preferences */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>AI-Detected Preferences</card_1.CardTitle>
          <card_1.CardDescription>Preferences learned from your behavior</card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="space-y-4">
            {profile?.preferences?.slice(0, 6).map((pref, index) => (<div key={pref.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${pref.source === 'behavioral' ? 'bg-blue-500' :
                pref.source === 'explicit' ? 'bg-green-500' : 'bg-yellow-500'}`}/>
                  <div>
                    <div className="text-sm font-medium">{pref.preference}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {pref.source} • {pref.category}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {(pref.confidence * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Confidence
                  </div>
                </div>
              </div>))}
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* UI Adaptations */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>UI Adaptations</card_1.CardTitle>
          <card_1.CardDescription>Interface customizations based on your behavior</card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Layout Preferences</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Advanced Features</span>
                  <badge_1.Badge variant={layoutConfig.sidebar.showAdvancedFeatures ? "default" : "secondary"}>
                    {layoutConfig.sidebar.showAdvancedFeatures ? 'Enabled' : 'Disabled'}
                  </badge_1.Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quick Actions</span>
                  <badge_1.Badge variant={layoutConfig.dashboard.showQuickActions ? "default" : "secondary"}>
                    {layoutConfig.dashboard.showQuickActions ? 'Enabled' : 'Disabled'}
                  </badge_1.Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Social Features</span>
                  <badge_1.Badge variant={layoutConfig.dashboard.showSocialFeatures ? "default" : "secondary"}>
                    {layoutConfig.dashboard.showSocialFeatures ? 'Enabled' : 'Disabled'}
                  </badge_1.Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Behavior Patterns</h4>
              <div className="space-y-2">
                {profile?.behaviorPatterns?.slice(0, 3).map((pattern, index) => (<div key={pattern.id} className="text-sm">
                    <div className="font-medium">{pattern.pattern}</div>
                    <div className="text-xs text-muted-foreground">
                      Frequency: {pattern.frequency} • Confidence: {(pattern.confidence * 100).toFixed(0)}%
                    </div>
                  </div>))}
              </div>
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Interests */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>Detected Interests</card_1.CardTitle>
          <card_1.CardDescription>Topics and categories you're interested in</card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="flex flex-wrap gap-2">
            {profile?.interests?.map((interest, index) => (<badge_1.Badge key={interest.id} variant="outline" className="flex items-center space-x-1">
                <span>{interest.topic}</span>
                <span className="text-xs text-muted-foreground">
                  ({(interest.score * 100).toFixed(0)}%)
                </span>
              </badge_1.Badge>))}
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
exports.default = AIPersonalizationDashboard;
