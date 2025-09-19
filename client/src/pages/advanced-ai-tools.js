"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdvancedAIToolsPage;
const sidebar_1 = require("@/components/layout/sidebar");
const header_1 = require("@/components/layout/header");
const advanced_ai_tools_1 = require("@/components/ai/advanced-ai-tools");
function AdvancedAIToolsPage() {
    return (<div className="flex h-screen overflow-hidden bg-background">
      <sidebar_1.default />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header_1.default title="Advanced AI Tools" subtitle="Powerful AI tools with MCP integration" actions={<div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">MCP:</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-500">Connected</span>
            </div>}/>
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">
            <advanced_ai_tools_1.default />
          </div>
        </main>
      </div>
    </div>);
}
