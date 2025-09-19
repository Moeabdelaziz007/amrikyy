"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SmartLearningPage;
const sidebar_1 = require("@/components/layout/sidebar");
const header_1 = require("@/components/layout/header");
const smart_learning_ai_1 = require("@/components/ai/smart-learning-ai");
function SmartLearningPage() {
    return (<div className="flex h-screen overflow-hidden bg-background">
      <sidebar_1.default />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header_1.default title="Smart Learning AI" subtitle="Zero-shot learning with meta-loop adaptation" actions={<div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Meta-Learning:</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-500">Active</span>
            </div>}/>
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">
            <smart_learning_ai_1.default />
          </div>
        </main>
      </div>
    </div>);
}
