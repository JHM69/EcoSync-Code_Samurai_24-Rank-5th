import React from 'react'
import { Link } from '../common/Links'

const ArtistItem = ({ id,slug, name, primaryImage, creatorType, bio }) => {
  return (
    <div className="my-2 flex cursor-pointer rounded-md border px-3 items-center py-4 shadow-sm hover:shadow lg:px-6">
      <p className="flex-1 hidden md:block truncate font-medium">{creatorType}</p>
      <img className="flex-shrink-0 w-8 h-8 rounded-md" src={primaryImage} />
      <p className="flex-1 truncate px-2 font-medium">{name}</p>
      <p className="flex-1 hidden md:block text-right lg:text-left truncate overflow-hidden" style={{display: "-webkit-box", WebkitLineClamp: "4", WebkitBoxOrient: "vertical"}}>{bio}</p>

      <div className="flex-1 text-right text-sm lg:text-left">
        <Link href={`/artist/${slug}`}>
          <span className="hidden text-sm lg:inline-block">View Details</span>
          <span className="inline-block text-sm lg:hidden">Details</span>
        </Link>
      </div>
    </div>
  )
}

export default ArtistItem
