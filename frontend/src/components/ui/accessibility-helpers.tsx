'use client'

import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

// Screen Reader Only Text
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  )
}

// Skip to Content Link
export function SkipToContent({ targetId = 'main-content' }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg transition-all duration-300"
    >
      تخطي إلى المحتوى الرئيسي
    </a>
  )
}

// Focus Trap Component
interface FocusTrapProps {
  children: React.ReactNode
  enabled?: boolean
  className?: string
}

export function FocusTrap({ children, enabled = true, className }: FocusTrapProps) {
  useEffect(() => {
    if (!enabled) return

    const focusableElements = [
      'button',
      '[href]',
      'input',
      'select',
      'textarea',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',')

    const modal = document.querySelector('[data-focus-trap="true"]') as HTMLElement
    if (!modal) return

    const firstFocusableElement = modal.querySelector(focusableElements) as HTMLElement
    const focusableNodes = modal.querySelectorAll(focusableElements)
    const lastFocusableElement = focusableNodes[focusableNodes.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          e.preventDefault()
          lastFocusableElement.focus()
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          e.preventDefault()
          firstFocusableElement.focus()
        }
      }
    }

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Handle escape key - close modal, etc.
      }
    }

    document.addEventListener('keydown', handleTabKey)
    document.addEventListener('keydown', handleEscapeKey)

    // Focus first element
    firstFocusableElement?.focus()

    return () => {
      document.removeEventListener('keydown', handleTabKey)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [enabled])

  return (
    <div data-focus-trap="true" className={className}>
      {children}
    </div>
  )
}

// Live Region for Announcements
interface LiveRegionProps {
  children: React.ReactNode
  politeness?: 'polite' | 'assertive' | 'off'
  atomic?: boolean
  className?: string
}

export function LiveRegion({ 
  children, 
  politeness = 'polite', 
  atomic = true, 
  className 
}: LiveRegionProps) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      className={cn('sr-only', className)}
    >
      {children}
    </div>
  )
}

// Keyboard Navigation Helper
export function useKeyboardNavigation(
  ref: React.RefObject<HTMLElement>,
  options: {
    onEnter?: () => void
    onSpace?: () => void
    onEscape?: () => void
    onArrowUp?: () => void
    onArrowDown?: () => void
    onArrowLeft?: () => void
    onArrowRight?: () => void
  } = {}
) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
          e.preventDefault()
          options.onEnter?.()
          break
        case ' ':
          e.preventDefault()
          options.onSpace?.()
          break
        case 'Escape':
          e.preventDefault()
          options.onEscape?.()
          break
        case 'ArrowUp':
          e.preventDefault()
          options.onArrowUp?.()
          break
        case 'ArrowDown':
          e.preventDefault()
          options.onArrowDown?.()
          break
        case 'ArrowLeft':
          e.preventDefault()
          options.onArrowLeft?.()
          break
        case 'ArrowRight':
          e.preventDefault()
          options.onArrowRight?.()
          break
      }
    }

    element.addEventListener('keydown', handleKeyDown)
    return () => element.removeEventListener('keydown', handleKeyDown)
  }, [ref, options])
}

// High Contrast Mode Detection
export function useHighContrastMode() {
  const [isHighContrast, setIsHighContrast] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    setIsHighContrast(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return isHighContrast
}

// Reduced Motion Detection
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// ARIA Describedby Helper
interface AriaDescriptionProps {
  id: string
  children: React.ReactNode
  className?: string
}

export function AriaDescription({ id, children, className }: AriaDescriptionProps) {
  return (
    <div id={id} className={cn('sr-only', className)}>
      {children}
    </div>
  )
}

// Enhanced Form Field with Accessibility
interface AccessibleFieldProps {
  label: string
  description?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  id: string
  className?: string
}

export function AccessibleField({
  label,
  description,
  error,
  required = false,
  children,
  id,
  className,
}: AccessibleFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className={cn('space-y-2', className)}>
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="مطلوب">
            *
          </span>
        )}
      </label>
      
      {description && (
        <p id={descriptionId} className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      
      <div>
        {children}
      </div>
      
      {error && (
        <p 
          id={errorId} 
          className="text-sm text-red-600 dark:text-red-400" 
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  )
}

// Color Contrast Checker (Development Helper)
export function checkColorContrast(foreground: string, background: string): {
  ratio: number
  aa: boolean
  aaa: boolean
} {
  // This is a simplified version - in production, use a proper library
  // like 'color-contrast-checker'
  
  const getRGB = (color: string) => {
    // Convert hex to RGB (simplified)
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    return [r, g, b]
  }

  const getLuminance = (rgb: number[]) => {
    const [r, g, b] = rgb.map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const fgRGB = getRGB(foreground)
  const bgRGB = getRGB(background)
  
  const fgLuminance = getLuminance(fgRGB)
  const bgLuminance = getLuminance(bgRGB)
  
  const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / 
                (Math.min(fgLuminance, bgLuminance) + 0.05)

  return {
    ratio,
    aa: ratio >= 4.5,
    aaa: ratio >= 7
  }
}
