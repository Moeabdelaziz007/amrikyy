import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/navigation/navbar'
import { ThemeProvider } from '@/components/ui/theme-provider'
import './globals.css'
import '@/styles/design-tokens.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Amrikyy AI - RAG-Powered Assistant & LinkedIn Generator',
  description: 'مساعد ذكي، موجز، واعٍ للسياق، يعطي إجابات مستندة إلى مصادر + مولد منشورات LinkedIn فيروسية',
  keywords: 'AI, RAG, Assistant, Arabic, ChatGPT, Documents, LinkedIn, Social Media, Viral Posts',
  authors: [{ name: 'Amrikyy AI Team' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider defaultTheme="dark" defaultLanguage="ar">
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 transition-colors duration-500">
            <Navbar />
            <main className="relative">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
