/* eslint-disable multiline-ternary */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { getBaseUrl } from '../../utils/url'
import AddTruckDumpEntry from '../../components/TruckDumpEntry/AddTruckDumpEntry'
import Layout from '../../components/layout'
import MapView from '../../components/common/MapView'
import TruckDumpEntryItems from '../../components/TruckDumpEntrys/TruckDumpEntryItems'
import TruckDumpEntryItemsSkeleton from '../../components/TruckDumpEntrys/TruckDumpEntryItemsSkeleton'
import { ProgressBar } from '../../components/Sts/ViewSts'
import { NoSSR } from '../../components/common/NoSSR'

function TruckDumpEntry() {
  const [loading, setLoading] = useState(true)
  const [loadingInfo, setLoadingInfo] = useState(true)
  const [truckDumpEntries, setTruckDumpEntries] = useState([])

  const [landfill, setLandfill] = useState({})

  const [landfillId, setTruckDumpId] = useState(null)

  const router = useRouter()

  useEffect(() => {
    setTruckDumpId(router.query.landfillId)
  }, [router.query.landfillId])

  useEffect(() => {
    if (landfillId === null) return
    setLoadingInfo(true)
    const token = localStorage.getItem('token')
    if (token) {
      axios
        .get(getBaseUrl() + '/landfills/' + landfillId, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          setLoadingInfo(false)
          setLandfill(res.data)
          console.log(res.data)
        })
        .catch((err) => {
          setLoadingInfo(false)
          console.log(err)
        })
    }
  }, [landfillId])

  useEffect(() => {
    if (landfillId === null) return
    setLoading(true)
    const token = localStorage.getItem('token')
    if (token.length > 0) {
      axios
        .get(getBaseUrl() + `/landfills/${landfillId}/entry`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then((res) => {
          console.log(res.data)
          setTruckDumpEntries(res.data)
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
          console.log(err)
        })
    }
  }, [landfillId])

  return (
    <NoSSR>
    <div>
      <div className="flex w-full flex-col">
        <div className="mx-6 mt-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-700">Landfill Info </h1>
        </div>
        {loadingInfo ? (
          <div className="cursor-loading mx-6 my-2 flex animate-pulse space-x-16 rounded-md border px-6 py-4 shadow-sm">
            <div className="m-3 mt-3 h-10 flex-1 rounded bg-gray-200"></div>
            <div className="h-[200px] flex-1 rounded bg-gray-200"></div>
          </div>
        ) : (
          <div className="mx-6 block  max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
            <div className="flex  flex-row ">
              <div className="w-1/2 gap-4 px-4">
                <p className="text-md my-2 font-semibold">
                  Name: {landfill.name}
                </p>
                <p className="text-md  my-2">Address: {landfill.address}</p>
                <ProgressBar
                  currentWasteVolume={landfill?.currentWasteVolume}
                  capacity={landfill?.capacity}
                />
              </div>
              <div className="w-1/2">
                <MapView
                  lat={landfill.lat}
                  lon={landfill.lon}
                  name={landfill.wardNumber}
                  address={landfill.address}
                  height="200px"
                  vehicles={landfill.vehicles}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-row gap-3 md:px-6">
        <div className="flex w-full   flex-col">
          <div className="mt-3 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-700">
              Truck Dump Entries{' '}
            </h1>
            <div className="flex items-center space-x-2">
              {landfillId && <AddTruckDumpEntry landfillId={landfillId} />}
            </div>
          </div>
          {loading ? (
            <TruckDumpEntryItemsSkeleton />
          ) : (
            <TruckDumpEntryItems truckDumpEntries={truckDumpEntries} />
          )}
        </div>
      </div>
    </div>
    </NoSSR>
  )
}

export default TruckDumpEntry

TruckDumpEntry.getLayout = function getLayout(page) {
  return <Layout meta={{ name: 'Truck Dump Entries' }}>{page}</Layout>
}
