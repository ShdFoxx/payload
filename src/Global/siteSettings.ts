import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',

  admin: {
    group: 'Configuration',
  },

  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    {
      name: 'primaryColor',
      label: 'Couleur principale',
      type: 'text',
      defaultValue: '#000000',
    },

    {
      name: 'secondaryColor',
      label: 'Couleur secondaire',
      type: 'text',
      defaultValue: '#ffffff',
    },

    {
      name: 'textColor',
      label: 'Couleur du texte',
      type: 'text',
      defaultValue: '#222222',
    },

    {
      name: 'backgroundColor',
      label: 'Couleur de fond',
      type: 'text',
      defaultValue: '#ffffff',
    },
  ],
}