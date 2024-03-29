/* eslint-disable multiline-ternary */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { getBaseUrl } from '../../utils/url'
import AddStsEntry from '../../components/StsEntry/AddStsEntry'
import StsItemsSkeleton from '../../components/Stss/StsItemsSkeleton'
import StsEntryItems from '../../components/StsEntrys/StsEntryItems'
import Layout from '../../components/layout'
import { ProgressBar } from '../../components/Sts/ViewSts'
import MapView from '../../components/common/MapView'
import AddWasteEntry from '../../components/WasteEntry/AddWasteEntry'
import WasteItemsSkeleton from '../../components/WasteEntrys/WasteEntryItemsSkeleton'
import WasteEntryItems from '../../components/WasteEntrys/WasteEntryItems'

function VehicleEntry () {
  const [loading, setLoading] = useState(true)
  const [loadingInfo, setLoadingInfo] = useState(true)
  const [vehicleEntries, setVehicleEntries] = useState([])
  const [wasteEntries, setWasteEntries] = useState([])

  const [sts, setSts] = useState({})

  const [stsId, setStsId] = useState(null)

  const router = useRouter()

  useEffect(() => {
    setStsId(router.query.stsId)
  }, [router.query.stsId])

  useEffect(() => {
    if (stsId === null) return
    setLoadingInfo(true)
    const token = localStorage.getItem('token')
    if (token) {
      axios
        .get(getBaseUrl() + '/sts', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          setLoadingInfo(false)
          setSts(res.data[0])
          console.log(res.data)
        })
        .catch((err) => {
          setLoadingInfo(false)
          console.log(err)
        })
    }
  }, [stsId])

  useEffect(() => {
    if (stsId === null) return
    setLoading(true)
    const token = localStorage.getItem('token')
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
  }, [stsId])

  useEffect(() => {
    if (stsId === null) return
    setLoading(true)
    const token = localStorage.getItem('token')
    if (token.length > 0) {
      axios
        .get(getBaseUrl() + `/sts/${stsId}/add`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          console.log(res.data)
          setWasteEntries(res.data)
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
          console.log(err)
        })
    }
  }, [stsId])

  return (
    <div>
      <div className="flex w-full flex-col">
        <div className="mx-6 mt-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-700">STS Info </h1>
        </div>
        {loadingInfo ? (
          <div className="cursor-loading mx-6 my-2 flex animate-pulse space-x-16 rounded-md border px-6 py-4 shadow-sm">
            <div className="h-10 m-3 mt-3 flex-1 rounded bg-gray-200"></div>
            <div className="h-[200px] flex-1 rounded bg-gray-200"></div>
          </div>
        ) : (
          <div className="mx-6 block  max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
            <div className="flex  flex-row ">
              <div className="w-1/2 px-4 gap-4">
                <p className="text-md my-2 font-semibold">Ward: {sts.wardNumber}</p>
                <p className="text-md  my-2">Address: {sts.address}</p>
                <ProgressBar
                  currentWasteVolume={sts?.currentWasteVolume}
                  capacity={sts?.capacity}
                />
              </div>
              <div className="w-1/2">
                <MapView
                    lat={sts.lat}
                    lon={sts.lon}
                    name={sts.wardNumber}
                    address={sts.address}
                    height = '200px'
                    vehicles = {sts.vehicles}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-row gap-3 md:px-6">
        <div className="flex w-2/3   flex-col">
          <div className="mt-3 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-700">
              Vehicle Entries{' '}
            </h1>
            <div className="flex items-center space-x-2">
              {stsId && <AddStsEntry stsId={stsId} />}
            </div>
          </div>
          {loading ? (
            <StsItemsSkeleton />
          ) : (
            <StsEntryItems vehicleEntries={vehicleEntries} />
          )}
        </div>

        <div className="flex w-1/3   flex-col">
          <div className="mt-3 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-700">
              Waste Entries
            </h1>
            <div className="flex items-center space-x-2">
              {stsId && <AddWasteEntry stsId={stsId} />}
            </div>
          </div>
          {loading ? (
            <WasteItemsSkeleton />
          ) : (
            <WasteEntryItems wasteEntries={wasteEntries} />
          )}
        </div>
      </div>
    </div>
  )
}

export default VehicleEntry

VehicleEntry.getLayout = function getLayout (page) {
  return <Layout meta={{ name: 'Vehicle Entries' }}>{page}</Layout>
}
