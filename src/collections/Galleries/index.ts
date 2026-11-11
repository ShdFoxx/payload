import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'

import { generatePreviewPath } from '../../utilities/generatePreviewPath'

import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'
import { hero } from '@/heros/config'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

export const Galleries: CollectionConfig<'galleries'> = {
  slug: 'galleries',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a post is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'galleries',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'galleries',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          label: 'Photos',
          fields: [
            {
              name: 'images',
              label: 'Images de la galerie',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: {
                description:
                  'Importez des photos depuis votre ordinateur ou sélectionnez des médias déjà présents.',
              },
            },
            {
              name: 'series',
              label: 'Séries de photos',
              type: 'array',
              labels: {
                singular: 'Série',
                plural: 'Séries',
              },
              admin: {
                description:
                  'Organisez les images de la galerie en différentes séries. Une même image peut être utilisée dans plusieurs séries.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'title',
                  label: 'Titre de la série',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  label: 'Description',
                  type: 'textarea',
                },
                {
                  name: 'alignment',
                  label: 'Alignement du titre et de la description',
                  type: 'select',
                  defaultValue: 'left',
                  options: [
                    {
                      label: 'Gauche',
                      value: 'left',
                    },
                    {
                      label: 'Centré',
                      value: 'center',
                    },
                    {
                      label: 'Droite',
                      value: 'right',
                    },
                  ],
                },
                {
                  name: 'images',
                  label: 'Images de cette série',
                  type: 'relationship',
                  relationTo: 'media',
                  hasMany: true,
                  admin: {
                    components: {
                      Field: '@/components/SeriesImageSelector#SeriesImageSelector',
                    },
                  },
                  filterOptions: ({ data }) => {
                    const galleryImages = Array.isArray(data?.images) ? data.images : []

                    const imageIDs = galleryImages
                      .map((image: unknown) => {
                        if (typeof image === 'object' && image !== null && 'id' in image) {
                          return image.id
                        }

                        return image
                      })
                      .filter(
                        (id: unknown): id is string | number =>
                          typeof id === 'string' || typeof id === 'number',
                      )

                    return imageIDs.length
                      ? {
                          id: {
                            in: imageIDs,
                          },
                        }
                      : false
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
