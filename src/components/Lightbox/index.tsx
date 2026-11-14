'use client'

import React, { useEffect } from 'react'

import type { Media } from '@/payload-types'
import { ImageMedia } from '@/components/Media/ImageMedia'

type LightboxProps = {
  images: Media[]
  activeImageIndex: number | null
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  activeImageIndex,
  onClose,
  onPrevious,
  onNext,
}) => {
  const activeImage = activeImageIndex !== null ? images[activeImageIndex] : null

  useEffect(() => {
    if (activeImageIndex === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onPrevious()
      if (event.key === 'ArrowRight') onNext()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeImageIndex, onClose, onPrevious, onNext])

  if (!activeImage) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Visionneuse de photos"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 z-10 text-3xl text-white hover:text-gray-300"
        aria-label="Fermer"
      >
        ×
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onPrevious()
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
          onNext()
        }}
        className="absolute right-4 z-10 rounded-full bg-black/50 px-4 py-3 text-2xl text-white hover:bg-black/80"
        aria-label="Photo suivante"
      >
        ›
      </button>

      <div className="absolute bottom-5 text-sm text-white">
        {activeImageIndex! + 1} / {images.length}
      </div>
    </div>
  )
}
