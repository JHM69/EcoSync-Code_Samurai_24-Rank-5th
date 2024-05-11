/* eslint-disable react/prop-types */
import React from 'react'
import { getBaseUrl } from '../../utils/url'
import axios from 'axios'

const CollectionPlanItem = ({
  id,
  contractorId,
  area,
  startTime,
  endTime,
  laborers,
  expectedWaste,
  vans,
  completed,
}) => {
  return (
    <div className="smooth-effect my-2 flex cursor-pointer items-center justify-center rounded-md border py-4 text-center shadow-sm hover:bg-green-200 hover:shadow lg:px-6">
      <div className="flex-1">
        <h3 className="text-md text-gray-800">
          {new Date(startTime).toLocaleTimeString() +
            ' ' +
            new Date(endTime).toLocaleTimeString()}
        </h3>
      </div>

      <div className="flex-1">
        <h3 className="text-md text-gray-800">Laborers: {laborers}</h3>
      </div>

      <div className="flex-1">
        <h3 className="text-md text-gray-800">vans: {vans}</h3>
      </div>
      <div className="flex-1">
        <h3 className="text-md text-gray-800">
          Expected Waste: {expectedWaste}
        </h3>
      </div>

      <div className="flex-1">
        <h3 className="text-md text-gray-800">
          completed: {completed ? 'YES' : 'NO'}
        </h3>
      </div>

      {/* Download button */}

      <div className="flex-1">
        <button
          onClick={() => {
            // Call a axios request to complete the collection plan
            const token = localStorage.getItem('token')
            axios
              .get(getBaseUrl() + `/collectionPlan/${id}/complete`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((res) => {
                console.log(res.data)
                alert('Collection Plan Completed')
              })
              .catch((err) => {
                // setLoading(false)
                console.log(err)
              })
          }}
          className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        >
          Complete
        </button>
      </div>

      {/* <ContractorEntryInfo
        employeeEntry={{
          id,
            name,
            lastLogin,
            lastLogout,
            accessLevel,
            diff
        }}
      /> */}

      {/* <UpdateContractorEntry
        vehicleEntry={{
          id,
          vehicleId,
          volumeOfWaste,
          timeOfArrival,
          timeOfDeparture,
          vehicle,
          stsId,
        }}
      /> */}
    </div>
  )
}

export default CollectionPlanItem
