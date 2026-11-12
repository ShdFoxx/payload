import type { StaticImageData } from 'next/image'
import React from 'react'
import { BlockWrapper } from '@/components/BlockWrapper'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'

import { Media } from '../../components/Media'

type Props = MediaBlockProps & {
  captionClassName?: string
  className?: string
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
  blockName?: string
  enableGutter?: boolean
}

const backgroundClasses = {
  default: 'bg-transparent',
  muted: 'bg-muted',
  card: 'bg-card',
  primary: 'bg-primary',
  accent: 'bg-accent',
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
    blockName,
    mediaSettings,
    enableGutter = true,
    blockSettings,
  } = props

  const caption = media && typeof media === 'object' ? media.caption : null

  const background = mediaSettings?.background ?? 'default'
  const border = mediaSettings?.border ?? true

  return (
    <BlockWrapper
      settings={blockSettings}
      id={blockName}
      className={cn(
        'w-full overflow-hidden rounded-2xl',
        {
          container: enableGutter,
        },
        backgroundClasses[background] || backgroundClasses.default,
        className,
      )}
    >
      <div className="w-full p-6 md:p-8">
        {(media || staticImage) && (
          <Media
            imgClassName={cn(
              'block h-auto w-full rounded-[0.8rem] object-contain',
              border && 'border border-border',
              imgClassName,
            )}
            resource={media}
            src={staticImage}
          />
        )}

        {caption && (
          <div
            className={cn(
              'mt-6',
              {
                container: !disableInnerContainer,
              },
              captionClassName,
            )}
          >
            <RichText data={caption} enableGutter={false} />
          </div>
        )}
      </div>
    </BlockWrapper>
  )
}
