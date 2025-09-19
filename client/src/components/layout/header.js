"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Header;
const button_1 = require("@/components/ui/button");
function Header({ title, subtitle, actions }) {
    return (<header className="glass-card border-b border-border/50 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold neon-text animate-neon-flicker" data-testid="text-page-title">
            {title}
          </h1>
          {subtitle && (<p className="text-sm text-muted-foreground mt-1" data-testid="text-page-subtitle">
              {subtitle}
            </p>)}
        </div>
        <div className="flex items-center gap-4">
          <button_1.Button variant="ghost" size="sm" className="relative neon-glow-sm hover:neon-glow-md transition-all duration-300" data-testid="button-notifications">
            <i className="fas fa-bell text-lg"></i>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-neon-pulse neon-glow-sm"></span>
          </button_1.Button>
          {actions}
        </div>
      </div>
    </header>);
}
