import React from 'react'
import ArtistItem from './ArtistItem'

const ArtistItems = ({ artists }) => {
  return (
    <div className="block max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
      {artists?.length ? (
        artists?.map((i) => <ArtistItem key={i.id} {...i} />)
      ) : (
        <div className="h-[100px] w-full text-center font-bold text-gray-300">
          Add some artists to see the data.
        </div>
      )}
    </div>
  )
}

export default ArtistItems
