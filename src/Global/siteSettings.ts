//srs/Global/siteSettings.ts

import type { GlobalConfig } from 'payload'

import { defaultDarkTheme, defaultLightTheme, defaultThemeSettings } from '@/theme/defaults'

const colorLabels: Record<string, string> = {
  background: 'Fond du site',
  foreground: 'Texte principal',
  card: 'Fond des cartes',
  cardForeground: 'Texte des cartes',
  primary: 'Couleur principale',
  primaryForeground: 'Texte sur couleur principale',
  secondary: 'Couleur secondaire',
  secondaryForeground: 'Texte sur couleur secondaire',
  muted: 'Fond discret',
  mutedForeground: 'Texte secondaire',
  accent: 'Couleur d’accentuation',
  accentForeground: 'Texte sur accentuation',
  border: 'Bordures',
}

const createColorFields = (defaults: typeof defaultLightTheme) =>
  Object.entries(defaults).map(([name, defaultValue]) => ({
    name,
    label: colorLabels[name] || name,
    type: 'text' as const,
    defaultValue,
    admin: {
      components: {
        Field: '@/components/ColorField#ColorField',
      },
    },
  }))

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
      type: 'tabs',
      tabs: [
        {
          label: 'Mode de thème',
          fields: [
            {
              name: 'allowThemeSwitch',
              label: 'Autoriser les visiteurs à changer de thème',
              type: 'checkbox',
              defaultValue: defaultThemeSettings.allowThemeSwitch,
            },
            {
              name: 'defaultTheme',
              label: 'Thème imposé aux visiteurs',
              type: 'select',
              defaultValue: defaultThemeSettings.defaultTheme,
              options: [
                {
                  label: 'Clair',
                  value: 'light',
                },
                {
                  label: 'Sombre',
                  value: 'dark',
                },
              ],
              admin: {
                condition: (_, siblingData) => !siblingData?.allowThemeSwitch,
              },
            },
          ],
        },
        {
          label: 'Thème clair',
          fields: [
            {
              type: 'ui',
              name: 'lightPaletteSelector',
              admin: {
                components: {
                  Field: '@/components/PaletteSelector#PaletteSelector',
                },
                custom: {
                  theme: 'light',
                },
              },
            },
            {
              name: 'lightTheme',
              type: 'group',
              fields: createColorFields(defaultLightTheme),
            },
            {
              name: 'lightThemePalette',
              type: 'select',
              defaultValue: 'neutral',
              options: [
                { label: 'Neutre', value: 'neutral' },
                { label: 'Océan', value: 'ocean' },
                { label: 'Forêt', value: 'forest' },
                { label: 'Chaleureux', value: 'warm' },
                { label: 'Élégant', value: 'elegant' },
              ],
              admin: {
                hidden: true,
              },
            },
            {
              name: 'lightPersonalPalettes',
              label: 'Palettes personnelles',
              type: 'array',
              fields: [
                {
                  name: 'key',
                  type: 'text',
                  admin: {
                    hidden: true,
                  },
                },
                {
                  name: 'name',
                  label: 'Nom de la palette',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'colors',
                  label: 'Couleurs',
                  type: 'group',
                  fields: createColorFields(defaultLightTheme),
                },
              ],
              admin: {
                hidden: true,
                description: 'Palettes personnalisées enregistrées pour le thème clair.',
              },
            },
            {
              name: 'lightActivePersonalPalette',
              type: 'text',
              admin: {
                hidden: true,
              },
            },
          ],
        },
        {
          label: 'Thème sombre',
          fields: [
            {
              type: 'ui',
              name: 'darkPaletteSelector',
              admin: {
                components: {
                  Field: '@/components/PaletteSelector#PaletteSelector',
                },
                custom: {
                  theme: 'dark',
                },
              },
            },
            {
              name: 'darkTheme',
              type: 'group',
              fields: createColorFields(defaultDarkTheme),
            },
            {
              name: 'darkThemePalette',
              type: 'select',
              defaultValue: 'neutral',
              options: [
                { label: 'Neutre', value: 'neutral' },
                { label: 'Océan', value: 'ocean' },
                { label: 'Forêt', value: 'forest' },
                { label: 'Chaleureux', value: 'warm' },
                { label: 'Élégant', value: 'elegant' },
              ],
              admin: {
                hidden: true,
              },
            },
            {
              name: 'darkPersonalPalettes',
              label: 'Palettes personnelles',
              type: 'array',
              fields: [
                {
                  name: 'key',
                  type: 'text',
                  admin: {
                    hidden: true,
                  },
                },
                {
                  name: 'name',
                  label: 'Nom de la palette',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'colors',
                  label: 'Couleurs',
                  type: 'group',
                  fields: createColorFields(defaultDarkTheme),
                },
              ],
              admin: {
                hidden: true,
                description: 'Palettes personnalisées enregistrées pour le thème sombre.',
              },
            },
            {
              name: 'darkActivePersonalPalette',
              type: 'text',
              admin: {
                hidden: true,
              },
            },
          ],
        },
      ],
    },
  ],
}
