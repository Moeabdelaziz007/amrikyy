'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Challenges = Challenges;
const card_1 = require('@/components/ui/card');
const button_1 = require('@/components/ui/button');
const badge_1 = require('@/components/ui/badge');
const progress_1 = require('@/components/ui/progress');
const lucide_react_1 = require('lucide-react');
function Challenges({
  challenges,
  userProgress = [],
  onJoinChallenge,
  onViewDetails,
}) {
  const getChallengeTypeIcon = type => {
    switch (type) {
      case 'daily':
        return <lucide_react_1.Calendar className="h-4 w-4 text-blue-500" />;
      case 'weekly':
        return <lucide_react_1.Target className="h-4 w-4 text-green-500" />;
      case 'monthly':
        return <lucide_react_1.Trophy className="h-4 w-4 text-purple-500" />;
      case 'special':
        return <lucide_react_1.Star className="h-4 w-4 text-yellow-500" />;
      default:
        return (
          <lucide_react_1.Circle className="h-4 w-4 text-muted-foreground" />
        );
    }
  };
  const getChallengeTypeColor = type => {
    switch (type) {
      case 'daily':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'weekly':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'monthly':
        return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      case 'special':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };
  const getTimeRemaining = endDate => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    if (diff <= 0) return 'Expired';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${minutes}m`;
  };
  const getProgressForChallenge = challengeId => {
    return userProgress.find(p => p.challengeId === challengeId);
  };
  const getProgressPercentage = (challenge, progress) => {
    if (!progress) return 0;
    const requirement = challenge.requirements[0]; // Use first requirement for simplicity
    return Math.min(100, (progress.progress / requirement.threshold) * 100);
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold cyber-text">
          Learning Challenges
        </h3>
        <badge_1.Badge variant="secondary" className="neon-glow-sm">
          <lucide_react_1.Users className="h-3 w-3 mr-1" />
          {challenges.filter(c => c.isActive).length} Active
        </badge_1.Badge>
      </div>

      <div className="grid gap-4">
        {challenges.map(challenge => {
          const progress = getProgressForChallenge(challenge.id);
          const isCompleted = progress?.completed || false;
          const progressPercentage = getProgressPercentage(challenge, progress);
          return (
            <card_1.Card
              key={challenge.id}
              className={`glass-card transition-all duration-200 ${
                isCompleted
                  ? 'neon-glow-md border-green-500/30'
                  : 'neon-glow-sm hover:neon-glow-md'
              }`}
            >
              <card_1.CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getChallengeTypeIcon(challenge.type)}
                    <div className="flex-1">
                      <card_1.CardTitle className="text-base flex items-center space-x-2">
                        <span>{challenge.title}</span>
                        {isCompleted && (
                          <lucide_react_1.CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </card_1.CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {challenge.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <badge_1.Badge
                      className={getChallengeTypeColor(challenge.type)}
                    >
                      {challenge.type}
                    </badge_1.Badge>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <lucide_react_1.Clock className="h-3 w-3" />
                      <span>{getTimeRemaining(challenge.endDate)}</span>
                    </div>
                  </div>
                </div>
              </card_1.CardHeader>

              <card_1.CardContent className="space-y-4">
                {/* Requirements */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Requirements:</div>
                  <div className="space-y-1">
                    {challenge.requirements.map((req, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {req.type
                            .replace('_', ' ')
                            .replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <span className="font-medium">
                          {progress?.progress || 0} / {req.threshold}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Bar */}
                {!isCompleted && (
                  <div className="space-y-2">
                    <progress_1.Progress
                      value={progressPercentage}
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground text-center">
                      {progressPercentage.toFixed(1)}% Complete
                    </div>
                  </div>
                )}

                {/* Rewards */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Rewards:</div>
                  <div className="flex flex-wrap gap-2">
                    {challenge.rewards.points > 0 && (
                      <badge_1.Badge
                        variant="secondary"
                        className="neon-glow-sm"
                      >
                        <lucide_react_1.Zap className="h-3 w-3 mr-1" />
                        {challenge.rewards.points} points
                      </badge_1.Badge>
                    )}
                    {challenge.rewards.badges.map((badgeId, index) => (
                      <badge_1.Badge
                        key={badgeId}
                        variant="outline"
                        className="neon-glow-sm"
                      >
                        <lucide_react_1.Award className="h-3 w-3 mr-1" />
                        Badge {index + 1}
                      </badge_1.Badge>
                    ))}
                    {challenge.rewards.achievements.map(
                      (achievementId, index) => (
                        <badge_1.Badge
                          key={achievementId}
                          variant="outline"
                          className="neon-glow-sm"
                        >
                          <lucide_react_1.Trophy className="h-3 w-3 mr-1" />
                          Achievement {index + 1}
                        </badge_1.Badge>
                      )
                    )}
                  </div>
                </div>

                {/* Participants */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <lucide_react_1.Users className="h-4 w-4" />
                    <span>{challenge.participants.length} participants</span>
                  </div>

                  <div className="flex space-x-2">
                    {onViewDetails && (
                      <button_1.Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(challenge.id)}
                      >
                        Details
                      </button_1.Button>
                    )}
                    {!isCompleted &&
                      onJoinChallenge &&
                      !challenge.participants.includes('current-user') && (
                        <button_1.Button
                          size="sm"
                          onClick={() => onJoinChallenge(challenge.id)}
                          className="neon-button"
                        >
                          Join Challenge
                        </button_1.Button>
                      )}
                  </div>
                </div>

                {/* Completion Status */}
                {isCompleted && progress?.completedAt && (
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                    <div className="flex items-center space-x-2 text-green-500">
                      <lucide_react_1.CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Completed on {progress.completedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </card_1.CardContent>
            </card_1.Card>
          );
        })}

        {challenges.length === 0 && (
          <card_1.Card className="glass-card">
            <card_1.CardContent className="py-8">
              <div className="text-center">
                <lucide_react_1.Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No challenges available</p>
                <p className="text-sm text-muted-foreground">
                  New challenges will appear here regularly
                </p>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        )}
      </div>
    </div>
  );
}
