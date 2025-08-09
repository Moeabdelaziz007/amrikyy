'use client'

import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { forwardRef, useEffect, useState } from 'react'

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-2 rtl:space-x-reverse overflow-hidden rounded-lg border p-4 pr-8 rtl:pl-8 rtl:pr-4 shadow-lg transition-all duration-300 animate-in slide-in-from-right-full',
  {
    variants: {
      variant: {
        default: 'border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100',
        destructive: 'border-red-200 bg-red-50 text-red-900 dark:border-red-700 dark:bg-red-900/20 dark:text-red-100',
        success: 'border-green-200 bg-green-50 text-green-900 dark:border-green-700 dark:bg-green-900/20 dark:text-green-100',
        warning: 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-100',
        info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const iconMap = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
}

export interface ToastProps extends VariantProps<typeof toastVariants> {
  title?: string
  description?: string
  action?: React.ReactNode
  onClose?: () => void
  duration?: number
  showProgress?: boolean
  className?: string
}

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = 'default', title, description, action, onClose, duration = 5000, showProgress = true, ...props }, ref) => {
    const [progress, setProgress] = useState(100)
    const [isVisible, setIsVisible] = useState(true)
    const Icon = iconMap[variant || 'default']

    useEffect(() => {
      if (duration && showProgress) {
        const interval = setInterval(() => {
          setProgress((prev) => {
            const newProgress = prev - (100 / (duration / 100))
            if (newProgress <= 0) {
              clearInterval(interval)
              handleClose()
              return 0
            }
            return newProgress
          })
        }, 100)

        return () => clearInterval(interval)
      }
    }, [duration, showProgress])

    const handleClose = () => {
      setIsVisible(false)
      setTimeout(() => onClose?.(), 300)
    }

    if (!isVisible) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
        {...props}
      >
        <div className="flex items-start space-x-3 rtl:space-x-reverse flex-1">
          <Icon className={cn(
            'h-5 w-5 mt-0.5 flex-shrink-0',
            variant === 'success' && 'text-green-600 dark:text-green-400',
            variant === 'destructive' && 'text-red-600 dark:text-red-400',
            variant === 'warning' && 'text-yellow-600 dark:text-yellow-400',
            variant === 'info' && 'text-blue-600 dark:text-blue-400',
            variant === 'default' && 'text-gray-600 dark:text-gray-400'
          )} />
          
          <div className="flex-1 min-w-0">
            {title && (
              <div className="text-sm font-semibold mb-1">
                {title}
              </div>
            )}
            {description && (
              <div className="text-sm opacity-90">
                {description}
              </div>
            )}
          </div>
        </div>

        {action && (
          <div className="flex-shrink-0 ml-3 rtl:mr-3 rtl:ml-0">
            {action}
          </div>
        )}

        {onClose && (
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 rtl:left-2 rtl:right-auto p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="إغلاق الإشعار"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Progress Bar */}
        {showProgress && duration && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10">
            <div
              className={cn(
                'h-full transition-all duration-100 ease-linear',
                variant === 'success' && 'bg-green-600',
                variant === 'destructive' && 'bg-red-600',
                variant === 'warning' && 'bg-yellow-600',
                variant === 'info' && 'bg-blue-600',
                variant === 'default' && 'bg-gray-600'
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    )
  }
)
Toast.displayName = 'Toast'

// Toast Container
export function ToastContainer({ 
  toasts, 
  position = 'top-right' 
}: { 
  toasts: (ToastProps & { id: string })[]
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}) {
  const positionClasses = {
    'top-right': 'top-4 right-4 rtl:left-4 rtl:right-auto',
    'top-left': 'top-4 left-4 rtl:right-4 rtl:left-auto',
    'bottom-right': 'bottom-4 right-4 rtl:left-4 rtl:right-auto',
    'bottom-left': 'bottom-4 left-4 rtl:right-4 rtl:left-auto',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  }

  return (
    <div className={cn('fixed z-50 flex flex-col space-y-2 w-full max-w-sm', positionClasses[position])}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}

export { Toast, toastVariants }
