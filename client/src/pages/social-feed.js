"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SocialFeed;
const react_query_1 = require("@tanstack/react-query");
const sidebar_1 = require("@/components/layout/sidebar");
const header_1 = require("@/components/layout/header");
const post_card_1 = require("@/components/social/post-card");
const create_post_dialog_1 = require("@/components/social/create-post-dialog");
const chat_widget_1 = require("@/components/chat/chat-widget");
const card_1 = require("@/components/ui/card");
function SocialFeed() {
    const { data: posts, isLoading } = (0, react_query_1.useQuery)({
        queryKey: ['/api/posts'],
    });
    return (<div className="flex h-screen overflow-hidden bg-background">
      <sidebar_1.default />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header_1.default title="Social Feed" subtitle="Engage with your community and share content" actions={<create_post_dialog_1.default />}/>
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-4xl mx-auto">
            {isLoading ? (<div className="space-y-6">
                {Array.from({ length: 5 }).map((_, i) => (<card_1.Card key={i} className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-full"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-muted rounded w-1/4"></div>
                          <div className="h-3 bg-muted rounded w-1/6"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                      </div>
                      <div className="h-48 bg-muted rounded"></div>
                    </div>
                  </card_1.Card>))}
              </div>) : posts?.length ? (<div className="space-y-6">
                {posts.map((post) => (<post_card_1.default key={post.id} post={post}/>))}
              </div>) : (<card_1.Card className="p-12 text-center">
                <div className="space-y-4">
                  <i className="fas fa-comments text-4xl text-muted-foreground"></i>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">No posts yet</h3>
                    <p className="text-muted-foreground">Be the first to share something with the community!</p>
                  </div>
                  <create_post_dialog_1.default />
                </div>
              </card_1.Card>)}
          </div>
        </main>
      </div>

      <chat_widget_1.default />
    </div>);
}
