'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = PostCard;
const react_1 = require('react');
const react_query_1 = require('@tanstack/react-query');
const card_1 = require('@/components/ui/card');
const button_1 = require('@/components/ui/button');
const badge_1 = require('@/components/ui/badge');
const avatar_1 = require('@/components/ui/avatar');
const queryClient_1 = require('@/lib/queryClient');
function PostCard({ post }) {
  const [liked, setLiked] = (0, react_1.useState)(false);
  const queryClient = (0, react_query_1.useQueryClient)();
  const likeMutation = (0, react_query_1.useMutation)({
    mutationFn: async () => {
      return (0, queryClient_1.apiRequest)(
        'POST',
        `/api/posts/${post.id}/like`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      setLiked(true);
    },
  });
  const formatTimeAgo = date => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - postDate.getTime()) / (1000 * 60 * 60)
    );
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };
  return (
    <card_1.Card
      className="overflow-hidden transition-all duration-200 hover:shadow-md"
      data-testid={`post-card-${post.id}`}
    >
      <card_1.CardContent className="p-6">
        <div className="flex items-start gap-4">
          <avatar_1.Avatar className="w-12 h-12">
            <avatar_1.AvatarImage
              src={post.author.identityIcon || undefined}
              alt={post.author.identityName}
            />
            <avatar_1.AvatarFallback>
              {post.author.identityName
                .split(' ')
                .map(n => n[0])
                .join('')}
            </avatar_1.AvatarFallback>
          </avatar_1.Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3
                className="font-semibold text-foreground"
                data-testid={`text-author-${post.id}`}
              >
                {post.author.identityName}
              </h3>
              <span className="text-sm text-muted-foreground">
                @{post.author.username}
              </span>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <span
                className="text-sm text-muted-foreground"
                data-testid={`text-timestamp-${post.id}`}
              >
                {formatTimeAgo(post.createdAt || new Date())}
              </span>
              {post.isAiGenerated && (
                <badge_1.Badge
                  variant="secondary"
                  className="ml-auto bg-primary/10 text-primary"
                  data-testid={`badge-ai-generated-${post.id}`}
                >
                  <i className="fas fa-robot mr-1"></i>
                  AI Enhanced
                </badge_1.Badge>
              )}
            </div>

            <p
              className="text-foreground mb-4 whitespace-pre-wrap"
              data-testid={`text-content-${post.id}`}
            >
              {post.content}
            </p>

            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post content"
                className="w-full h-48 object-cover rounded-lg mb-4"
                data-testid={`img-content-${post.id}`}
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-6">
            <button_1.Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-2 transition-colors ${liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
              data-testid={`button-like-${post.id}`}
            >
              <i className={liked ? 'fas fa-heart' : 'far fa-heart'}></i>
              <span data-testid={`text-likes-${post.id}`}>
                {liked ? post.likes + 1 : post.likes}
              </span>
            </button_1.Button>

            <button_1.Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              data-testid={`button-comment-${post.id}`}
            >
              <i className="fas fa-comment"></i>
              <span data-testid={`text-comments-${post.id}`}>
                {post.comments}
              </span>
            </button_1.Button>

            <button_1.Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground hover:text-green-500 transition-colors"
              data-testid={`button-share-${post.id}`}
            >
              <i className="fas fa-retweet"></i>
              <span data-testid={`text-shares-${post.id}`}>{post.shares}</span>
            </button_1.Button>
          </div>

          <button_1.Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            data-testid={`button-bookmark-${post.id}`}
          >
            <i className="far fa-bookmark"></i>
          </button_1.Button>
        </div>
      </card_1.CardContent>
    </card_1.Card>
  );
}
