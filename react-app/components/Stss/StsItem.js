/* eslint-disable react/prop-types */
import React from 'react'
import UpdateSts from '../Sts/UpdateSts'
import STSInfo from '../Sts/ViewSts'

const StsItem = ({
  logo,
  wardNumber,
  name,
  currentWasteVolume,
  lat,
  lon,
  capacity,
  address,
  managers,
  id,
  vehicles,
  reload,
  setReload,
}) => {
  return (
    <div className="smooth-effect my-2 flex cursor-pointer items-center rounded-md border px-3 py-4 shadow-sm hover:bg-green-200 hover:shadow lg:px-6">
      <img
        className="mx-3 h-8 w-8 flex-shrink-0 rounded-md"
        src={logo || '/logo.png'}
      />

      <p className="flex-1 truncate font-bold">
        {name || wardNumber} - {address}{' '}
      </p>

      <div className="flex-1 truncate px-2 font-medium">
        <ProgressBar
          currentWasteVolume={currentWasteVolume}
          capacity={capacity}
        />
      </div>

      <div className="flex-1 truncate px-2 font-medium">
        {managers.map((manager, index) => (
          <p key={index} className="truncate px-2 font-medium">
            {manager.name}
          </p>
        ))}
      </div>

      <STSInfo
        sts={{
          logo,
          name,
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
          name,
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
        reload={reload}
        setReload={setReload}
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
    <div className="w-[169px] border-[1px] dark:bg-[#e3ffda] relative h-6 overflow-hidden rounded-full border-green-500 bg-gray-200 text-gray-900">
      {/* Filled part */}
      <div
        className="h-full rounded-l-full bg-green-500"
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
