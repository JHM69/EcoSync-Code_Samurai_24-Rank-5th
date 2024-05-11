import React from 'react'   
import CollectionPlanItem from './CollectionPlanItem'
import TrackerItem from './TrackerItem'
const CollectionPlanItems = ({ trackers  }) => {
  return (
    console.log({trackers}),
    <div className="block max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
      {trackers?.length ? (
        trackers?.map((i) => <TrackerItem key={i.id} {...i} />)
      ) : (
        <div className="h-[100px] w-full text-center font-bold text-gray-300">
           No Collection Plan Items
        </div>
      )}
    </div>
  )
}

export default CollectionPlanItems
