/* eslint-disable multiline-ternary */
/* eslint-disable react/jsx-no-undef */
import React, { useEffect, useState } from 'react'
import { getBaseUrl } from '../../utils/url'
import axios from 'axios'
import StsVehiclesLandfillsMapView from './DashboardMapView'
import {NoSSR} from '../common/NoSSR'
function Dashboard() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios
        .get(getBaseUrl() + '/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setData(res.data)
          console.log(res.data)
          setLoading(false)
        })
        .catch((err) => {
          setError(err)
          setLoading(false)
        })
    }
  }, [])
  return (
    <NoSSR>
    <div className="flex flex-col gap-3 w-1/2">
      {loading ? (
        <div className='h-1/2 w-fill'>
          <div className='animate-pulse h-1/2 w-full bg-gray-300 rounded-md'></div>
          <div className='animate-pulse h-1/2 w-full bg-gray-300 rounded-md'></div> 
        </div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <StsVehiclesLandfillsMapView
          stss={data.stss}
          vehicles={data.vehicles}
          landfills={data.landfills}
        />
      )}
    </div>
    </NoSSR>
  )
}

export default Dashboard
