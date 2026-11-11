import Image from 'next/image'
import React from 'react'

import type { GalleryGrid as GalleryGridProps } from '@/payload-types'
import { BlockWrapper } from '@/components/BlockWrapper'

const gridColumns = {
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

const aspectRatios = {
  square: 'aspect-square',
  landscape: 'aspect-video',
  portrait: 'aspect-[3/4]',
}

export const GalleryGrid: React.FC<GalleryGridProps> = (props) => {
  const { title, description, images, columns = '3', aspectRatio = 'square', blockSettings } = props

  const columnsClass = gridColumns[columns ?? '3']
  const ratioClass = aspectRatios[aspectRatio ?? 'square']

  return (
    <BlockWrapper settings={blockSettings} id={props.blockName}>
      {title && <h2 className="mb-4 text-3xl font-bold">{title}</h2>}

      {description && <p className="mb-8 text-muted-foreground">{description}</p>}

      <div className={`grid ${columnsClass} gap-6`}>
        {images?.map((image) => {
          if (typeof image !== 'object' || !image?.url) return null

          return (
            <div key={image.id} className={`relative overflow-hidden rounded-xl ${ratioClass}`}>
              <Image
                src={image.url}
                alt={image.alt || ''}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          )
        })}
      </div>
    </BlockWrapper>
  )
}
