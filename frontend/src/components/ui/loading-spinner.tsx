'use client'

import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const spinnerVariants = cva(
  'animate-spin rounded-full border-solid border-t-transparent',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 border-2',
        default: 'h-6 w-6 border-2',
        lg: 'h-8 w-8 border-3',
        xl: 'h-12 w-12 border-4',
      },
      variant: {
        default: 'border-blue-600',
        white: 'border-white',
        gray: 'border-gray-400',
        success: 'border-green-600',
        warning: 'border-yellow-600',
        error: 'border-red-600',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
)

interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
  label?: string
}

export function LoadingSpinner({ size, variant, className, label = 'جاري التحميل...' }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse" role="status" aria-label={label}>
      <div className={cn(spinnerVariants({ size, variant }), className)} />
      <span className="sr-only">{label}</span>
    </div>
  )
}

// Advanced Loading Animations
export function PulseLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex space-x-1 rtl:space-x-reverse', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  )
}

export function BouncingDots({ className }: { className?: string }) {
  return (
    <div className={cn('flex space-x-1 rtl:space-x-reverse', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-3 w-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  )
}

export function WaveLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex space-x-1 rtl:space-x-reverse items-end', className)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-full animate-pulse"
          style={{
            height: `${Math.random() * 20 + 10}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1s',
          }}
        />
      ))}
    </div>
  )
}

// Progress Ring
interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function ProgressRing({ 
  progress, 
  size = 40, 
  strokeWidth = 3, 
  className 
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={cn('relative', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-blue-600 transition-all duration-300 ease-out"
        />
      </svg>
      {/* Progress text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  )
}
