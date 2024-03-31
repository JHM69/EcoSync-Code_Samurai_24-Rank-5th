import React from 'react'
import BillInfo from '../Bill/ViewBill'
import { BsTruck } from 'react-icons/bs'
import { GiPathDistance } from 'react-icons/gi'
import { BiTime } from 'react-icons/bi'
import { FaMoneyBill, FaTimesCircle } from 'react-icons/fa'

const BillItem = ({
  id,
  vehicleEntryId,
  vehicleEntry,
  amount,
  paid,
  createdAt,
  distance,
  duration,
}) => {
  return (
    <div className="my-4 overflow-hidden rounded-lg bg-white shadow-md">
      <div className="p-4 md:flex flex-col md:items-center">
        <div className="mb-4 flex items-start text-lg md:mb-0 md:flex-1 md:pr-4">
          {/* Align icons to the left for better visual flow */}
          <BsTruck className="mr-2 text-xl text-gray-700" />
          <div>
            <h3 className="font-semibold text-gray-800">
              Vehicle: {vehicleEntry.vehicle.registrationNumber}
            </h3>
            <p className="text-gray-600">
              STS: {vehicleEntry.sts.wardNumber} - {vehicleEntry.sts.name}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between md:flex-1">
          <div className="flex items-center">
            <GiPathDistance className="mr-2 text-xl text-gray-700" />
            <h3 className="font-semibold text-gray-800">
              {distance.toFixed(2)} km
            </h3>
          </div>
          <div className="flex items-center">
            <BiTime className="mr-2 text-xl text-gray-700" />
            <h3 className="font-semibold text-gray-800">
              {duration.toFixed(2)} mins
            </h3>
          </div>
        </div>

        <div className="md:flex-1">
          <p className="text-gray-600">
            Waste: {vehicleEntry.volumeOfWaste.toFixed(2)} Ton
          </p>
          <div className="flex items-center">
            <FaMoneyBill className="mr-2 text-xl text-gray-700" />
            <p className="text-gray-600">Amount: {amount.toFixed(2)} Tk</p>
          </div>
        </div>

        <div className="flex items-center md:flex-1">
          <FaTimesCircle className="mr-2 text-xl text-gray-700" />
          <h3 className="font-semibold text-gray-800">
            Time: {new Date(createdAt).toLocaleString()}
          </h3>
        </div>
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
    </div>
  )
}

export default BillItem
