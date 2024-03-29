import React from 'react'
import WasteEntryItem from './WasteEntryItem'

const WasteEntryItems = ({ wasteEntries }) => {
  return (
    <div className="block max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
      {wasteEntries?.length
        ? (
            wasteEntries?.map((i) => <WasteEntryItem key={i.id} {...i} />)
          )
        : (
        <div className="h-[100px] w-full text-center font-bold text-gray-300">
          Add some waste entries
        </div>
          )}
    </div>
  )
}

export default WasteEntryItems
