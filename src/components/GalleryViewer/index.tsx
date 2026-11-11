'use client'

import React from 'react'

import type { Gallery, Media } from '@/payload-types'
import { ImageMedia } from '@/components/Media/ImageMedia'

type GalleryViewerProps = Pick<Gallery, 'series'>

const isMedia = (image: number | Media): image is Media => {
  return typeof image === 'object' && image !== null
}

export const GalleryViewer: React.FC<GalleryViewerProps> = ({ series }) => {
  const gallerySeries = series ?? []

  if (gallerySeries.length === 0) {
    return null
  }

  return (
    <div className="container py-12">
      {gallerySeries.map((item, index) => {
        const images = (item.images ?? []).filter(isMedia)

        const alignmentClass = {
          left: 'text-left',
          center: 'text-center',
          right: 'text-right',
        }[item.alignment ?? 'left']

        return (
          <section key={item.id ?? index} className="mb-16 last:mb-0">
            <header
              className={`mb-8 ${
                item.alignment === 'center'
                  ? 'text-center'
                  : item.alignment === 'right'
                    ? 'text-right'
                    : 'text-left'
              }`}
            >
              <h2 className="mb-3 text-3xl font-semibold">{item.title}</h2>

              {item.description && (
                <p
                  className={`max-w-3xl text-muted-foreground ${
                    item.alignment === 'center'
                      ? 'mx-auto'
                      : item.alignment === 'right'
                        ? 'ml-auto'
                        : ''
                  }`}
                >
                  {item.description}
                </p>
              )}
            </header>

            {images.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((image) => (
                  <div key={image.id} className="relative aspect-square overflow-hidden rounded-lg">
                    <ImageMedia
                      resource={image}
                      fill
                      imgClassName="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucune photo dans cette série.</p>
            )}
          </section>
        )
      })}
    </div>
  )
}
