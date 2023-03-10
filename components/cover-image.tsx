import cn from 'classnames'
import Link from 'next/link'
import Image from 'next/image'

type Props = {
  title?: string
  src: string
  slug?: string
}

const CoverImage = ({ src, slug }: Props) => {
  const image = (
    <Image
      src={src}
      alt={`cover image`}
      className={cn('shadow-sm w-full', {
        'hover:shadow-lg transition-shadow duration-200': slug,
      })}
      width={1000}
      height={500}
    />
  )
  return (
    <div className="sm:mx-0">
      {(image)}
    </div>
  )
}

export default CoverImage
