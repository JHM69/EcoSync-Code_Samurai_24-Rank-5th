/* eslint-disable indent */
/* eslint-disable multiline-ternary */
/* eslint-disable react/react-in-jsx-scope */

import { useEffect, useState } from 'react'
import Layout from '../components/layout'
import { NoSSR } from '../components/common/NoSSR'
import Datepicker from 'react-tailwindcss-datepicker'
import BillItems from '../components/Bills/BillItems'
import { getBaseUrl } from '../utils/url'
import axios from 'axios'

const getQueryString = (params) => {
  const { startDate, endDate, vehicleRegNumber, wardNo, isPaid } = params
  let queryString = '/dashboard-bills?'

  const queryParams = []

  if (startDate) {
    queryParams.push('startDate=' + new Date(startDate).toISOString())
  }
  if (endDate) {
    queryParams.push('endDate=' + new Date(endDate).toISOString())
  }
  if (vehicleRegNumber) {
    queryParams.push('vehicleRegNumber=' + encodeURIComponent(vehicleRegNumber))
  }
  if (wardNo) {
    queryParams.push('wardNo=' + encodeURIComponent(wardNo))
  }
  if (isPaid !== null) {
    queryParams.push('isPaid=' + isPaid)
  }

  queryString += queryParams.join('&')
  return queryString
}

function Bills() {
  const [billData, setBillData] = useState({})
  const [loadingBills, setLoadingBills] = useState(true)
  const [errorBills, setErrorBills] = useState(null)

  const [filters, setFilters] = useState({
    vehicleRegNumber: '',
    wardNo: '',
    isPaid: false,
  })

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleFilterClick = () => {
    // Assuming you have logic to fetch data based on these filters
    console.log('Fetching data with filters:', filters)
    // You would typically call a function here that fetches the data
    // using the filters state.
  }

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: weekAgo,
  })

  const handleValueChange = (newValue) => {
    console.log('newValue:', newValue)
    setValue(newValue)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')

    setLoadingBills(true)
    if (token) {
      const queryString = getQueryString({
        ...value,
        ...filters,
      })

      axios
        .get(getBaseUrl() + queryString, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setBillData(res.data)
          console.log(res.data)
          setLoadingBills(false)
          setErrorBills(null)
        })
        .catch((err) => {
          setErrorBills(err)
          console.log(err)
          setLoadingBills(false)
        })
    }
  }, [value, filters])

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
    <NoSSR>
      <div className="  flex  w-full flex-col gap-1 rounded-xl bg-white p-3 shadow">
        <div className="w-full">
          <Datepicker
            primaryColor={'emerald'}
            value={value}
            onChange={handleValueChange}
            showShortcuts={true}
          />

          <div className="my-4 flex flex-row items-center justify-between gap-4">
            <div className="flex flex-row items-center text-sm font-light text-gray-700">
              <span className="text-sm font-light text-gray-700">
                Vehicle Registration Number:{' '}
              </span>
              <input
                type="text"
                name="vehicleRegNumber"
                value={filters.vehicleRegNumber}
                onChange={handleFilterChange}
                className="rounded-md border-2 border-gray-300 p-2"
                placeholder="Filter Vehicle Registration Number"
              />
            </div>

            <div className="flex flex-row items-center text-sm font-light text-gray-700">
              <span className="items-center text-sm font-light text-gray-700">
                Ward No:{' '}
              </span>
              <input
                type="text"
                name="wardNo"
                value={filters.wardNo}
                onChange={handleFilterChange}
                className="rounded-md border-2 border-gray-300 p-2"
                placeholder="Filter Ward No"
              />
            </div>

            <div className="flex flex-row text-sm font-light text-gray-700">
              <span className="items-center text-sm font-light text-gray-700">
                Is Paid:{' '}
              </span>
              <input
                type="checkbox"
                name="isPaid"
                checked={filters.isPaid}
                onChange={handleFilterChange}
                className="rounded-md border-2 border-gray-300 p-2"
              />
            </div>

            <button
              onClick={handleFilterClick}
              className="h-10 rounded-md bg-green-500 p-2 text-white"
            >
              Filter
            </button>
          </div>

          {loadingBills ? (
            <div className="w-full">
              <div className="h-[60px] w-full animate-pulse rounded-md bg-gray-300"></div>
            </div>
          ) : (
            <div>
              <div className=" my-4 flex flex-row justify-between space-x-2">
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
            <div className="mt-4 flex w-full items-center justify-center gap-4">
              <div className="my-2 h-20 w-full animate-pulse rounded-md bg-gray-300"></div>
              <div className="my-2 h-20 w-full animate-pulse rounded-md bg-gray-300"></div>
              <div className="my-2 h-20 w-full animate-pulse rounded-md bg-gray-300"></div>
              <div className="my-2 h-20 w-full animate-pulse rounded-md bg-gray-300"></div>
              <div className="my-2 h-20 w-full animate-pulse rounded-md bg-gray-300"></div>
            </div>
          ) : errorBills ? (
            <div className="flex w-full items-center justify-center">
              <div className="text-red-500">Error loading data</div>
            </div>
          ) : (
            <BillItems bills={billData?.bills} />
          )}
        </div>
      </div>
    </NoSSR>
  )
}

export default Bills

Bills.getLayout = function getLayout(page) {
  // eslint-disable-next-line react/react-in-jsx-scope
  return <Layout>{page}</Layout>
}
