/* eslint-disable multiline-ternary */
/* eslint-disable react/jsx-key */
/* eslint-disable react/react-in-jsx-scope */
import Layout from '../components/layout'
import { useEffect, useState } from 'react'
import VehicleItemSkeleton from '../components/Vehicles/VehicleItemsSkeleton'
import axios from 'axios'
import { getBaseUrl } from '../utils/url'
import AddVehicle from '../components/Vehicle/AddVehicle'
import VehicleItems from '../components/Vehicles/VehicleItems'
function Vehicles() {
  const [loading, setLoading] = useState(true)
  const [vehicles, setVehicles] = useState([])
  const [reload, setReload] = useState(false)
  useEffect(() => {
    setLoading(true)
    const token = localStorage.getItem('token')
    if (token.length > 0) {
      axios
        .get(getBaseUrl() + '/vehicle', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data)
          setVehicles(res.data)
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
          console.log(err)
        })
    }
  }, [reload])

  return (
    <div>
      <div className="flex md:px-6 flex-row gap-3">
        <div className="flex w-full flex-col">
          <div className="mt-3 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-700">Vehicle</h1>
            <div className="flex items-center space-x-2">
              <AddVehicle reload={reload} setReload={setReload}/>
            </div>
          </div>
          {loading ? <VehicleItemSkeleton /> : <VehicleItems vehicles={vehicles}  reload={reload} setReload={setReload}/>}
        </div>
      </div>
    </div>
  )
}

export default Vehicles

Vehicles.getLayout = function getLayout(page) {
  return <Layout meta={{ name: 'Vehicle' }}>{page}</Layout>
}
