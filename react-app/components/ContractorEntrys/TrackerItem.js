/* eslint-disable react/prop-types */
import React from 'react'
 
const TrackerItem = ({
  id,
  employeeId,
  lat,
  lon,
  timestamp
}) => {
  return (
    <div className="smooth-effect my-2 flex cursor-pointer items-center justify-center rounded-md border py-4 text-center shadow-sm hover:bg-green-200 hover:shadow lg:px-6">
        <div className="flex-1">
        <h3 className="text-md text-gray-800">Employee ID: {employeeId}</h3>
      </div>
      
      <div className="flex-1">
        <h3 className="text-md text-gray-800">
          {new Date(timestamp).toLocaleTimeString() +
            ' ' +
            new Date(timestamp).toLocaleTimeString()}
        </h3>
      </div>

      <div className="flex-1">
        <h3 className="text-md text-gray-800">lat: {lat}</h3>
      </div>

      <div className="flex-1">
        <h3 className="text-md text-gray-800">lon: {lon}</h3>
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

export default TrackerItem
