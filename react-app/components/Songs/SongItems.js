import React from 'react'
import SongItem from './SongItem'

const SongItems = ({ songs }) => {
  return (
    <div className="block max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
      {songs?.length ? (
        songs?.map((i) => <SongItem key={i.id} {...i} />)
      ) : (
        <div className="h-[100px] w-full text-center font-bold text-gray-300">
          Add some songs to see the data.
        </div>
      )}
    </div>
  )
}

export default SongItems
