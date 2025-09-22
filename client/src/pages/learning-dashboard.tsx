import React from 'react';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';

export default function LearningDashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">
              Learning Dashboard
            </h1>
            <div className="bg-card p-6 rounded-lg border">
              <p className="text-muted-foreground">
                Learning dashboard interface will be displayed here.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
