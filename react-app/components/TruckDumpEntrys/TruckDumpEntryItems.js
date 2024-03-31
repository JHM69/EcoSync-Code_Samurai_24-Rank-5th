import React, { useEffect } from 'react'
import TruckDumpEntryItem from './TruckDumpEntryItem'

const TruckDumpEntryItems = ({ truckDumpEntries }) => {

  useEffect(() => {
    console.log('truckDumpEntries..', truckDumpEntries)
  }, [])

  return (
    <div className="block max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
      {truckDumpEntries?.length
        ? (
            truckDumpEntries?.map((i) => <TruckDumpEntryItem key={i.id} {...i} />)
          )
        : (
        <div className="h-[100px] w-full text-center font-bold text-gray-300">
          Add some sts entries of vehicles
        </div>
          )}
    </div>
  )
}

export default TruckDumpEntryItems
