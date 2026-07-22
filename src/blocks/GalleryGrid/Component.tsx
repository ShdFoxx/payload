import Image from 'next/image'

type GalleryGridProps = {
  title?: string
  description?: string
  images: any[]
  columns?: string
  aspectRatio?: string
}
export  const GalleryGrid: React.FC<GalleryGridProps> = (props) => {
    const {
      title,
      description,
      images,
      columns = '3',
      aspectRatio = 'square',
    } = props


// export default function GalleryGrid({
//   title,
//   description,
//   images,
//   columns = '3',
//   aspectRatio = 'square',
// }: GalleryGridProps) {

  const gridColumns = {
    '2': 'grid-cols-2',
    '3': 'grid-cols-3',
    '4': 'grid-cols-4',
  }[columns]


  const ratio = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]',
  }[aspectRatio]


  return (
    <section className="container py-12">

      {title && (
        <h2 className="text-3xl font-bold mb-4">
          {title}
        </h2>
      )}

      {description && (
        <p className="mb-8 text-muted-foreground">
          {description}
        </p>
      )}


      <div
        className={`
          grid
          ${gridColumns}
          gap-6
        `}
      >

        {images?.map((image) => (

          <div
            key={image.id}
            className={`
              relative
              overflow-hidden
              rounded-xl
              ${ratio}
            `}
          >

            <Image
              src={image.url}
              alt={image.alt || ''}
              fill
              className="object-cover"
            />

          </div>

        ))}

      </div>

    </section>
  )
}