import React from 'react'
import LandfillItem from './LandfillItem'

const LandfillItems = ({ landfills }) => {
  return (
    <div className="block max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
      {landfills?.length ? (
        landfills?.map((i) => <LandfillItem key={i.id} {...i} />)
      ) : (
        <div className="h-[100px] w-full text-center font-bold text-gray-300">
          Add Landfill to see the data.
        </div>
      )}
    </div>
  )
}

export default LandfillItems
