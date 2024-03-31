import React, { useState } from 'react'
import ProgressBar from '../common/ProgressBar'
import { BsPeopleFill, BsPerson } from 'react-icons/bs'
import { FaAddressBook, FaAddressCard, FaPeopleCarry, FaTruck } from 'react-icons/fa'
import { GiNuclearWaste } from 'react-icons/gi'

const StsMarker = ({ sts, minimumWasteVolume, maximumWasteVolume }) => {
  const baseSize = 28
  const [showDetails, setShowDetails] = useState(false) // State to track visibility of details

  const colors = [
    'rgba(0, 158, 97, 0.9)', // Deep Green with 80% opacity
    'rgba(41, 151, 8, 0.9)', // Green with 80% opacity
    'rgba(103, 171, 0, 0.9)', // Yellow-Green with 80% opacity
    'rgba(143, 143, 0, 0.9)', // Yellow with 80% opacity
    'rgba(183, 119, 0, 0.9)', // Orange with 80% opacity
    'rgba(174, 46, 0, 0.9)', // Orange Red with 80% opacity
    'rgba(203, 0, 0, 0.9)', // Red with 80% opacity
    'rgba(160, 0, 0, 0.9)', // Dark Red with 80% opacity
  ]

  const size =
    baseSize +
    ((sts.currentWasteVolume - minimumWasteVolume) /
      (maximumWasteVolume - minimumWasteVolume)) *
      24
  const percentage = (sts.currentWasteVolume / sts.capacity) * 100
  const index = Math.min(
    Math.floor((percentage / 100) * colors.length),
    colors.length - 1
  )

  const markerStyle = {
    height: `${size}px`,
    width: `${size}px`,
    backgroundColor: colors[index],
    borderRadius: '50%',
    padding: '2px',
    alpha: 0.5,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'opacity 0.5s ease',
  }

  const infoBoxStyle = {
    position: 'absolute',
    width: '250px',
    zIndex: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(4px)',
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    transition: 'opacity 0.5s ease',
    opacity: showDetails ? 1 : 0,
    pointerEvents: showDetails ? 'all' : 'none',
    transform: `translateY(${showDetails ? '0' : '-10px'})`,
  }

  return (
    <div
      className="marker-icon-sts"
      style={markerStyle}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <p className="p-1 text-[8px] font-bold text-white">
        {sts.currentWasteVolume} T
      </p>
      <div className="flex flex-col gap-1 p-3" style={infoBoxStyle}>
        <p className="text-2xl font-bold text-green-700">
          Ward: {sts.wardNumber}
        </p>
        {sts.address && (
             <div className="text-[14px] flex flex-row font-semibold">
            {' '}
            <FaAddressBook /> {sts.address}
          </div>
        )}
        {sts.vehicleEntries && (
          <>
            <div className="text-[14px] flex flex-row font-semibold">
              <FaTruck /> Truck Entries: {sts.vehicleEntries.length}
            </div>
            <div className="text-[14px] flex flex-row font-semibold">
              <GiNuclearWaste /> Waste Transported:
              {sts.vehicleEntries.reduce(
                (acc, curr) => acc + curr.volumeOfWaste,
                0
              )}{' '}
              Ton
            </div>
          </>
        )}
        {sts?.managers.length > 0 && (
          <div className="text-[14px] flex flex-row font-semibold">
            <BsPeopleFill /> Managers:{' '}
            {sts?.managers.map((manager) => manager.name).join(', ')}
          </div>
        )}
        <ProgressBar
          height="160px"
          textSize="42px"
          currentWasteVolume={sts.currentWasteVolume}
          capacity={sts.capacity}
        />
      </div>
    </div>
  )
}

export default StsMarker
