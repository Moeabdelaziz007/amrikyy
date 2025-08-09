'use client'

import { cn } from '@/lib/utils'
import { Check, Circle } from 'lucide-react'

interface Step {
  id: number
  title: string
  description?: string
  status: 'completed' | 'current' | 'upcoming'
}

interface ProgressStepsProps {
  steps: Step[]
  className?: string
  orientation?: 'horizontal' | 'vertical'
  showConnectors?: boolean
}

export function ProgressSteps({ 
  steps, 
  className, 
  orientation = 'horizontal',
  showConnectors = true 
}: ProgressStepsProps) {
  return (
    <nav 
      aria-label="Progress" 
      className={cn('w-full', className)}
      role="progressbar"
      aria-valuenow={steps.filter(step => step.status === 'completed').length}
      aria-valuemin={0}
      aria-valuemax={steps.length}
    >
      <ol 
        className={cn(
          'flex',
          orientation === 'vertical' ? 'flex-col space-y-4' : 'items-center justify-between space-x-4 rtl:space-x-reverse'
        )}
      >
        {steps.map((step, stepIdx) => (
          <li 
            key={step.id} 
            className={cn(
              'flex items-center',
              orientation === 'vertical' ? 'w-full' : 'flex-1'
            )}
          >
            <div className="flex items-center group">
              {/* Step Icon */}
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                  step.status === 'completed' && 'border-green-600 bg-green-600 group-hover:scale-110',
                  step.status === 'current' && 'border-blue-600 bg-blue-600 group-hover:scale-110',
                  step.status === 'upcoming' && 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
                )}
                aria-label={`Step ${step.id}: ${step.title}`}
              >
                {step.status === 'completed' ? (
                  <Check className="h-5 w-5 text-white" />
                ) : step.status === 'current' ? (
                  <span className="h-3 w-3 rounded-full bg-white animate-pulse" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                )}
              </div>

              {/* Step Content */}
              <div className={cn('ml-4 rtl:mr-4 rtl:ml-0', orientation === 'vertical' ? 'flex-1' : 'hidden lg:block')}>
                <div
                  className={cn(
                    'text-sm font-medium transition-colors duration-300',
                    step.status === 'completed' && 'text-green-600 dark:text-green-400',
                    step.status === 'current' && 'text-blue-600 dark:text-blue-400',
                    step.status === 'upcoming' && 'text-gray-500 dark:text-gray-400'
                  )}
                >
                  {step.title}
                </div>
                {step.description && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {step.description}
                  </div>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {showConnectors && stepIdx < steps.length - 1 && (
              <div
                className={cn(
                  orientation === 'vertical' ? 'ml-5 mt-2 h-8 w-0.5' : 'mx-4 h-0.5 flex-1',
                  'bg-gray-200 dark:bg-gray-700',
                  steps[stepIdx + 1].status === 'completed' && 'bg-green-600',
                  steps[stepIdx + 1].status === 'current' && step.status === 'completed' && 'bg-green-600'
                )}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Simplified version for inline use
export function SimpleProgressSteps({ 
  currentStep, 
  totalSteps, 
  className 
}: { 
  currentStep: number
  totalSteps: number
  className?: string 
}) {
  return (
    <div className={cn('flex items-center space-x-2 rtl:space-x-reverse', className)}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={cn(
            'h-2 flex-1 rounded-full transition-all duration-300',
            i < currentStep ? 'bg-green-600' : i === currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
          )}
          aria-label={`Step ${i + 1} of ${totalSteps}`}
        />
      ))}
      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 rtl:mr-2 rtl:ml-0">
        {currentStep} / {totalSteps}
      </span>
    </div>
  )
}
