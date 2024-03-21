import React from 'react'
import { Link } from '../common/Links'

const AlbumItem = ({contentType,  slug, mainArtist, name, label }) => {
  return (
    <div className="my-2 flex cursor-pointer rounded-md border items-center px-3 py-4 shadow-sm hover:shadow lg:px-6">
      <p className="flex-1 text-left lg:text-left">{contentType}</p>
      <p className="flex-1 truncate font-medium">{name}</p> 

      <img className="flex-shrink-0 w-8 h-8 rounded-md" src={mainArtist?.primaryImage} />
      <p className="flex-1 truncate px-2 font-medium">{mainArtist?.name}</p>
 
      <div className="flex-1 text-right text-sm lg:text-left">
        <Link href={`/album/${slug}`}>
          <span className="hidden text-sm lg:inline-block">View Details</span>
          <span className="inline-block text-sm lg:hidden">Details</span>
        </Link>
      </div>
    </div>
  )
}

export default AlbumItem
