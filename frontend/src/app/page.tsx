'use client'

import { ChatShell } from '@/components/chat/chat-shell'

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <ChatShell />
    </main>
  )
}
