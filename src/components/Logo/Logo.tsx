import { SiteSetting } from '@/payload-types'
import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  data: SiteSetting
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className,data } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  const url = typeof data.logo !== 'number' ? data.logo.url : ''
  const width = typeof data.logo !== 'number' ? data.logo.width : 193
  const height = typeof data.logo !== 'number' ? data.logo.height : 34
  const cssClass = clsx('max-w-[9.375rem] w-full h-['+height+'px]', className)
  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Payload Logo"
      width={width || 193}
      height={height || 34}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={cssClass}
      src={url || ''}
    />
  )
}
