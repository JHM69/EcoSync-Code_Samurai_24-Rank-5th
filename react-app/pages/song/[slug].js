import React, { useEffect } from 'react'
import Layout from '../../components/layout'
import SongLayout from '../../components/Song/SongLayout'
import DeleteSong from '../../components/Song/DeleteSong'
import UpdateSong from '../../components/Song/UpdateSong'
import axios from 'axios'

import { useRouter } from 'next/router'

import { getBaseUrl } from '../../utils/url'

function Song() {


  const [song, setSong] = React.useState({})
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null) 

  const router = useRouter();
 

  useEffect(() => {
    console.log(router.query.slug);
     axios.get(getBaseUrl() + `/songs/` + router.query.slug).then((res) => {
      console.log(res.data.song.song)
      setSong(res.data.song.song)
    }
    ).catch((err) => {
      console.log(err)
    })
  }, [router.query.slug])
    
  return (
    <Layout meta={{ name: song?.name || 'Song' }}>
      <div>
        <header className="my-3 flex flex-col items-center justify-between rounded-md md:flex-row">
          <h1 className="mb-3 truncate text-xl font-bold text-gray-700">
            Song Details
          </h1>
          <div className="flex items-center space-x-2">
            <UpdateSong song={song} />
            <DeleteSong 
              slug={song?.slug}
            />
          </div>
        </header>
        {song ? (
          <SongLayout song={song} />
        ) : (
          <div className="w-full text-center text-2xl font-bold text-gray-300">
            No details
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Song
 