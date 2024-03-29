import React from 'react'
import StsEntryItem from './StsEntryItem'

const StsEntryItems = ({ vehicleEntries }) => {
  return (
    <div className="block max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
      {vehicleEntries?.length
        ? (
            vehicleEntries?.map((i) => <StsEntryItem key={i.id} {...i} />)
          )
        : (
        <div className="h-[100px] w-full text-center font-bold text-gray-300">
          Add some sts entries of vehicles
        </div>
          )}
    </div>
  )
}

export default StsEntryItems
