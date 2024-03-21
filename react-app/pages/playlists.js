import Layout from '../components/layout'
import PlaylistItems from '../components/Playlists/PlaylistItems'
import { useEffect, useState } from 'react'
import PlaylistItemsSkeleton from '../components/Playlists/PlaylistItemsSkeleton' 
import AddPlaylist from '../components/Playlist/AddPlaylist'
import { getBaseUrl } from '../utils/url'

function Playlists() {
  const [loading, setLoading] = useState(false)
  const [playlists, setPlaylists] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch(getBaseUrl()+`/playlists`)
        const { data } = await res.json()
        setPlaylists(data)
      } catch (error) {
        console.log(error)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <div>
      <header className="mt-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-700">Playlists</h1>
        <div className="flex items-center space-x-2">
          <AddPlaylist />
        </div>
      </header>
      <div>
      <div className="cursor-loading mt-6 mb-3 flex rounded-md border px-5 py-3 shadow-sm lg:px-8">
      <div className="flex-1 font-semibold text-sky-600">Name</div>
      <div className="flex-1 text-right font-semibold text-sky-600 lg:text-left">
        Playlist
      </div>
      <div className="flex-1 text-right font-semibold text-sky-600 lg:text-left">
        Album
      </div>
      <div className="flex-1"></div>
    </div>
    </div>
      {loading ? (
        <PlaylistItemsSkeleton />
      ) : (
        <PlaylistItems playlists={playlists} />
      )}
    </div>
  )
}

export default Playlists

Playlists.getLayout = function getLayout(page) {
  return <Layout meta={{ name: 'Playlists' }}>{page}</Layout>
}
