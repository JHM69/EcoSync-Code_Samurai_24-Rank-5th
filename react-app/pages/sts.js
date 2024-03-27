import Layout from '../components/layout'
import StsItems from '../components/Stss/StsItems'
import { useEffect, useState } from 'react'
import StsItemsSkeleton from '../components/Stss/StsItemsSkeleton'
import AddSts from '../components/Sts/AddSts' 
import axios from 'axios'
import { getBaseUrl } from '../utils/url'
function Artists() {
  const [loading, setLoading] = useState(false)
  const [artists, setArtists] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
         axios.get(getBaseUrl()+`/sts`).then((res) => {
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
        <h1 className="text-2xl font-bold text-gray-700">STS</h1>
        <div className="flex items-center space-x-2">
          <AddSts />
        </div>
      </header>
      <div>
      
    </div>
      {loading ? (
        <StsItemsSkeleton />
      ) : (
        <StsItems artists={artists} />
      )}
    </div>
  )
}

export default Artists

Artists.getLayout = function getLayout(page) {
  return <Layout meta={{ name: 'STS' }}>{page}</Layout>
}
