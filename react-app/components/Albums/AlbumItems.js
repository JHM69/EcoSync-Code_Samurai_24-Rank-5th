import React from 'react'
import AlbumItem from './AlbumItem'

const AlbumItems = ({ albums }) => {
  return (
    <div className="block max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
      {albums?.length ? (
        albums?.map((i) => <AlbumItem key={i.id} {...i} />)
      ) : (
        <div className="h-[100px] w-full text-center font-bold text-gray-300">
          Add some albums to see the data.
        </div>
      )}
    </div>
  )
}

export default AlbumItems
