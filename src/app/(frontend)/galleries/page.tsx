import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const galleries = await payload.find({
    collection: 'galleries',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Galleries</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="galleries"
          currentPage={galleries.page}
          limit={12}
          totalDocs={galleries.totalDocs}
        />
      </div>

      <CollectionArchive relationTo={'galleries'} posts={galleries.docs} />

      <div className="container">
        {galleries.totalPages > 1 && galleries.page && (
          <Pagination collection='galleries' page={galleries.page} totalPages={galleries.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Posts`,
  }
}
