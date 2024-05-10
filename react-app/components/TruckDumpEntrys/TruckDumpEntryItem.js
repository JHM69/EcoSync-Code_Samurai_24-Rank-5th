/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import UpdateTruckDumpEntry from '../TruckDumpEntry/UpdateTruckDumpEntry'
import TruckDumpInfoEntry from '../TruckDumpEntry/ViewTruckDumpEntry'
import axios from 'axios'
import { getBaseUrl } from '../../utils/url'

const TruckDumpEntryItem = ({
  billId,
  id,
  vehicleId,
  volumeOfWaste,
  timeOfArrival,
  timeOfDeparture,
  vehicle,
  stsId,
  sts,
}) => {
  const [verified, setVerified] = React.useState(false)
  useEffect(() => {
    const getBillInfo = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(getBaseUrl() + `/bill/${billId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setVerified(res.data.verified)
        console.log('bill info...', res.data)
      } catch (error) {
        // console.log(error)
        console.log('bill fetching error', getBaseUrl() + `/bill/${billId}`)
      }
    }
    if (billId != 0) getBillInfo()
  }, [])
  return (
    <div className="smooth-effect my-2 flex cursor-pointer items-center rounded-md border px-3 py-4 shadow-sm hover:bg-green-200 hover:shadow lg:px-6">
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-800">
          {vehicle.registrationNumber}
        </h3>
      </div>
      <div className="flex-1">
        <h3 className="text-xl text-gray-800">{volumeOfWaste} Ton</h3>
      </div>

      <div className="flex-1">
        <h3 className="text-md text-gray-800">
          Arrival: {new Date(timeOfArrival).toLocaleString()}
        </h3>
      </div>

      <div className="flex-1">
        <h3 className="text-md text-gray-800">
          Departure: {new Date(timeOfDeparture).toLocaleString()}
        </h3>
      </div>

      <TruckDumpInfoEntry
        truckDumpEntry={{
          billId,
          id,
          vehicleId,
          volumeOfWaste,
          timeOfArrival,
          timeOfDeparture,
          vehicle,
          sts,
        }}
        billId={billId}
      />

      {/* <UpdateTruckDumpEntry
        truckDumpEntry={{
          billId,
          id,
          vehicleId,
          volumeOfWaste,
          timeOfArrival,
          timeOfDeparture,
          vehicle,
          stsId,
        }}
        billId={billId}
      /> */}
      {/* add a button to show verified */}
      <div className="flex-1">
        {verified ? (
          <a
            href={`http://10.33.27.140:5000/bill/${billId}/download`}
            className="ml-2 rounded-md bg-green-500 p-2 text-white"
            target="_blank"
          >
            &#10003; Download Bill
          </a>
        ) : (
          <a
            href="#"
            disable="true"
            className="ml-2 rounded-md bg-red-500 p-2 text-white"
          >
            &#10007; Bill not verified
          </a>
        )}
      </div>
    </div>
  )
}

export default TruckDumpEntryItem
