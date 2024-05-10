/* eslint-disable react/prop-types */
import React from 'react'
import UpdateContractorEntry from '../ContractorEntry/UpdateContractorEntry'
import ContractorInfoEntry from '../ContractorEntry/ViewContractorEntry'

const ContractorEntryItem = ({
  id,
  vehicleId,
  volumeOfWaste,
  timeOfArrival,
  timeOfDeparture,
  vehicle,
  stsId,
  sts,
  landfill,
  bill,
}) => {
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
        <h3 className="text-md text-gray-800">Landfill: {landfill?.name}</h3>
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

      <ContractorInfoEntry
        vehicleEntry={{
          id,
          vehicleId,
          volumeOfWaste,
          timeOfArrival,
          timeOfDeparture,
          vehicle,
          sts,
          landfill,
          bill,
        }}
      />

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

export default ContractorEntryItem
