"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AgentTemplateCard;
const react_query_1 = require("@tanstack/react-query");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const use_toast_1 = require("@/hooks/use-toast");
const queryClient_1 = require("@/lib/queryClient");
function AgentTemplateCard({ template, showActions = false }) {
    const { toast } = (0, use_toast_1.useToast)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const useTemplateMutation = (0, react_query_1.useMutation)({
        mutationFn: async () => {
            await (0, queryClient_1.apiRequest)('POST', `/api/agent-templates/${template.id}/use`);
            return (0, queryClient_1.apiRequest)('POST', '/api/user-agents', {
                userId: 'user-1',
                templateId: template.id,
                name: template.name,
                config: template.config,
                isActive: true,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/user-agents'] });
            queryClient.invalidateQueries({ queryKey: ['/api/agent-templates'] });
            toast({
                title: "Agent created!",
                description: `${template.name} has been added to your agents.`,
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to create agent. Please try again.",
                variant: "destructive",
            });
        },
    });
    const getGradientFromCategory = (category) => {
        const gradients = {
            'Content': 'from-blue-500 to-purple-500',
            'Engagement': 'from-green-500 to-teal-500',
            'Analytics': 'from-orange-500 to-red-500',
            'default': 'from-gray-500 to-gray-600'
        };
        return gradients[category] || gradients.default;
    };
    return (<card_1.Card className="transition-all duration-200 hover:shadow-md cursor-pointer" data-testid={`agent-template-${template.id}`}>
      <card_1.CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 bg-gradient-to-r ${getGradientFromCategory(template.category)} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <i className={`${template.icon} text-white text-sm`}></i>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground" data-testid={`text-name-${template.id}`}>
              {template.name}
            </h4>
            <p className="text-sm text-muted-foreground mb-3" data-testid={`text-description-${template.id}`}>
              {template.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {template.isPopular && (<badge_1.Badge variant="default" className="bg-primary/10 text-primary" data-testid={`badge-popular-${template.id}`}>
                  Popular
                </badge_1.Badge>)}
              <badge_1.Badge variant="outline" data-testid={`badge-category-${template.id}`}>
                {template.category}
              </badge_1.Badge>
              <span className="text-xs text-muted-foreground" data-testid={`text-usage-${template.id}`}>
                Used {template.usageCount.toLocaleString()} times
              </span>
            </div>
            {showActions && (<div className="flex gap-2 mt-3">
                <button_1.Button size="sm" onClick={() => useTemplateMutation.mutate()} disabled={useTemplateMutation.isPending} data-testid={`button-use-${template.id}`}>
                  <i className={`fas ${useTemplateMutation.isPending ? 'fa-spinner fa-spin' : 'fa-plus'} mr-1`}></i>
                  {useTemplateMutation.isPending ? 'Creating...' : 'Use Template'}
                </button_1.Button>
                <button_1.Button size="sm" variant="outline" data-testid={`button-preview-${template.id}`}>
                  <i className="fas fa-eye mr-1"></i>
                  Preview
                </button_1.Button>
              </div>)}
          </div>
        </div>
      </card_1.CardContent>
    </card_1.Card>);
}
