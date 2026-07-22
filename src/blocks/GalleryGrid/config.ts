import type { Block } from 'payload'

export const GalleryGrid: Block = {
  slug: 'galleryGrid',

  labels: {
    singular: 'Gallery Grid',
    plural: 'Gallery Grids',
  },

  imageURL: '/block-previews/gallery-grid.webp',

  fields: [
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
      name: 'images',
      label: 'Images',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      required: true,
    },

    {
      name: 'columns',
      label: 'Nombre de colonnes',
      type: 'select',
      defaultValue: '3',
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