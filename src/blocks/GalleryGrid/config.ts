import type { Block } from 'payload'
import { blockSettings } from '@/fields/blockSettings'

export const GalleryGrid: Block = {
  slug: 'galleryGrid',
  interfaceName: 'GalleryGrid',

  labels: {
    singular: 'Gallery Grid',
    plural: 'Gallery Grids',
  },

  imageURL: '/block-previews/gallery-grid.webp',

  fields: [
    ...blockSettings,
    {
      name: 'source',
      label: 'Source des images',
      type: 'select',
      defaultValue: 'manual',
      required: true,
      options: [
        { label: 'Sélection manuelle', value: 'manual' },
        { label: 'Galerie existante', value: 'gallery' },
      ],
    },
    {
      name: 'layout',
      label: 'Présentation',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grille', value: 'grid' },
        { label: 'Masonry', value: 'masonry' },
        { label: 'Mosaïque', value: 'mosaic' },
        { label: 'Image principale', value: 'featured' },
      ],
      required: true,
    },
    {
      name: 'title',
      label: 'Titre',
      type: 'text',
    },

    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
    },
    {
      name: 'maxImages',
      label: "Nombre maximum d'images affichées",
      type: 'select',
      defaultValue: '6',
      required: true,
      options: [
        { label: '3 images', value: '3' },
        { label: '4 images', value: '4' },
        { label: '6 images', value: '6' },
        { label: '8 images', value: '8' },
        { label: '12 images', value: '12' },
        { label: 'Toutes les images', value: 'all' },
      ],
    },
    {
      name: 'images',
      label: 'Images',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'manual',
      },
    },
    {
      name: 'gallery',
      label: 'Galerie',
      type: 'relationship',
      relationTo: 'galleries',
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'gallery',
      },
    },

    {
      name: 'columns',
      label: 'Nombre de colonnes',
      type: 'select',
      defaultValue: '3',
      admin: {
        condition: (_, siblingData) => ['grid', 'masonry'].includes(siblingData?.layout),
      },
      options: [
        {
          label: '2 colonnes',
          value: '2',
        },
        {
          label: '3 colonnes',
          value: '3',
        },
        {
          label: '4 colonnes',
          value: '4',
        },
      ],
    },

    {
      name: 'aspectRatio',
      label: 'Format des images',
      type: 'select',
      defaultValue: 'square',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'grid',
      },
      options: [
        {
          label: 'Carré',
          value: 'square',
        },
        {
          label: 'Paysage',
          value: 'landscape',
        },
        {
          label: 'Portrait',
          value: 'portrait',
        },
      ],
    },
  ],
}
