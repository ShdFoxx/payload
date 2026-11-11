'use client'

import React from 'react'
import { useAllFormFields, useField, useForm } from '@payloadcms/ui'

type Props = {
  path: string
}

type GalleryImage = {
  id: string | number
  alt?: string | null
  url?: string | null
  thumbnailURL?: string | null
  filename?: string | null
  sizes?: {
    thumbnail?: {
      url?: string | null
    }
  }
}

export const SeriesImageSelector = ({ path }: Props) => {
  const [formFields] = useAllFormFields()
  const { getDataByPath } = useForm()

  const { value, setValue } = useField<(string | number)[]>({
    path,
  })

  const galleryImageIDs = React.useMemo(() => {
    const images = getDataByPath('images')

    return Array.isArray(images) ? images : []
  }, [formFields, getDataByPath])

  const [galleryImages, setGalleryImages] = React.useState<GalleryImage[]>([])

  React.useEffect(() => {
    let cancelled = false

    const fetchImages = async () => {
      const images = await Promise.all(
        galleryImageIDs.map(async (image) => {
          const id = typeof image === 'object' && image !== null && 'id' in image ? image.id : image

          if (typeof id !== 'string' && typeof id !== 'number') {
            return null
          }

          if (typeof image === 'object' && image !== null && 'url' in image) {
            return image as GalleryImage
          }

          try {
            const response = await fetch(`/api/media/${id}`)

            if (!response.ok) {
              return null
            }

            return (await response.json()) as GalleryImage
          } catch {
            return null
          }
        }),
      )

      if (!cancelled) {
        setGalleryImages(images.filter((image): image is GalleryImage => image !== null))
      }
    }

    fetchImages()

    return () => {
      cancelled = true
    }
  }, [galleryImageIDs])

  const selectedIDs = Array.isArray(value) ? value.map(String) : []

  const toggleImage = (id: string | number) => {
    const imageID = String(id)

    const nextIDs = selectedIDs.includes(imageID)
      ? selectedIDs.filter((selectedID) => selectedID !== imageID)
      : [...selectedIDs, imageID]

    setValue(nextIDs)
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '12px',
        }}
      >
        {galleryImages.map((image) => {
          const selectionOrder = selectedIDs.indexOf(String(image.id)) + 1
          const selected = selectionOrder > 0
          const imageURL = image.sizes?.thumbnail?.url ?? image.thumbnailURL ?? image.url

          return (
            <button
              key={image.id}
              type="button"
              onClick={() => toggleImage(image.id)}
              aria-pressed={selected}
              style={{
                padding: '6px',
                border: selected
                  ? '3px solid var(--theme-success-500)'
                  : '1px solid var(--theme-elevation-300)',
                borderRadius: '8px',
                background: 'var(--theme-elevation-50)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {selected && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '26px',
                    height: '26px',
                    marginTop: '6px',
                    borderRadius: '50%',
                    background: 'var(--theme-success-500)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '13px',
                  }}
                >
                  {selectionOrder}
                </span>
              )}
              {imageURL ? (
                <img
                  src={imageURL}
                  alt={image.alt ?? ''}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
              ) : (
                <div
                  style={{
                    height: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--theme-elevation-100)',
                  }}
                >
                  Aperçu indisponible
                </div>
              )}

              <div style={{ marginTop: '6px', fontSize: '12px' }}>
                {selected ? `Sélectionnée n° ${selectionOrder}` : 'Sélectionner'}
              </div>
            </button>
          )
        })}
      </div>

      {galleryImages.length === 0 && (
        <p>Aucune image disponible. Ajoutez d&apos;abord des images à la galerie.</p>
      )}
    </div>
  )
}
