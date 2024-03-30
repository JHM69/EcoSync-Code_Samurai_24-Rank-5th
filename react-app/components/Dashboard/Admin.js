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
    <div className="flex flex-col gap-3">
      {loading ? (
        <div className='h-1/2 w-fill'>
          <div className='animate-pulse h-1/2 w-full bg-gray-300 rounded-md'></div>
          <div className='animate-pulse h-1/2 w-full bg-gray-300 rounded-md'></div> 
        </div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (<div>
   
                     <div className="flex my-3 flex-row  justify-between space-x-4">
                            {data?.additionalData &&
                              data?.additionalData.map((item, index) => {
                                return (
                                  <div
                                    key={item.name + index}
                                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl bg-${item.color}-100  p-3 `}
                                  >
                                    <div
                                      className={`line-clamp-1 flex flex-row items-center text-xl font-light  text-${item.color}-800   md:text-xl lg:text-3xl`}
                                    >
                                      {item.name}
                                    </div>

                                    <span
                                      className={`line-clamp-1 text-2xl font-bold  text-${item.color}-800  md:text-3xl lg:text-4xl`}
                                    >
                                      {item.value}
                                    </span>
                                  </div>
                                );
                              })}
                          </div>

        
        <StsVehiclesLandfillsMapView
          data = {data}
        />
      </div>

      )}
    </div>
    </NoSSR>
  )
}

export default Dashboard
