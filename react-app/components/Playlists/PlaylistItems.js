import React from 'react'
import PlaylistItem from './PlaylistItem'

const PlaylistItems = ({ playlists }) => {
  return (
    <div className="block max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
      {playlists?.length ? (
        playlists?.map((i) => <PlaylistItem key={i.id} {...i} />)
      ) : (
        <div className="h-[100px] w-full text-center font-bold text-gray-300">
          Add some playlists to see the data.
        </div>
      )}
    </div>
  )
}

export default PlaylistItems
