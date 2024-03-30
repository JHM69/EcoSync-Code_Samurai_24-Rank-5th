import React from 'react'
import StsItem from './StsItem'

const StsItems = ({ stss, reload, setReload }) => {
  return (
    <div className="block max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
      {stss?.length ? (
        stss?.map((i) => <StsItem key={i.id} {...i} reload={reload} setReload={setReload} />)
      ) : (
        <div className="h-[100px] w-full text-center font-bold text-gray-300">
          Add some sts to see the data.
        </div>
      )}
    </div>
  )
}

export default StsItems
