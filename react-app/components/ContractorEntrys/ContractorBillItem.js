/* eslint-disable react/prop-types */
import React from 'react'
import { getBaseUrl } from '../../utils/url'
 
const ContractorBillItem = ({paid, createdAt, totalAmount, fine, id}) => {

  return (
    <div className="smooth-effect my-2 flex cursor-pointer items-center text-center justify-center rounded-md border py-4 shadow-sm hover:bg-green-200 hover:shadow lg:px-6">
      
      
      <div className="flex-1">
        <h3 className="text-md text-gray-800">
          {
            new Date(createdAt).toLocaleTimeString() + " " + new Date(createdAt).toLocaleDateString()
          }
        </h3>
      </div>

      
      <div className="flex-1">
        <h3 className="text-md text-gray-800">
          Amount: {totalAmount} Taka
        </h3>
      </div>

        <div className="flex-1">
            <h3 className="text-md text-gray-800">
                Fine: {fine} Taka
            </h3>
        </div>

        <div className="flex-1">
            <h3 className="text-md text-gray-800">
                Paid: {paid?"YES" : "NO"}
            </h3>
        </div>

        {/* Download button */}

        <div className="flex-1">
            <button onClick={
                () => {
                    window.open(`${getBaseUrl()}/contractorBill/${id}/download`, "_blank")
                }

            } className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Download
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

export default ContractorBillItem
