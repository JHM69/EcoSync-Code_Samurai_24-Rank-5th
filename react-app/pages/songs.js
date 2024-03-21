import Layout from '../components/layout'
import SongItems from '../components/Songs/SongItems'
import { useEffect, useState } from 'react'
import SongItemsSkeleton from '../components/Songs/SongItemsSkeleton' 
import AddSong from '../components/Song/AddSong' 
import axios from 'axios'
import { getBaseUrl } from '../utils/url'
function Songs() {
  const [loading, setLoading] = useState(false)
  const [songs, setSongs] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
         axios.get(getBaseUrl()+`/songs`).then((res) => {
            console.log(res.data.songs)
            setSongs(res.data.songs)
            }
            ).catch((err) => {
              console.log(err)
            })
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <div>
      <header className="mt-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-700">Songs</h1>
        <div className="flex items-center space-x-2">
          <AddSong />
        </div>
      </header>
      <div>
      
    </div>
      {loading ? (
        <SongItemsSkeleton />
      ) : (
        <SongItems songs={songs} />
      )}
    </div>
  )
}

export default Songs

Songs.getLayout = function getLayout(page) {
  return <Layout meta={{ name: 'Songs' }}>{page}</Layout>
}
