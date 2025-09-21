"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sidebar;
const wouter_1 = require("wouter");
const wouter_2 = require("wouter");
const react_query_1 = require("@tanstack/react-query");
const utils_1 = require("@/lib/utils");
const avatar_1 = require("@/components/ui/avatar");
const button_1 = require("@/components/ui/button");
const separator_1 = require("@/components/ui/separator");
const use_auth_1 = require("@/hooks/use-auth");
const navigation = [
    { name: 'Dashboard', href: '/', icon: 'fas fa-home' },
    { name: 'Social Feed', href: '/social-feed', icon: 'fas fa-users', hasNotification: true },
    { name: 'Workflows', href: '/workflows', icon: 'fas fa-project-diagram' },
    { name: 'AI Agents', href: '/ai-agents', icon: 'fas fa-robot' },
    { name: 'MCP Tools', href: '/mcp-tools', icon: 'fas fa-puzzle-piece', hasNotification: true },
    { name: 'Web Scraper', href: '/mcp-tools?tool=web_scraper', icon: 'fas fa-spider', category: 'mcp' },
    { name: 'Data Analyzer', href: '/mcp-tools?tool=data_analyzer', icon: 'fas fa-chart-line', category: 'mcp' },
    { name: 'Text Processor', href: '/mcp-tools?tool=text_processor', icon: 'fas fa-file-text', category: 'mcp' },
    { name: 'File Operations', href: '/mcp-tools?tool=file_operations', icon: 'fas fa-file', category: 'mcp' },
    { name: 'Image Processor', href: '/mcp-tools?tool=image_processor', icon: 'fas fa-image', category: 'mcp' },
    { name: 'Database Ops', href: '/mcp-tools?tool=database_operations', icon: 'fas fa-database', category: 'mcp' },
    { name: 'API Tester', href: '/mcp-tools?tool=api_tester', icon: 'fas fa-flask', category: 'mcp' },
    { name: 'Code Generator', href: '/mcp-tools?tool=code_generator', icon: 'fas fa-code', category: 'mcp' },
    { name: 'Data Visualizer', href: '/mcp-tools?tool=data_visualizer', icon: 'fas fa-chart-pie', category: 'mcp' },
    { name: 'Automation', href: '/mcp-tools?tool=automation', icon: 'fas fa-cogs', category: 'mcp' },
    { name: 'Knowledge Base', href: '/mcp-tools?tool=knowledge_base', icon: 'fas fa-book-open', category: 'mcp' },
    { name: 'System Info', href: '/mcp-tools?tool=system_info', icon: 'fas fa-info-circle', category: 'mcp' },
    { name: 'Code Formatter', href: '/mcp-tools?tool=code_formatter', icon: 'fas fa-indent', category: 'mcp' },
    { name: 'Cursor CLI', href: '/mcp-tools?tool=cursor_cli', icon: 'fas fa-terminal', category: 'mcp' },
    { name: 'Comet Chrome', href: '/mcp-tools?tool=comet_chrome', icon: 'fas fa-globe', category: 'mcp' },
    { name: 'Multilingual Assistant', href: '/mcp-tools?tool=multilingual_assistant', icon: 'fas fa-language', category: 'mcp' },
    { name: 'System Designer', href: '/mcp-tools?tool=system_designer', icon: 'fas fa-drafting-compass', category: 'mcp' },
    { name: 'Educational Tutor', href: '/mcp-tools?tool=educational_tutor', icon: 'fas fa-chalkboard-teacher', category: 'mcp' },
    { name: 'Wellness Coach', href: '/mcp-tools?tool=wellness_coach', icon: 'fas fa-heart', category: 'mcp' },
    { name: 'Prompt Library', href: '/prompt-library', icon: 'fas fa-book', hasNotification: true },
    { name: 'Learning', href: '/learning', icon: 'fas fa-graduation-cap', hasNotification: true },
    { name: 'Smart Learning', href: '/smart-learning', icon: 'fas fa-brain' },
    { name: 'AI Tools', href: '/advanced-ai-tools', icon: 'fas fa-tools' },
    { name: 'Travel Agency', href: '/ai-travel-agency', icon: 'fas fa-plane' },
    { name: 'Telegram', href: '/telegram', icon: 'fab fa-telegram' },
    { name: 'Analytics', href: '/analytics', icon: 'fas fa-chart-bar' },
    { name: 'Settings', href: '/settings', icon: 'fas fa-cog' },
    { name: 'Debug', href: '/debug', icon: 'fas fa-bug' },
    { name: 'Workspace', href: '/workspace', icon: 'fas fa-star' },
];
function Sidebar() {
    const [location] = (0, wouter_1.useLocation)();
    const { user, signOut } = (0, use_auth_1.useAuth)();
    const isGuestUser = user?.isAnonymous || localStorage.getItem('isGuestUser') === 'true';
    const [expandedSections, setExpandedSections] = (0, react_1.useState)({
        mcp: true,
        ai: true,
        tools: true
    });
    const { data: userData } = (0, react_query_1.useQuery)({
        queryKey: ['userData', user?.uid],
        queryFn: () => user?.uid ? Promise.resolve({ displayName: user.displayName, email: user.email }) : null,
        enabled: !!user?.uid
    });
    const handleSignOut = async () => {
        try {
            await signOut();
        }
        catch (error) {
            console.error('Sign out error:', error);
        }
    };
    const toggleSection = (section: string) => {
        setExpandedSections((prev: any) => ({
            ...prev,
            [section]: !prev[section]
        }));
    };
    const groupedNavigation = {
        main: navigation.filter(item => !item.category),
        mcp: navigation.filter(item => item.category === 'mcp')
    };
    return (<div className="w-64 glass-card border-r border-border/50 flex flex-col backdrop-blur-xl cyber-scrollbar">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-cyber-primary rounded-xl flex items-center justify-center neon-glow-lg animate-neon-pulse">
            <i className="fas fa-robot text-white text-lg"></i>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl neon-text animate-neon-flicker">AuraOS</span>
            <span className="text-xs text-muted-foreground font-mono">v2.0</span>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4">
        <ul className="space-y-2">
          {/* Main Navigation */}
          {groupedNavigation.main.map((item) => {
            const isActive = location === item.href;
            return (<li key={item.name}>
                <wouter_2.Link href={item.href}>
                  <a className={(0, utils_1.cn)("flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden", isActive
                    ? "gradient-cyber-primary text-white neon-glow-lg animate-neon-pulse"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:neon-glow-sm hover:border-primary/30 border border-transparent")} data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}>
                    <i className={`${item.icon} w-5 transition-transform duration-300 group-hover:scale-110`}></i>
                    <span className="font-medium">{item.name}</span>
                    {item.hasNotification && (<div className="ml-auto w-2 h-2 bg-accent rounded-full animate-neon-pulse neon-glow-sm"></div>)}
                    {isActive && (<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-cyber-scan"></div>)}
                  </a>
                </wouter_2.Link>
              </li>);
        })}
          
          {/* MCP Tools Section */}
          {groupedNavigation.mcp.length > 0 && (<>
            <separator_1.Separator className="my-4 bg-border/30"/>
            <li>
              <button onClick={() => toggleSection('mcp')} className="flex items-center gap-3 px-4 py-2 w-full text-left text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                <i className={`fas fa-chevron-${expandedSections.mcp ? 'down' : 'right'} w-4 transition-transform duration-200`}></i>
                <i className="fas fa-puzzle-piece w-4"></i>
                <span>MCP Tools ({groupedNavigation.mcp.length})</span>
              </button>
            </li>
            {expandedSections.mcp && groupedNavigation.mcp.map((item) => {
              const isActive = location === item.href;
              return (<li key={item.name} className="ml-4">
                  <wouter_2.Link href={item.href}>
                    <a className={(0, utils_1.cn)("flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 group relative overflow-hidden text-sm", isActive
                      ? "gradient-cyber-primary text-white neon-glow-lg animate-neon-pulse"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:neon-glow-sm hover:border-primary/30 border border-transparent")} data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}>
                      <i className={`${item.icon} w-4 transition-transform duration-300 group-hover:scale-110`}></i>
                      <span className="font-medium">{item.name}</span>
                      {isActive && (<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-cyber-scan"></div>)}
                    </a>
                  </wouter_2.Link>
                </li>);
          })}
          </>)}
        </ul>
      </nav>
      
      <separator_1.Separator className="bg-border/30"/>
      
      {/* User Profile */}
      <div className="p-4">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-all duration-300 group">
          <avatar_1.Avatar className="w-10 h-10 border border-primary/30 neon-glow-sm group-hover:neon-glow-md transition-all duration-300">
            <avatar_1.AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'}/>
            <avatar_1.AvatarFallback className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary font-bold">
              {user?.displayName?.split(' ').map(n => n[0]).join('') || user?.email?.[0]?.toUpperCase() || 'U'}
            </avatar_1.AvatarFallback>
          </avatar_1.Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground truncate neon-text" data-testid="text-user-name">
                {user?.displayName || user?.email || 'User'}
              </p>
              {isGuestUser && (
                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
                  Guest
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate" data-testid="text-user-email">
              {user?.email || 'user@example.com'}
            </p>
          </div>
          <button_1.Button variant="ghost" size="sm" onClick={handleSignOut} data-testid="button-sign-out" title="Sign Out" className="hover:bg-primary/20 hover:text-primary transition-all duration-300 neon-glow-sm hover:neon-glow-md">
            <i className="fas fa-sign-out-alt"></i>
          </button_1.Button>
        </div>
      </div>
    </div>);
}
