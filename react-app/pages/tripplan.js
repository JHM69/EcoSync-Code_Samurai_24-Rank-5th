/* eslint-disable indent */
/* eslint-disable multiline-ternary */
/* eslint-disable react/react-in-jsx-scope */

import { useEffect, useState } from 'react'
import Layout from '../components/layout'
import { NoSSR } from '../components/common/NoSSR'
import Datepicker from 'react-tailwindcss-datepicker'
import TripPlanItems from '../components/TripPlans/TripPlanItems'
import { getBaseUrl } from '../utils/url'
import axios from 'axios'
import Select from '../components/common/Select'

const getQueryString = (params) => {
  const {
    startDate,
    endDate,
    vehicleId,
    stsId,
    landfillId,
    isVerified,
    isPaid,
  } = params
  let queryString = '/dashboard-bills?'

  const queryParams = []

  if (startDate) {
    queryParams.push('startDate=' + new Date(startDate).toISOString())
  }
  if (endDate) {
    queryParams.push('endDate=' + new Date(endDate).toISOString())
  }
  if (vehicleId) {
    queryParams.push('vehicleId=' + vehicleId)
  }
  if (stsId) {
    queryParams.push('stsId=' + stsId)
  }
  if (landfillId) {
    queryParams.push('landfillId=' + landfillId)
  }
  if (isVerified !== 's') {
    queryParams.push('isVerified=' + isVerified)
  }
  if (isPaid !== 's') {
    queryParams.push('isPaid=' + isPaid)
  }

  queryString += queryParams.join('&')
  return queryString
}

function Trips () {
  // const [billData, setBillData] = useState({})
  const [loadingBills, setLoadingBills] = useState(true)
  const [errorBills, setErrorBills] = useState(null)
  const [tripplan, setTripplan] = useState({})

  const [filters, setFilters] = useState({
    isPaid: 's',
    isVerified: 's',
    landfillId: '',
    stsId: '',
    vehicleId: '',
  })

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? (checked ? 'true' : 'false') : value,
    }))
  }

  const [value, setValue] = useState({
    startDate: '',
    endDate: '',
  })

  const handleValueChange = (newValue) => {
    console.log('newValue:', newValue)
    setValue(newValue)
  }

  // useEffect(() => {
  //   const token = localStorage.getItem('token')

  //   setLoadingBills(true)
  //   if (token) {
  //     const queryString = getQueryString({
  //       ...value,
  //       ...filters,
  //     })

  //     console.log('queryString:', queryString)

  //     axios
  //       .get(getBaseUrl() + queryString, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((res) => {
  //         setBillData(res.data)
  //         console.log(res.data)
  //         setLoadingBills(false)
  //         setErrorBills(null)
  //       })
  //       .catch((err) => {
  //         setErrorBills(err)
  //         console.log(err)
  //         setLoadingBills(false)
  //       })
  //   }
  // }, [
  //   value,
  //   filters.isPaid,
  //   filters.isVerified,
  //   filters.landfillId,
  //   filters.stsId,
  //   filters.vehicleId,
  // ])

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

  const [values, setValues] = useState({})

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios
        .get(getBaseUrl() + '/tripplan', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setTripplan(res.data)
          console.log(res.data)
          setLoadingBills(false)
          setErrorBills(null)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [tripplan.length])

  return (
    <NoSSR>
      <div className="  flex  w-full flex-col gap-1 rounded-xl bg-white p-3 shadow">
        <div className="flex w-full flex-row justify-between gap-2">
          <div className="flex w-4/12 flex-col rounded-2xl">
            <label className="text-sm font-light text-gray-700">
              Select Date Range
            </label>
            <Datepicker
              primaryColor={'emerald'}
              value={value}
              onChange={handleValueChange}
              showShortcuts={true}
            />
          </div>

          <Select
            className={'w-[150px]'}
            name="vehicleId"
            label="Select Vehicle"
            onChange={(e) => {
              setFilters((prevFilters) => ({
                ...prevFilters,
                vehicleId: e.target.value,
              }))
            }}
          >
            <option value=""></option>
            {values?.vehicles?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.registrationNumber}
              </option>
            ))}
          </Select>

          <Select
            className={'w-[150px]'}
            name="stsId"
            label="Select STS"
            onChange={(e) => {
              setFilters((prevFilters) => ({
                ...prevFilters,
                stsId: e.target.value,
              }))
            }}
          >
            <option value=""></option>
            {values?.stss?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>

          <Select
            className={'w-[150px]'}
            name="landfillId"
            label="Select Landfill"
            onChange={(e) => {
              setFilters((prevFilters) => ({
                ...prevFilters,
                landfillId: e.target.value,
              }))
            }}
          >
            <option value=""></option>
            {values?.landfills?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>

          <div className="flex flex-row items-center text-sm font-light text-gray-700">
            <span className="items-center text-sm font-light text-gray-700">
              Paid:{' '}
            </span>
            <input
              type="checkbox"
              name="isPaid"
              checked={filters.isPaid === 'true'}
              onChange={handleFilterChange}
              className="rounded-md border-2 border-gray-300 p-2"
            />
          </div>

          <div className="flex flex-row items-center text-sm font-light text-gray-700">
            <span className="items-center text-sm font-light text-gray-700">
              Verified:{' '}
            </span>
            <input
              type="checkbox"
              name="isVerified"
              checked={filters.isVerified === 'true'}
              onChange={handleFilterChange}
              className="rounded-md border-2 border-gray-300 p-2"
            />
          </div>
        </div>

        {loadingBills ? (
          <div className="w-full">
            <div className="h-[60px] w-full animate-pulse rounded-md bg-gray-300"></div>
          </div>
        ) : (
          <div>
            <div className=" my-4 flex flex-row justify-between space-x-2">
              {tripplan?.additionalData &&
                tripplan?.additionalData.map((item, i) => {
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
          <div>
            <div className="mt-4 flex w-full items-center justify-center gap-4">
              <div className="my-2 h-20 w-full animate-pulse rounded-2xl bg-gray-300"></div>
              <div className="my-2 h-20 w-full animate-pulse rounded-2xl bg-gray-300"></div>
              <div className="my-2 h-20 w-full animate-pulse rounded-2xl bg-gray-300"></div>
              <div className="my-2 h-20 w-full animate-pulse rounded-2xl bg-gray-300"></div>
            </div>
            <div className="flex flex-col">
              <div className="my-2 h-36 w-full animate-pulse rounded-md bg-gray-300"></div>
              <div className="my-2 h-36 w-full animate-pulse rounded-md bg-gray-300"></div>
              <div className="my-2 h-36 w-full animate-pulse rounded-md bg-gray-300"></div>
            </div>
          </div>
        ) : errorBills ? (
          <div className="flex w-full items-center justify-center">
            <div className="text-red-500">Error loading data</div>
          </div>
        ) : (
          <TripPlanItems tripplan={tripplan} />
        )}
      </div>
    </NoSSR>
  )
}

export default Trips

Trips.getLayout = function getLayout(page) {
  // eslint-disable-next-line react/react-in-jsx-scope
  return <Layout>{page}</Layout>
}
