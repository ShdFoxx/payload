'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

type AnchorLinkProps = {
  href: string
  anchor?: string | null
  children: React.ReactNode
  className?: string
  newTabProps?: {
    rel: string
    target: string
  }
}

export const AnchorLink: React.FC<AnchorLinkProps> = ({
  href,
  anchor,
  children,
  className,
  newTabProps,
}) => {
  const pathname = usePathname()

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (newTabProps || !href.includes('#')) return

    const [targetPath, hash] = href.split('#')
    const targetAnchor = anchor || hash

    if (pathname === targetPath && targetAnchor) {
      const target = document.getElementById(targetAnchor)

      if (target) {
        event.preventDefault()
        target.scrollIntoView({ behavior: 'smooth' })
        window.history.pushState(null, '', href)
      }
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick} {...newTabProps}>
      {children}
    </Link>
  )
}
