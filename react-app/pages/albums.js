import Layout from '../components/layout'
import AlbumItems from '../components/Albums/AlbumItems'
import { useEffect, useState } from 'react'
import AlbumItemsSkeleton from '../components/Albums/AlbumItemsSkeleton' 
import AddAlbum from '../components/Album/AddAlbum'  
import axios from 'axios'
import { getBaseUrl } from '../utils/url'
 
function Albums() {
  const [loading, setLoading] = useState(false)
  const [albums, setAlbums] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
         axios.get(getBaseUrl()+`/albums`).then((res) => {
            console.log(res.data.albums)
            setAlbums(res.data.albums)
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
        <h1 className="text-2xl font-bold text-gray-700">Albums</h1>
        <div className="flex items-center space-x-2">
          <AddAlbum />
        </div>
      </header>
      <div>
      
    </div>
      {loading ? (
        <AlbumItemsSkeleton />
      ) : (
        <AlbumItems albums={albums} />
      )}
    </div>
  )
}

export default Albums

Albums.getLayout = function getLayout(page) {
  return <Layout meta={{ name: 'Albums' }}>{page}</Layout>
}
