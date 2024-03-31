/* eslint-disable multiline-ternary */
/* eslint-disable react/jsx-no-undef */
import React, { useEffect, useState } from 'react'
import { getBaseUrl } from '../../utils/url'
import axios from 'axios'
import StsVehiclesLandfillsMapView from './DashboardMapView'
import BillItems from '../Bills/BillItems'
import Datepicker from 'react-tailwindcss-datepicker'
function Dashboard() {
  const [data, setData] = useState([])
  const [billData, setBillData] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadingBills, setLoadingBills] = useState(true)
  const [error, setError] = useState(null)
  const [errorBills, setErrorBills] = useState(null)

  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  })

  const handleValueChange = (newValue) => {
    console.log('newValue:', newValue)
    setValue(newValue)
  }

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

  useEffect(() => {
    const token = localStorage.getItem('token')
    setLoadingBills(true)
    if (token) {
      axios
        .get(
          getBaseUrl() +
            '/dashboard-bills' +
            '?startDate=' +
            new Date(value.startDate).toISOString() +
            '&endDate=' +
            new Date(value.endDate).toISOString() +
            '&limit=20',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setBillData(res.data)
          console.log(res.data)
          setLoadingBills(false)
        })
        .catch((err) => {
          setErrorBills(err)
          console.log(err)
          setLoadingBills(false)
        })
    }
  }, [value])

  const colors = [
    { b: 'bg-blue-100', c: 'text-blue-700' },
    { b: 'bg-green-100', c: 'text-green-700' },
    { b: 'bg-yellow-100', c: 'text-yellow-700' },
    { b: 'bg-red-100', c: 'text-red-700' },
    { b: 'bg-indigo-100', c: 'text-indigo-700' },
    { b: 'bg-purple-100', c: 'text-purple-700' },
    { b: 'bg-pink-100', c: 'text-pink-700' },
    { b: 'bg-gray-100', c: 'text-gray-700' },
    { b: 'bg-blue-100', c: 'text-blue-700' },
    { b: 'bg-green-100', c: 'text-green-700' },
  ]
  return (
    <div className="flex flex-col gap-3">
      {loading ? (
        <div className="w-full">
          <div className="h-[40px] w-full animate-pulse rounded-md bg-gray-300"></div>
        </div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          <div className="my-1 flex flex-row  justify-between space-x-2">
            {data?.additionalData &&
              data?.additionalData.map((item, i) => {
                return (
                  <div
                    key={item.name + i}
                    className={`flex flex-col items-center justify-center rounded-2xl text-center ${colors[i].b}  p-1`}
                  >
                    <div
                      className={`line-clamp-1  mx-4 flex flex-row items-center text-xl font-light ${colors[i].c}  text-xl  `}
                    >
                      {item.name}
                    </div>

                    <span
                      className={`line-clamp-1 text-2xl font-bold ${colors[i].c}   text-xl  `}
                    >
                      {item.value}
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {loadingBills ? (
        <div className="w-full">
          <div className="h-[60px] w-full animate-pulse rounded-md bg-gray-300"></div>
        </div>
      ) : (
        <div>
          <div className="my-1 flex flex-row  justify-between space-x-2">
            {billData?.additionalData &&
              billData?.additionalData.map((item, i) => {
                return (
                  <div
                    key={item.name + i}
                    className={`flex flex-col items-center justify-center rounded-2xl text-center ${
                      colors[i + 2].b
                    }  p-1`}
                  >
                    <div
                      className={`line-clamp-1  mx-4 flex flex-row items-center text-xl font-light ${
                        colors[i + 2].c
                      }  text-xl  `}
                    >
                      {item.name}
                    </div>

                    <span
                      className={`line-clamp-1 text-2xl font-bold ${
                        colors[i + 2].c
                      }   text-xl  `}
                    >
                      {item.value}
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      <div className="flex flex-row">
        {loading ? (
          <div className="h-1/2 w-full">
            <div className="h-[200px] w-full animate-pulse rounded-md bg-gray-300"></div>
          </div>
        ) : error ? (
          <div>Error: {error.message}</div>
        ) : (
          <div className="w-1/2">
            <StsVehiclesLandfillsMapView data={data} />
          </div>
        )}

        {loadingBills ? (
          <div className="mx-4 h-1/2 w-1/2">
            <div className="h-13 my-2 w-full animate-pulse rounded-md bg-gray-300"></div>
            <div className="h-13 my-2 w-full animate-pulse rounded-md bg-gray-300"></div>
            <div className="h-13 my-2 w-full animate-pulse rounded-md bg-gray-300"></div>
            <div className="h-13 my-2 w-full animate-pulse rounded-md bg-gray-300"></div>
          </div>
        ) : (
          <div className="w-1/2">
            <Datepicker
              primaryColor={'emerald'}
              value={value}
              onChange={handleValueChange}
              showShortcuts={true}
            />
            <BillItems bills={billData?.bills} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
