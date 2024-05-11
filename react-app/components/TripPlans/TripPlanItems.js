import React from 'react'
import TripPlanItem from './TripPlanItem'

const TripPlanItems = ({ tripplan }) => {
  return (
    <div className="block max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
      {tripplan?.length
        ? (
            tripplan?.map((i) => <TripPlanItem key={i.id} {...i} />)
          )
        : (
        <div className="h-[100px] w-full text-center font-bold text-gray-300">
          No tripplans found for this date, Try to select longer date range
        </div>
          )}
    </div>
  )
}

export default TripPlanItems
