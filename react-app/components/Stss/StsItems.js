import React from 'react'
import StsItem from './StsItem'

const StsItems = ({ sts }) => {
  return (
    <div className="block max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
      {sts?.length
        ? (
            sts?.map((i) => <StsItem key={i.id} {...i} />)
          )
        : (
        <div className="h-[100px] w-full text-center font-bold text-gray-300">
          Add some STS to see the data.
        </div>
          )}
    </div>
  )
}

export default StsItems
