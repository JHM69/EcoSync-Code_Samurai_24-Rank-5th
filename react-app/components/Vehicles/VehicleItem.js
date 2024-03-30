import React from 'react'
import { BsMinecart, BsMinecartLoaded } from 'react-icons/bs'
import UpdateVehicle from '../Vehicle/UpdateVehicle'
import VehicleInfo from '../Vehicle/ViewVehicle'

const VehicleItem = ({
  id,
  logo,
  registrationNumber,
  type,
  capacity,
  remainingCapacity,
  loaddedFuelCost,
  unloadedFuelCost,
  lat,
  lon,
  reload,
  setReload,
}) => {
  return (
    <>
      {/* <td className="w-1/6 text-center">
        <div className="flex justify-center">
          <img
            className="mx-3 h-8 w-8 flex-shrink-0 rounded-md"
            src={logo || '/logo.png'}
            alt="Vehicle Logo"
          />
        </div>
      </td> */}

      <td className="w-1/5 py-4 pl-4 text-start">
        <p className="flex-1 truncate font-bold">
          {registrationNumber} - {type}{' '}
        </p>
      </td>

      <td className="w-1/5 py-4 text-center">
        <div className="flex-1 truncate px-2 font-medium">
          <ProgressBar
            currentWasteVolume={capacity - remainingCapacity}
            capacity={capacity}
          />
        </div>
      </td>

      <td className="w-1/5 py-4 text-center">
        <div className="flex-1">
          <div className="flex">
            <p className="flex items-center gap-2 truncate px-2 font-medium">
              <BsMinecart size={28} color="green" />
              {unloadedFuelCost} BDT
            </p>
            <p className="flex items-center gap-2 truncate px-2 font-medium">
              <BsMinecartLoaded size={28} color="red" />
              {loaddedFuelCost} BDT
            </p>
          </div>
        </div>
      </td>

      <td className="w-1/5 py-4 text-center">
        <div className="flex h-full items-center justify-center">
          <VehicleInfo
            vehicle={{
              logo,
              type,
              registrationNumber,
              currentWasteVolume: capacity - remainingCapacity,
              loaddedFuelCost,
              unloadedFuelCost,
              lat,
              lon,
              capacity,
            }}
          />
          <UpdateVehicle
            vehicle={{
              id,
              logo,
              type,
              registrationNumber,
              currentWasteVolume: capacity - remainingCapacity,
              loaddedFuelCost,
              unloadedFuelCost,
              lat,
              lon,
              capacity,
            }}
            reload={reload}
            setReload={setReload}
          />
        </div>
      </td>
    </>
  )
}

function ProgressBar({ currentWasteVolume, capacity }) {
  const percentage = (currentWasteVolume / capacity) * 100
  const barStyle = {
    width: `${Math.max(percentage, 0)}%`,
  }

  return (
    <div className="w-[160px] border-[1px] dark:bg-[#e3ffda] relative h-6 overflow-hidden rounded-full border-green-500 bg-gray-200 text-gray-900">
      <div
        className="h-full rounded-l-full bg-green-500"
        style={barStyle}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium">
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

export default VehicleItem
