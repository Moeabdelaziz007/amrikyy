import React from 'react';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';

export default function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">
              Dashboard
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">
                  Welcome to AuraOS
                </h2>
                <p className="text-muted-foreground">
                  Your AI-powered automation platform is ready to use.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <p className="text-muted-foreground">
                  Start by exploring the sidebar navigation.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">System Status</h2>
                <p className="text-muted-foreground">
                  All systems are operational.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
