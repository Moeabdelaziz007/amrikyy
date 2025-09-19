"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TelegramPage;
const sidebar_1 = require("@/components/layout/sidebar");
const header_1 = require("@/components/layout/header");
const telegram_integration_1 = require("@/components/telegram/telegram-integration");
function TelegramPage() {
    return (<div className="flex h-screen overflow-hidden bg-background">
      <sidebar_1.default />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header_1.default title="Telegram Integration" subtitle="Manage your Telegram bot and send messages" actions={<div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Bot Status:</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>}/>
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-6xl mx-auto">
            <telegram_integration_1.default />
          </div>
        </main>
      </div>
    </div>);
}
