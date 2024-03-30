/* eslint-disable react/prop-types */
import React from 'react'
import UpdateWasteEntry from '../WasteEntry/UpdateWasteEntry'
import WasteInfoEntry from '../WasteEntry/ViewWasteEntry'

const WasteEntryItem = ({
  id,
  stsId,
  sts,
  volumeOfWaste,
  timeOfArrival
}) => {
  return (
    <div className="smooth-effect my-2 flex cursor-pointer items-center rounded-md border px-3 py-4 shadow-sm hover:bg-green-200 hover:shadow lg:px-6">
      <div className="flex-1">
        <h3 className="text-xl text-gray-800">{volumeOfWaste} Ton</h3>
      </div>

      <div className="flex-1">
        <h3 className="text-xl text-gray-800">
          Arrival: {new Date(timeOfArrival).toLocaleString()}
        </h3>
      </div>

      <WasteInfoEntry
        wasteEntry={{
          id,
          stsId,
          volumeOfWaste,
          timeOfArrival
        }}
      />

      <UpdateWasteEntry
        wasteEntry={{
          id,
          stsId,
          volumeOfWaste,
          timeOfArrival
        }}
      />
    </div>
  )
}

export default WasteEntryItem
