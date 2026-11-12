import type { Field } from 'payload'

export const blockSettings: Field[] = [
  {
    name: 'blockSettings',
    type: 'group',
    label: 'Paramètres du bloc',
    admin: {
      description: 'Personnalisation de la présentation du bloc.',
    },
    fields: [
      {
        name: 'width',
        dbName: 'block_width',
        type: 'select',
        label: 'Largeur',
        defaultValue: 'standard',
        options: [
          { label: 'Standard', value: 'standard' },
          { label: 'Large', value: 'large' },
          { label: 'Pleine largeur', value: 'full' },
        ],
      },
      {
        name: 'spacingTop',
        dbName: 'block_spacing_top',
        type: 'select',
        label: 'Espacement supérieur',
        defaultValue: 'medium',
        options: [
          { label: 'Aucun', value: 'none' },
          { label: 'Petit', value: 'small' },
          { label: 'Moyen', value: 'medium' },
          { label: 'Grand', value: 'large' },
        ],
      },
      {
        name: 'spacingBottom',
        dbName: 'block_spacing_bottom',
        type: 'select',
        label: 'Espacement inférieur',
        defaultValue: 'medium',
        options: [
          { label: 'Aucun', value: 'none' },
          { label: 'Petit', value: 'small' },
          { label: 'Moyen', value: 'medium' },
          { label: 'Grand', value: 'large' },
        ],
      },
      {
        name: 'background',
        dbName: 'block_background',
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
      },
      {
        name: 'anchor',
        type: 'text',
        label: 'Ancre de section',
        required: true,
        unique: false,
        defaultValue: () => `section-${Math.random().toString(36).slice(2, 8)}`,
        admin: {
          description:
            'Identifiant utilisé pour créer un lien direct vers cette section. Vous pouvez le personnaliser.',
        },
      },
    ],
  },
]
