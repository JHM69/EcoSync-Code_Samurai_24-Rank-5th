import React, { useEffect } from 'react'
import Layout from '../../components/layout'
import AlbumLayout from '../../components/Album/AlbumLayout'
import DeleteAlbum from '../../components/Album/DeleteAlbum'
import UpdateAlbum from '../../components/Album/UpdateAlbum'
import axios from 'axios' 
import { useRouter } from 'next/router'
import { getBaseUrl } from '../../utils/url'

 

function Album() {


  const [album, setAlbum] = React.useState({})
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null) 

  const router = useRouter();
 

  useEffect(() => {
    console.log(router.query.slug);
     axios.get(getBaseUrl() + `/albums/` + router.query.slug).then((res) => {
      console.log(res.data.album.album)
      setAlbum(res.data.album.album)
    }
    ).catch((err) => {
      console.log(err)
    })
  }, [router.query.slug])
    
  return (
    <Layout meta={{ name: album?.name || 'Album' }}>
      <div>
        <header className="my-3 flex flex-col items-center justify-between rounded-md md:flex-row">
          <h1 className="mb-3 truncate text-xl font-bold text-gray-700">
            Album Details
          </h1>
          <div className="flex items-center space-x-2">
            <UpdateAlbum album={album} />
            <DeleteAlbum 
              slug={album?.slug}
            />
          </div>
        </header>
        {album ? (
          <AlbumLayout album={album} />
        ) : (
          <div className="w-full text-center text-2xl font-bold text-gray-300">
            No details
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Album
 