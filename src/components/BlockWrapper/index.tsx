import React from 'react'
import { cn } from '@/utilities/ui'

export interface BlockSettings {
  anchor?: string | null
  width?: 'standard' | 'large' | 'full' | null
  spacingTop?: 'none' | 'small' | 'medium' | 'large' | null
  spacingBottom?: 'none' | 'small' | 'medium' | 'large' | null
  background?: 'default' | 'muted' | 'card' | 'primary' | 'accent' | null
}

interface BlockWrapperProps {
  children: React.ReactNode
  settings?: BlockSettings | null
  id?: string | null
  className?: string
}

const widthClasses = {
  standard: 'max-w-6xl',
  large: 'max-w-7xl',
  full: 'max-w-none',
}

const spacingTopClasses = {
  none: 'mt-0',
  small: 'mt-4',
  medium: 'mt-8',
  large: 'mt-16',
}

const spacingBottomClasses = {
  none: 'mb-0',
  small: 'mb-4',
  medium: 'mb-8',
  large: 'mb-16',
}

const backgroundClasses = {
  default: 'bg-transparent text-foreground',
  muted: 'bg-muted text-foreground',
  card: 'bg-card text-card-foreground',
  primary: 'bg-primary text-primary-foreground',
  accent: 'bg-accent text-accent-foreground',
}

export const BlockWrapper: React.FC<BlockWrapperProps> = ({
  children,
  settings,
  id,
  className,
}) => {
  const width = settings?.width ?? 'standard'
  const spacingTop = settings?.spacingTop ?? 'medium'
  const spacingBottom = settings?.spacingBottom ?? 'medium'
  const background = settings?.background ?? 'default'

  return (
    <section
      id={settings?.anchor || id || undefined}
      className={cn(
        'mx-auto w-full overflow-hidden rounded-2xl',
        widthClasses[width],
        spacingTopClasses[spacingTop],
        spacingBottomClasses[spacingBottom],
        backgroundClasses[background],
        `block-background-${background}`,
        className,
      )}
    >
      <div className="w-full p-6 md:p-8">{children}</div>
    </section>
  )
}
