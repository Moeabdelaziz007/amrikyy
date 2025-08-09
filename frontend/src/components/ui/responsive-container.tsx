'use client'

import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full'
  center?: boolean
  responsive?: {
    mobile?: string
    tablet?: string
    desktop?: string
  }
}

export function ResponsiveContainer({
  children,
  className,
  breakpoint = 'lg',
  padding = 'md',
  maxWidth = '7xl',
  center = true,
  responsive,
}: ResponsiveContainerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-2',
    md: 'px-4 py-4 sm:px-6 lg:px-8',
    lg: 'px-4 py-6 sm:px-6 lg:px-8 lg:py-8',
    xl: 'px-4 py-8 sm:px-6 lg:px-8 lg:py-12',
  }

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  }

  if (!mounted) {
    return null
  }

  return (
    <div
      className={cn(
        'w-full',
        maxWidthClasses[maxWidth],
        center && 'mx-auto',
        paddingClasses[padding],
        responsive?.mobile && `${responsive.mobile}`,
        responsive?.tablet && `md:${responsive.tablet}`,
        responsive?.desktop && `lg:${responsive.desktop}`,
        className
      )}
    >
      {children}
    </div>
  )
}

// Responsive Grid Component
interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export function ResponsiveGrid({
  children,
  className,
  cols = { default: 1, md: 2, lg: 3 },
  gap = 'md',
}: ResponsiveGridProps) {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }

  const getGridCols = () => {
    const classes = []
    
    if (cols.default) classes.push(`grid-cols-${cols.default}`)
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`)
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`)
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`)
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`)
    
    return classes.join(' ')
  }

  return (
    <div
      className={cn(
        'grid',
        getGridCols(),
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  )
}

// Responsive Text Component
interface ResponsiveTextProps {
  children: React.ReactNode
  className?: string
  size?: {
    default?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
    sm?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
    md?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
    lg?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  }
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
}

export function ResponsiveText({
  children,
  className,
  size = { default: 'base' },
  weight = 'normal',
  as: Component = 'p',
}: ResponsiveTextProps) {
  const getSizeClasses = () => {
    const classes = []
    
    if (size.default) classes.push(`text-${size.default}`)
    if (size.sm) classes.push(`sm:text-${size.sm}`)
    if (size.md) classes.push(`md:text-${size.md}`)
    if (size.lg) classes.push(`lg:text-${size.lg}`)
    
    return classes.join(' ')
  }

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  return (
    <Component
      className={cn(
        getSizeClasses(),
        weightClasses[weight],
        'transition-all duration-300',
        className
      )}
    >
      {children}
    </Component>
  )
}

// Responsive Stack Component
interface ResponsiveStackProps {
  children: React.ReactNode
  className?: string
  direction?: {
    default?: 'row' | 'col'
    sm?: 'row' | 'col'
    md?: 'row' | 'col'
    lg?: 'row' | 'col'
  }
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
}

export function ResponsiveStack({
  children,
  className,
  direction = { default: 'col' },
  spacing = 'md',
  align = 'start',
  justify = 'start',
}: ResponsiveStackProps) {
  const getDirectionClasses = () => {
    const classes = ['flex']
    
    if (direction.default === 'row') classes.push('flex-row')
    else classes.push('flex-col')
    
    if (direction.sm) classes.push(`sm:flex-${direction.sm}`)
    if (direction.md) classes.push(`md:flex-${direction.md}`)
    if (direction.lg) classes.push(`lg:flex-${direction.lg}`)
    
    return classes.join(' ')
  }

  const spacingClasses = {
    none: '',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  }

  return (
    <div
      className={cn(
        getDirectionClasses(),
        spacingClasses[spacing],
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
    >
      {children}
    </div>
  )
}
