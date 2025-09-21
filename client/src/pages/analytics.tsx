"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnalyticsPage;
const sidebar_1 = require("@/components/layout/sidebar");
const header_1 = require("@/components/layout/header");
const card_1 = require("@/components/ui/card");

function AnalyticsPage() {
    return (<div className="flex h-screen overflow-hidden bg-background carbon-texture">
      <sidebar_1.default />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header_1.default title="Analytics" subtitle="Insights and system metrics"/>
        <main className="flex-1 overflow-auto cyber-scrollbar">
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            <card_1.Card className="glass-card">
              <card_1.CardHeader>
                <card_1.CardTitle>Overview</card_1.CardTitle>
                <card_1.CardDescription>Key metrics and performance insights</card_1.CardDescription>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-primary/10">
                    <div className="text-2xl font-bold text-primary">--</div>
                    <div className="text-sm text-muted-foreground">Active Users</div>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/10">
                    <div className="text-2xl font-bold text-accent">--%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/10">
                    <div className="text-2xl font-bold text-green-500">--ms</div>
                    <div className="text-sm text-muted-foreground">Avg Response</div>
                  </div>
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </div>
        </main>
      </div>
    </div>);
}


