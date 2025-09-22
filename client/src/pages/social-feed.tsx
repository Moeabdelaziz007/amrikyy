import React from 'react';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';

export default function SocialFeed() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">
              Social Feed
            </h1>
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border">
                <p className="text-muted-foreground">
                  Social feed content will be displayed here.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
