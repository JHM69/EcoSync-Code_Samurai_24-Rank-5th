/* eslint-disable multiline-ternary */
/* eslint-disable react/jsx-key */
/* eslint-disable react/react-in-jsx-scope */
import Layout from '../components/layout'
import { useEffect, useState } from 'react'
import UserItemsSkeleton from '../components/Users/UserItemsSkeleton'
import axios from 'axios'
import { getBaseUrl } from '../utils/url' 
import { useRouter } from 'next/router'
import AddStsEntry from '../../components/StsEntry/AddStsEntry'
import StsEntryItems from '../../components/StsEntrys/StsEntryItems'

function VehicleEntry () {
  const [loading, setLoading] = useState(true)
  const [vehicleEntries, setVehicleEntries] = useState([])

  const [stsId, setStsId] = useState(null)

  const router = useRouter()
  useEffect(() => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const id = router.query.stsId
    setStsId(id)
    if (token.length > 0) {
      axios
        .get(getBaseUrl() + `/sts/${stsId}/entry`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          console.log(res.data)
          setVehicleEntries(res.data)
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
      <div className="flex md:px-6 flex-row gap-3">
        <div className="flex w-full flex-col">
          <div className="mt-3 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-700">Vehicle Entries </h1>
            <div className="flex items-center space-x-2">
              {
                stsId && <AddStsEntry stsId={stsId} />
              }
            </div>
          </div>
          {loading ? <UserItemsSkeleton /> : <StsEntryItems vehicleEntries={vehicleEntries} />}
        </div>
      </div>
    </div>
  )
}

export default VehicleEntry

VehicleEntry.getLayout = function getLayout (page) {
  return <Layout meta={{ name: 'Vehicle Entries' }}>{page}</Layout>
}
