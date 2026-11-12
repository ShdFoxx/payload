'use client'

import React, { useEffect, useState } from 'react'

import type { Gallery, Media } from '@/payload-types'
import { ImageMedia } from '@/components/Media/ImageMedia'

type GalleryViewerProps = Pick<Gallery, 'series'>

const isMedia = (image: number | Media): image is Media => {
  return typeof image === 'object' && image !== null
}

export const GalleryViewer: React.FC<GalleryViewerProps> = ({ series }) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)

  const gallerySeries = series ?? []

  const seriesData = gallerySeries.map((item) => ({
    item,
    images: (item.images ?? []).filter(isMedia),
  }))

  const galleryImages = seriesData.flatMap((item) => item.images)

  const closeViewer = () => setActiveImageIndex(null)

  const showPrevious = () => {
    setActiveImageIndex((current) =>
      current === null ? null : (current - 1 + galleryImages.length) % galleryImages.length,
    )
  }

  const showNext = () => {
    setActiveImageIndex((current) =>
      current === null ? null : (current + 1) % galleryImages.length,
    )
  }

  useEffect(() => {
    if (activeImageIndex === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeViewer()
      if (event.key === 'ArrowLeft') showPrevious()
      if (event.key === 'ArrowRight') showNext()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeImageIndex, galleryImages.length])

  if (gallerySeries.length === 0) {
    return null
  }

  const activeImage = activeImageIndex !== null ? galleryImages[activeImageIndex] : null

  return (
    <>
      <div className="container py-12">
        {seriesData.map(({ item, images }, index) => {
          const seriesOffset = seriesData
            .slice(0, index)
            .reduce((total, entry) => total + entry.images.length, 0)

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
                  {images.map((image, photoIndex) => (
                    <button
                      key={`${image.id}-${photoIndex}`}
                      type="button"
                      onClick={() => setActiveImageIndex(seriesOffset + photoIndex)}
                      className="relative aspect-square overflow-hidden rounded-lg cursor-zoom-in"
                      aria-label={`Agrandir la photo ${photoIndex + 1}`}
                    >
                      <ImageMedia
                        resource={image}
                        fill
                        imgClassName="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucune photo dans cette série.</p>
              )}
            </section>
          )
        })}
      </div>

      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={closeViewer}
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse de photos"
        >
          <button
            type="button"
            onClick={closeViewer}
            className="absolute right-5 top-5 z-10 text-3xl text-white hover:text-gray-300"
            aria-label="Fermer"
          >
            ×
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              showPrevious()
            }}
            className="absolute left-4 z-10 rounded-full bg-black/50 px-4 py-3 text-2xl text-white hover:bg-black/80"
            aria-label="Photo précédente"
          >
            ‹
          </button>

          <div
            className="relative h-[80vh] w-[90vw] max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <ImageMedia resource={activeImage} fill imgClassName="object-contain" />
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              showNext()
            }}
            className="absolute right-4 z-10 rounded-full bg-black/50 px-4 py-3 text-2xl text-white hover:bg-black/80"
            aria-label="Photo suivante"
          >
            ›
          </button>

          <div className="absolute bottom-5 text-sm text-white">
            {activeImageIndex! + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </>
  )
}
