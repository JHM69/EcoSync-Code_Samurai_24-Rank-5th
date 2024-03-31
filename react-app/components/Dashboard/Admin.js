/* eslint-disable multiline-ternary */
/* eslint-disable react/jsx-no-undef */
import React, { useEffect, useState } from 'react'
import { getBaseUrl } from '../../utils/url'
import axios from 'axios'
import StsVehiclesLandfillsMapView from './DashboardMapView'
import BillItems from '../Bills/BillItems'
import Datepicker from 'react-tailwindcss-datepicker'

const getQueryString = (params) => {
  const { startDate, endDate } = params
  let queryString = '/dashboard?'

  const queryParams = []

  if (startDate) {
    queryParams.push('startDate=' + new Date(startDate).toISOString())
  }
  if (endDate) {
    queryParams.push('endDate=' + new Date(endDate).toISOString())
  }

  queryString += queryParams.join('&')
  return queryString
}

function Dashboard() {
  const [data, setData] = useState([])
  const [billData, setBillData] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadingBills, setLoadingBills] = useState(true)
  const [error, setError] = useState(null)
  const [errorBills, setErrorBills] = useState(null)

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: yesterday,
  })

  const handleValueChange = (newValue) => {
    console.log('newValue:', newValue)
    setValue(newValue)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    const queryString = getQueryString(value)
    setLoading(true)
    console.log('queryString:', queryString)
    if (token) {
      axios
        .get(getBaseUrl() + queryString, {
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
          console.log(err)
          setLoading(false)
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
        <div className="m-2 flex w-full flex-row justify-between">
          <div className="mx-3 h-[80px] w-full animate-pulse rounded-2xl bg-gray-300"></div>
          <div className="mx-3 h-[80px] w-full animate-pulse rounded-2xl bg-gray-300"></div>
          <div className="mx-3 h-[80px] w-full animate-pulse rounded-2xl bg-gray-300"></div>
          <div className="mx-3 h-[80px] w-full animate-pulse rounded-2xl bg-gray-300"></div>
          <div className="mx-3 h-[80px] w-full animate-pulse rounded-2xl bg-gray-300"></div>
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

      <div className="flex flex-col">
        {loading ? (
          <div className="h-full w-full gap-2">
            <div className="h-[40px] w-full mb-3  animate-pulse rounded bg-gray-300"></div>
            <div className=" h-[450px] w-full animate-pulse bg-gray-300"></div>
          </div>
        ) : error ? (
          <div>Error: {error.message}</div>
        ) : (
          <div className="w-full">
            <div className="mb-3 w-full rounded   border-[1px] border-gray-300">
              <Datepicker
                primaryColor={'emerald'}
                value={value}
                onChange={handleValueChange}
                showShortcuts={true}
              />
            </div>
            <StsVehiclesLandfillsMapView data={data} />
          </div>
        )}
        {/*
          {loadingBills ? (
                  <div className="w-full">
                    <div className="h-[60px] w-full animate-pulse rounded-md bg-gray-300"></div>
                  </div>
          ) : (
                  <div>
                    <div className="mt-6 flex flex-row  justify-between space-x-2">
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

        {loadingBills ? (
          <div >
            <div className="h-13 my-2 w-full animate-pulse rounded-md bg-gray-300"></div>
            <div className="h-13 my-2 w-full animate-pulse rounded-md bg-gray-300"></div>
            <div className="h-13 my-2 w-full animate-pulse rounded-md bg-gray-300"></div>
            <div className="h-13 my-2 w-full animate-pulse rounded-md bg-gray-300"></div>
          </div>
        ) : (

          <div className="w-full">
            <Datepicker
              primaryColor={'emerald'}
              value={value}
              onChange={handleValueChange}
              showShortcuts={true}
            />
            <BillItems bills={billData?.bills} />
          </div>
        )} */}
      </div>
    </div>
  )
}

export default Dashboard
