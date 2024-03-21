import React, { useEffect } from 'react'
import Layout from '../../components/layout'
import ArtistLayout from '../../components/Artist/ArtistLayout'
import DeleteArtist from '../../components/Artist/DeleteArtist'
import UpdateArtist from '../../components/Artist/UpdateArtist'
import axios from 'axios'

import { useRouter } from 'next/router'

import { getBaseUrl } from '../../utils/url'

function Artist() {


  const [artist, setArtist] = React.useState({})
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null) 

  const router = useRouter();
 

  useEffect(() => {
    console.log(router.query.slug);
    const response = axios.get(getBaseUrl() + `/artists/` + router.query.slug).then((res) => {
      console.log(res.data.artist.artist)
      setArtist(res.data.artist.artist)
    }
    ).catch((err) => {
      console.log(err)
    })
  }, [router.query.slug])
    
  return (
    <Layout meta={{ name: artist?.name || 'Artist' }}>
      <div>
        <header className="my-3 flex flex-col items-center justify-between rounded-md md:flex-row">
          <h1 className="mb-3 truncate text-xl font-bold text-gray-700">
            Artist Details
          </h1>
          <div className="flex items-center space-x-2">
            <UpdateArtist artist={artist} />
            <DeleteArtist 
              slug={artist?.slug}
            />
          </div>
        </header>
        {artist ? (
          <ArtistLayout artist={artist} />
        ) : (
          <div className="w-full text-center text-2xl font-bold text-gray-300">
            No details
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Artist
 