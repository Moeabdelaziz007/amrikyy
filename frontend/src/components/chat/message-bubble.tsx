'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Message } from '@/types/chat'
import { 
  User, 
  Bot, 
  FileText, 
  ThumbsUp, 
  ThumbsDown, 
  Copy,
  CheckCircle
} from 'lucide-react'

interface MessageBubbleProps {
  message: Message
  onShowSources: () => void
}

export function MessageBubble({ message, onShowSources }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  
  const isUser = message.role === 'user'
  const hasSourcesB = message.sources && message.sources.length > 0

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-3xl ${isUser ? 'text-right' : 'text-right'}`}>
        <div className={`rounded-lg p-4 ${
          isUser 
            ? 'bg-primary text-primary-foreground mr-4' 
            : 'bg-card border border-border'
        }`}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none text-right">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    const inline = props.inline;
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark as any}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Actions and Sources */}
        {!isUser && (
          <div className="flex items-center justify-between mt-2 text-sm">
            <div className="flex items-center gap-2">
              {/* Sources Badge */}
              {hasSourcesB && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onShowSources}
                  className="gap-2"
                >
                  <FileText className="w-3 h-3" />
                  <Badge variant="secondary" className="text-xs">
                    {message.sources?.length}
                  </Badge>
                  مصادر موثقة
                </Button>
              )}
              
              {hasSourcesB && (
                <Badge variant="secondary" className="text-xs">
                  ✅ إجابة موثقة
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
              <Button variant="ghost" size="sm">
                <ThumbsUp className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm">
                <ThumbsDown className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className="text-xs text-muted-foreground mt-1 text-left">
          {new Date(message.timestamp).toLocaleTimeString('ar')}
        </div>
      </div>
    </div>
  )
}
