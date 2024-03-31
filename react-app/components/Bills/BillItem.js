import React from 'react'
import BillInfo from '../Bill/ViewBill'
import { BsClockHistory, BsTruck } from 'react-icons/bs'
import { GiNuclearWaste, GiPathDistance } from 'react-icons/gi'
import { BiBuildingHouse, BiDownload, BiLocationPlus, BiMoneyWithdraw } from 'react-icons/bi'
import { FaMoneyBill, FaTimesCircle } from 'react-icons/fa'
import { RxClock } from 'react-icons/rx'
 
const BillItem = ({
  id,
  vehicleEntryId,
  vehicleEntry,
  amount,
  paid,
  createdAt,
  distance,
  duration
}) => {
  return (

    <div className="my-4 flex flex-col md:flex-row justify-between rounded-lg smooth-effect bg-white shadow hover:bg-green-100 transition-shadow duration-300">
      <div className="flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center mb-2">
            <BsTruck className="text-lg text-gray-700 mr-2" />
            <span className="text-lg font-semibold text-gray-800">Vehicle: {vehicleEntry?.vehicle?.registrationNumber}</span>
          </div>
          <div className="flex items-center mb-2">
            <BiBuildingHouse className="text-lg text-gray-700 mr-2" />
            <span className="text-sm text-gray-600">STS: {vehicleEntry?.sts?.wardNumber} - {vehicleEntry?.sts?.name}</span>
          </div>
          <div className="flex items-center mb-2">
            <BiLocationPlus className="text-lg text-gray-700 mr-2" />
            <span className="text-sm text-gray-600">Landfill: {vehicleEntry?.landfill?.name}</span>
          </div>
        </div>
        <div className="   gap-4 flex flex-row marker:justify-between items-center text-gray-700">
          <div className="flex items-center mb-2 sm:mb-0">
            <GiPathDistance className="text-lg mr-2" />
            <span>{distance.toFixed(2)} km</span>
          </div>
          <div className="flex items-center">
            <BsClockHistory className="text-lg mr-2" />
            <span>{duration.toFixed(2)} mins</span>
          </div>
        </div>

        <div className="mt-2 flex flex-row items-center">
          <RxClock className="text-lg text-gray-700 mr-2" />
          <span className="text-sm">{new Date(createdAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-4">

          <div className="flex items-center">
            <GiNuclearWaste className="text-lg font-bold mr-2" />
            <span> {vehicleEntry.volumeOfWaste.toFixed(2)} Ton</span>
          </div>
          <div className="flex items-center">
            <BiMoneyWithdraw className="text-lg font-bold mr-2" />
            <span className="text-green-600 font-semibold">  {amount.toFixed(2)} Tk</span>
          </div>

          <BillInfo
            id={id}
          vehicleEntryId={vehicleEntryId}
          vehicleEntry={vehicleEntry}
          amount={amount}
          paid={paid}
          createdAt={createdAt}
          distance={distance}
            duration={duration}
          />
          <button onClick={() => window.open(`http://localhost:5000/bill/${id}/download`, '_blank')} className="flex items-center justify-center px-2 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition duration-150 ease-in-out">
            <BiDownload className="mr-1" />
          </button>
      </div>
    </div>
  )
}

export default BillItem
