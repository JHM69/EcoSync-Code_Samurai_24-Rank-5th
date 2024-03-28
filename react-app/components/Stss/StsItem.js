/* eslint-disable react/prop-types */
import React from 'react'
import UpdateSts from '../Sts/UpdateSts'
import STSInfo from '../Sts/ViewSts'

const StsItem = ({
  logo,
  wardNumber,
  currentWasteVolume,
  lat,
  lon,
  capacity,
  address,
  managers,
  id,
  vehicles,
}) => {


  return (
    <div className="smooth-effect my-2 flex cursor-pointer items-center rounded-md border px-3 py-4 shadow-sm hover:bg-green-200 hover:shadow lg:px-6">
      <img
        className="mx-3 h-8 w-8 flex-shrink-0 rounded-md"
        src={logo || '/logo.png'}
      />

      <p className="flex-1 truncate font-bold">
        {wardNumber} - {address}{' '}
      </p>

      <div className="flex-1 truncate px-2 font-medium">
        <ProgressBar
          currentWasteVolume={currentWasteVolume}
          capacity={capacity}
        />
      </div>
 

      <p className="flex-1 truncate px-2 font-medium">
        {managers && managers[0]?.name}
      </p>

      <STSInfo
        sts={{
          logo,
          wardNumber,
          currentWasteVolume,
          lat,
          lon,
          capacity,
          address,
          managers,
          id,
          vehicles,
        }}
      />

      <UpdateSts
        sts={{
          logo,
          wardNumber,
          currentWasteVolume,
          lat,
          lon,
          capacity,
          address,
          managers,
          id,
          vehicles,
        }}
      />
     
    </div>
  )
}

 function ProgressBar({ currentWasteVolume, capacity }) {
  // Calculate the percentage of waste volume relative to the capacity
  const percentage = (currentWasteVolume / capacity) * 100

  // Style for the progress bar's filled portion
  const barStyle = {
    width: `${Math.max(percentage, 0)}%`, // Ensure width is not negative
  }

  return (
    <div className="relative h-6 w-[169px] overflow-hidden rounded-full border-[1px] border-[#76C75E] bg-gray-200 text-gray-900 dark:bg-[#e3ffda]">
      {/* Filled part */}
      <div
        className="h-full rounded-l-full bg-[#76C75E]"
        style={barStyle}
      ></div>
      {/* Text part: Centered using flex container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium  ">
          {currentWasteVolume >= 0
            ? `${currentWasteVolume}/${capacity} Ton (${percentage.toFixed(
                2
              )}%)`
            : `0/${capacity} Ton (0%)`}
        </span>
      </div>
    </div>
  )
}

export default StsItem
