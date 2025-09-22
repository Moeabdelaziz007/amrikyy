'use strict';
// Workflow Marketplace Dashboard
// Comprehensive marketplace for workflow templates and automation
Object.defineProperty(exports, '__esModule', { value: true });
exports.WorkflowMarketplace = WorkflowMarketplace;
const react_1 = require('react');
const card_1 = require('../ui/card');
const tabs_1 = require('../ui/tabs');
const button_1 = require('../ui/button');
const badge_1 = require('../ui/badge');
const input_1 = require('../ui/input');
const lucide_react_1 = require('lucide-react');
const use_workflow_automation_1 = require('../../hooks/use-workflow-automation');
function WorkflowMarketplace({ userId }) {
  const [activeTab, setActiveTab] = (0, react_1.useState)('marketplace');
  const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
  const [filters, setFilters] = (0, react_1.useState)({});
  const [viewMode, setViewMode] = (0, react_1.useState)('grid');
  const [sortBy, setSortBy] = (0, react_1.useState)('popularity');
  const {
    marketplace,
    loading: marketplaceLoading,
    searchTemplates,
  } = (0, use_workflow_automation_1.useWorkflowMarketplace)(filters);
  const { recommendations, loading: recommendationsLoading } = (0,
  use_workflow_automation_1.useIntelligentWorkflowRecommendations)(6);
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await searchTemplates(searchQuery, filters);
    }
  };
  const handleFilterChange = newFilters => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  if (marketplaceLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <lucide_react_1.RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading marketplace...</span>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <lucide_react_1.Zap className="h-6 w-6 text-blue-500" />
            Workflow Marketplace
          </h2>
          <p className="text-muted-foreground">
            Discover and deploy powerful automation workflows
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button_1.Button variant="outline" size="sm">
            <lucide_react_1.Sparkles className="h-4 w-4 mr-2" />
            Create Workflow
          </button_1.Button>
          <button_1.Button variant="outline" size="sm">
            <lucide_react_1.Users className="h-4 w-4 mr-2" />
            My Workflows
          </button_1.Button>
        </div>
      </div>

      <tabs_1.Tabs value={activeTab} onValueChange={setActiveTab}>
        <tabs_1.TabsList className="grid w-full grid-cols-3">
          <tabs_1.TabsTrigger value="marketplace">
            Marketplace
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="recommendations">
            For You
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="trending">Trending</tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        <tabs_1.TabsContent value="marketplace" className="space-y-6">
          <MarketplaceTab
            marketplace={marketplace}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filters={filters}
            onFilterChange={handleFilterChange}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onSearch={handleSearch}
          />
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="recommendations" className="space-y-6">
          <RecommendationsTab
            recommendations={recommendations}
            loading={recommendationsLoading}
          />
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="trending" className="space-y-6">
          <TrendingTab marketplace={marketplace} />
        </tabs_1.TabsContent>
      </tabs_1.Tabs>
    </div>
  );
}
function MarketplaceTab({
  marketplace,
  searchQuery,
  setSearchQuery,
  filters,
  onFilterChange,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  onSearch,
}) {
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <lucide_react_1.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input_1.Input
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
            onKeyPress={e => e.key === 'Enter' && onSearch()}
          />
        </div>
        <button_1.Button onClick={onSearch} variant="outline">
          Search
        </button_1.Button>
        <button_1.Button variant="outline" size="sm">
          <lucide_react_1.Filter className="h-4 w-4 mr-2" />
          Filters
        </button_1.Button>
      </div>

      {/* Categories */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <button_1.Button
          variant={!filters.category ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange({ category: undefined })}
        >
          All
        </button_1.Button>
        {marketplace?.categories?.map(category => (
          <button_1.Button
            key={category.id}
            variant={filters.category === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange({ category: category.id })}
            className="flex items-center gap-2"
          >
            <span>{category.icon}</span>
            {category.name}
          </button_1.Button>
        ))}
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {marketplace?.templates?.length || 0} workflows
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
            aria-label="Sort workflows"
          >
            <option value="popularity">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="recent">Most Recent</option>
          </select>
          <button_1.Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <lucide_react_1.Grid className="h-4 w-4" />
          </button_1.Button>
          <button_1.Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <lucide_react_1.List className="h-4 w-4" />
          </button_1.Button>
        </div>
      </div>

      {/* Templates Grid/List */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }
      >
        {(marketplace?.searchResults || marketplace?.templates || []).map(
          template => (
            <WorkflowTemplateCard
              key={template.id}
              template={template}
              viewMode={viewMode}
            />
          )
        )}
      </div>
    </div>
  );
}
function WorkflowTemplateCard({ template, viewMode }) {
  const { createWorkflow } = (0,
  use_workflow_automation_1.useWorkflowTemplate)();
  const [installing, setInstalling] = (0, react_1.useState)(false);
  const handleInstall = async () => {
    try {
      setInstalling(true);
      await createWorkflow(template.id);
      // Show success message
    } catch (error) {
      console.error('Error installing workflow:', error);
    } finally {
      setInstalling(false);
    }
  };
  if (viewMode === 'list') {
    return (
      <card_1.Card className="flex">
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold">{template.name}</h3>
                {template.isFeatured && (
                  <badge_1.Badge
                    variant="default"
                    className="bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    Featured
                  </badge_1.Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-3">
                {template.description}
              </p>

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <lucide_react_1.Star className="h-4 w-4 text-yellow-500" />
                  <span>{template.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <lucide_react_1.Download className="h-4 w-4" />
                  <span>{template.downloads}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <lucide_react_1.Clock className="h-4 w-4" />
                  <span>{template.estimatedTime}m</span>
                </div>
                <badge_1.Badge variant="outline">
                  {template.difficulty}
                </badge_1.Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button_1.Button variant="outline" size="sm">
                <lucide_react_1.Eye className="h-4 w-4 mr-2" />
                Preview
              </button_1.Button>
              <button_1.Button
                onClick={handleInstall}
                disabled={installing}
                size="sm"
              >
                <lucide_react_1.Download className="h-4 w-4 mr-2" />
                {installing ? 'Installing...' : 'Install'}
              </button_1.Button>
            </div>
          </div>
        </div>
      </card_1.Card>
    );
  }
  return (
    <card_1.Card className="group hover:shadow-lg transition-shadow">
      <card_1.CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <card_1.CardTitle className="text-lg">
                {template.name}
              </card_1.CardTitle>
              {template.isFeatured && (
                <badge_1.Badge
                  variant="default"
                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  Featured
                </badge_1.Badge>
              )}
            </div>
            <card_1.CardDescription>
              {template.description}
            </card_1.CardDescription>
          </div>
          <div className="text-2xl">{template.icon}</div>
        </div>
      </card_1.CardHeader>
      <card_1.CardContent>
        <div className="space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map(tag => (
              <badge_1.Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </badge_1.Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <lucide_react_1.Star className="h-4 w-4 text-yellow-500" />
              <span>{template.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <lucide_react_1.Download className="h-4 w-4" />
              <span>{template.downloads}</span>
            </div>
            <div className="flex items-center space-x-1">
              <lucide_react_1.Clock className="h-4 w-4" />
              <span>{template.estimatedTime}m</span>
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex items-center justify-between">
            <badge_1.Badge
              variant={
                template.difficulty === 'beginner'
                  ? 'default'
                  : template.difficulty === 'intermediate'
                    ? 'secondary'
                    : 'destructive'
              }
            >
              {template.difficulty}
            </badge_1.Badge>
            <span className="text-sm text-muted-foreground">
              by {template.author.name}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 pt-2">
            <button_1.Button
              onClick={handleInstall}
              disabled={installing}
              className="flex-1"
            >
              <lucide_react_1.Download className="h-4 w-4 mr-2" />
              {installing ? 'Installing...' : 'Install'}
            </button_1.Button>
            <button_1.Button variant="outline" size="sm">
              <lucide_react_1.Eye className="h-4 w-4" />
            </button_1.Button>
            <button_1.Button variant="outline" size="sm">
              <lucide_react_1.Heart className="h-4 w-4" />
            </button_1.Button>
          </div>
        </div>
      </card_1.CardContent>
    </card_1.Card>
  );
}
function RecommendationsTab({ recommendations, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <lucide_react_1.RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Finding recommendations for you...</span>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Recommended for You</h3>
        <p className="text-muted-foreground">
          Workflows tailored to your usage patterns and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map(template => (
          <WorkflowTemplateCard
            key={template.id}
            template={template}
            viewMode="grid"
          />
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-8">
          <lucide_react_1.Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
          <p className="text-muted-foreground">
            Keep using the platform to get personalized workflow recommendations
          </p>
        </div>
      )}
    </div>
  );
}
function TrendingTab({ marketplace }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Trending Workflows</h3>
        <p className="text-muted-foreground">
          Most popular and trending automation workflows
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketplace?.trending?.map(template => (
          <WorkflowTemplateCard
            key={template.id}
            template={template}
            viewMode="grid"
          />
        ))}
      </div>
    </div>
  );
}
exports.default = WorkflowMarketplace;
