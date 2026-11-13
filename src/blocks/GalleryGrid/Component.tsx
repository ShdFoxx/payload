import Image from 'next/image'
import React from 'react'

import type { GalleryGrid as GalleryGridProps } from '@/payload-types'
import { BlockWrapper } from '@/components/BlockWrapper'

type Layout = 'grid' | 'masonry' | 'mosaic' | 'featured'

type Props = GalleryGridProps & {
  layout?: Layout
}

const gridColumns: Record<string, string> = {
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

const masonryColumns: Record<string, string> = {
  '2': 'columns-1 sm:columns-2',
  '3': 'columns-1 sm:columns-2 lg:columns-3',
  '4': 'columns-1 sm:columns-2 lg:columns-4',
}

const aspectRatios: Record<string, string> = {
  square: 'aspect-square',
  landscape: 'aspect-video',
  portrait: 'aspect-[3/4]',
}

const mosaicPositions = [
  'col-span-2 row-span-2',
  'col-span-2 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-2',
  'col-span-2 row-span-1',
  'col-span-2 row-span-1',
]

export const GalleryGrid: React.FC<Props> = (props) => {
  const {
    title,
    description,
    images,
    gallery,
    source = 'manual',
    layout = 'grid',
    columns = '3',
    aspectRatio = 'square',
    maxImages = '6',
    blockSettings,
  } = props

  const sourceImages =
    source === 'gallery' && gallery && typeof gallery === 'object' ? gallery.images : images

  const validImages =
    sourceImages?.filter(
      (image): image is Exclude<typeof image, number | null> =>
        typeof image === 'object' && image !== null && !!image.url,
    ) ?? []

  const displayedImages =
    maxImages === 'all' ? validImages : validImages.slice(0, Number(maxImages))

  const renderImage = (
    image: (typeof validImages)[number],
    className: string,
    sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  ) => (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <Image src={image.url!} alt={image.alt || ''} fill sizes={sizes} className="object-cover" />
    </div>
  )

  return (
    <BlockWrapper settings={blockSettings} id={props.blockName}>
      {title && <h2 className="mb-4 text-3xl font-bold">{title}</h2>}

      {description && <p className="mb-8 text-muted-foreground">{description}</p>}

      {/* GRID */}
      {layout === 'grid' && (
        <div className={`grid ${gridColumns[columns ?? '3']} gap-6`}>
          {displayedImages.map((image, index) => (
            <React.Fragment key={image.id}>
              {renderImage(image, aspectRatios[aspectRatio ?? 'square'])}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* MASONRY */}
      {layout === 'masonry' && (
        <div className={`${masonryColumns[columns ?? '3']} gap-6`}>
          {displayedImages.map((image, index) => (
            <div key={image.id} className="mb-6 break-inside-avoid">
              <Image
                src={image.url!}
                alt={image.alt || ''}
                width={image.width || 800}
                height={image.height || 600}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-auto w-full rounded-xl"
              />
            </div>
          ))}
        </div>
      )}

      {/* MOSAIC */}
      {layout === 'mosaic' && (
        <div className="grid auto-rows-[120px] grid-cols-2 gap-4 sm:auto-rows-[160px] sm:gap-6 lg:auto-rows-[200px] lg:grid-cols-4">
          {displayedImages.map((image, index) => (
            <React.Fragment key={image.id}>
              {renderImage(image, mosaicPositions[index % mosaicPositions.length])}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* FEATURED */}
      {layout === 'featured' && displayedImages.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:auto-rows-[180px]">
          {displayedImages.map((image, index) => (
            <React.Fragment key={image.id}>
              {renderImage(
                image,
                index === 0
                  ? 'aspect-[4/3] md:row-span-2 md:aspect-auto md:h-full'
                  : 'aspect-video md:aspect-auto md:h-full',
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </BlockWrapper>
  )
}
