/* eslint-disable react/prop-types */
import React from 'react'
import UpdateContractorEntry from '../ContractorEntry/UpdateContractorEntry'
import ContractorEntryInfo from '../ContractorEntry/ViewContractorEntry'

const ContractorEntryItem = ({id, name, dateOfBirth, dateOfHire, jobTitle, paymentRatePerHour, phone, assignedCollectionRoute}) => {

  return (
    <div className="smooth-effect my-2 flex cursor-pointer items-center text-center justify-center rounded-md border py-4 shadow-sm hover:bg-green-200 hover:shadow lg:px-6">
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-800">
          {name}
        </h3>
      </div>
      {/* <div className="flex-1 w-1/7">
        <h3 className="text-md text-gray-800">{new Date(dateOfBirth).toISOString().slice(0, 10)}</h3>
      </div>

      <div className="flex-1 w-1/7">
        <h3 className="text-md text-gray-800">{new Date(dateOfHire).toISOString().slice(0, 10)}</h3>
      </div> */}

      <div className="flex-1">
        <h3 className="text-md text-gray-800">
          {phone}
        </h3>
      </div>

      <div className="flex-1">
        <h3 className="text-md text-gray-800">
          {jobTitle}
        </h3>
      </div>

        <div className="flex-1">
            <h3 className="text-md text-gray-800">
                {paymentRatePerHour}
            </h3>
        </div>

      <ContractorEntryInfo
        employeeEntry={{
          id,
            name,
            dateOfBirth,
            dateOfHire,
            jobTitle,
            paymentRatePerHour,
            phone,
            assignedCollectionRoute
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
