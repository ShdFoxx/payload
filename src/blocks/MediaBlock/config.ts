import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  imageURL: '/Media.png',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'mediaSettings',
      type: 'group',
      label: 'Présentation du média',
      fields: [
        {
          name: 'border',
          type: 'checkbox',
          label: 'Afficher une bordure',
          defaultValue: true,
        },
        {
          name: 'background',
          type: 'select',
          label: 'Arrière-plan',
          defaultValue: 'default',
          options: [
            { label: 'Défaut', value: 'default' },
            { label: 'Discret', value: 'muted' },
            { label: 'Carte', value: 'card' },
            { label: 'Principal', value: 'primary' },
            { label: 'Accent', value: 'accent' },
          ],
          dbName: 'media_background',
        },
      ],
    },
  ],
}
