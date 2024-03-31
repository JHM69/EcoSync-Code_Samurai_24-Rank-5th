/* eslint-disable multiline-ternary */
/* eslint-disable react/jsx-key */
/* eslint-disable react/react-in-jsx-scope */
import Layout from '../components/layout'
import { useEffect, useState } from 'react'
import UserItemsSkeleton from '../components/Users/UserItemsSkeleton'
import axios from 'axios'
import { getBaseUrl } from '../utils/url'
import AddLandfill from '../components/Landfill/AddLandfill'
import LandfillItems from '../components/Landfills/LandfillItems'
function Landfills() {
  const [loading, setLoading] = useState(true)
  const [landfills, setLandfill] = useState([])
  useEffect(() => {
    setLoading(true)
    const token = localStorage.getItem('token')
    if (token.length > 0) {
      axios
        .get(getBaseUrl() + '/landfills', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if(res.data.length > 0) {
            res.data.sort((a, b) => a?.id - b?.id)
          }
          console.log(res.data)
          setLandfill(res.data)
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
          console.log(err)
        })
    }
  }, [])

  return (
    <div>
      <div className="flex flex-row gap-3 md:px-6">
        <div className="flex w-full flex-col">
          <div className="mt-3 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-700">Landfill</h1>
            <div className="flex items-center space-x-2">
              <AddLandfill />
            </div>
          </div>
          {loading ? (
            <UserItemsSkeleton />
          ) : (
            <LandfillItems landfills={landfills} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Landfills

Landfills.getLayout = function getLayout(page) {
  return <Layout meta={{ name: 'Landfill' }}>{page}</Layout>
}
