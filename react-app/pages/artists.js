import Layout from '../components/layout'
import ArtistItems from '../components/Artists/ArtistItems'
import { useEffect, useState } from 'react'
import ArtistItemsSkeleton from '../components/Artists/ArtistItemsSkeleton' 
import AddArtist from '../components/Artist/AddArtist' 
import axios from 'axios'
import { getBaseUrl } from '../utils/url'
function Artists() {
  const [loading, setLoading] = useState(false)
  const [artists, setArtists] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
         axios.get(getBaseUrl()+`/artists`).then((res) => {
            console.log(res.data.artists)
            setArtists(res.data.artists)
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
        <h1 className="text-2xl font-bold text-gray-700">Artists</h1>
        <div className="flex items-center space-x-2">
          <AddArtist />
        </div>
      </header>
      <div>
      
    </div>
      {loading ? (
        <ArtistItemsSkeleton />
      ) : (
        <ArtistItems artists={artists} />
      )}
    </div>
  )
}

export default Artists

Artists.getLayout = function getLayout(page) {
  return <Layout meta={{ name: 'Artists' }}>{page}</Layout>
}
