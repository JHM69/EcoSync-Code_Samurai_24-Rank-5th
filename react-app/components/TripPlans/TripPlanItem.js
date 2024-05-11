import React from 'react'
import TripPlanInfo from '../TripPlan/ViewTripPlan'
import { BsClockHistory, BsTruck } from 'react-icons/bs'
import { GiNuclearWaste, GiPathDistance } from 'react-icons/gi'
import { BiBuildingHouse, BiDownload, BiLocationPlus, BiMoneyWithdraw } from 'react-icons/bi'
import { FaMoneyTripPlan, FaTimesCircle } from 'react-icons/fa'
import { RxClock } from 'react-icons/rx'
 
const TripPlanItem = ({ id, vehicle, tripPlanStss, tripPlanLandfills }) => {
  return (
    <div className="my-4 flex flex-col md:flex-row justify-between rounded-lg smooth-effect bg-white shadow hover:bg-green-100 transition-shadow duration-300">
      <div className="flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center mb-2">
            <BsTruck className="text-lg text-gray-700 mr-2" />
            <span className="text-lg font-semibold text-gray-800">Vehicle: {vehicle?.registrationNumber}</span>
          </div>
          <div className="flex items-center mb-2">
            <BiBuildingHouse className="text-lg text-gray-700 mr-2" />
            <span className="text-sm text-gray-600">STS: {tripPlanStss.map(tripPlanSts => `${tripPlanSts.sts.wardNumber} - ${tripPlanSts.sts.name}`).join(', ')}</span>
          </div>
          <div className="flex items-center mb-2">
            <BiLocationPlus className="text-lg text-gray-700 mr-2" />
            <span className="text-sm text-gray-600">Landfill: {tripPlanLandfills.map(tripPlanLandfill => tripPlanLandfill.landfill.name).join(', ')}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-4">
        <div className="flex items-center">
          <GiNuclearWaste className="text-lg font-bold mr-2" />
          <span> Capacity: {vehicle?.capacity?.toFixed(2)} Ton</span>
        </div>

        {/* <button onClick={() => window.open(`http://3.208.28.247:5000/tripplan/${id}/download`, '_blank')} className="flex items-center justify-center px-2 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition duration-150 ease-in-out">
          <BiDownload className="mr-1" />
        </button> */}
      </div>
    </div>
  )
}

export default TripPlanItem

