import React from 'react'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { BlockWrapper } from '@/components/BlockWrapper'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { CMSLink } from '../../components/Link'

const columnClasses = {
  oneThird: 'col-span-4 md:col-span-2 lg:col-span-4',
  half: 'col-span-4 md:col-span-2 lg:col-span-6',
  twoThirds: 'col-span-4 md:col-span-2 lg:col-span-8',
  full: 'col-span-4 lg:col-span-12',
}

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns, blockSettings } = props

  return (
    <BlockWrapper settings={blockSettings} id={props.blockName}>
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <div className={cn(columnClasses[size ?? 'oneThird'])} key={index}>
                {richText && <RichText data={richText} enableGutter={false} />}

                {enableLink && <CMSLink {...link} />}
              </div>
            )
          })}
      </div>
    </BlockWrapper>
  )
}
