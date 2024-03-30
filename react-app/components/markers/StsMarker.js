import React, { useState } from 'react'
import ProgressBar from '../common/ProgressBar'
import { BsPerson } from 'react-icons/bs'
import { FaAddressBook, FaAddressCard } from 'react-icons/fa'

const StsMarker = ({ sts, minimumWasteVolume, maximumWasteVolume }) => {
  const baseSize = 28
  const [showDetails, setShowDetails] = useState(false) // State to track visibility of details

  const colors = [
    '#009e61', // Deep Green
    '#299708', // Green
    '#67ab00', // Yellow-Green
    '#8f8f00', // Yellow
    '#b77700', // Orange
    '#ae2e00', // Orange Red
    '#cb0000', // Red
    '#a00000' // Dark Red
  ]

  const size =
    baseSize +
    ((sts.currentWasteVolume - minimumWasteVolume) /
      (maximumWasteVolume - minimumWasteVolume)) *
      24
  const percentage = (sts.currentWasteVolume / sts.capacity) * 100;
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
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.3s ease' // Smooth transformation
  }

  const infoBoxStyle = {
    position: 'absolute',
    width: '200px',
    zIndex: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(4px)',
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    transition: 'opacity 0.5s ease',
    opacity: showDetails ? 1 : 0,
    pointerEvents: showDetails ? 'all' : 'none',
    transform: `translateY(${showDetails ? '0' : '-10px'})`
  }

  return (
    <div
      className="marker-icon-sts"
      style={markerStyle}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <p className="p-1 text-[8px] font-bold text-white">{sts.currentWasteVolume} T</p>
      <div className='flex flex-col gap-1 p-3' style={infoBoxStyle}>
        <p className='text-bold text-xl text-green-700'>Ward: {sts.wardNumber}</p>
        {sts.address && <div className='flex  text-md flex-row'> <FaAddressBook/> {sts.address}</div> }
        { sts?.managers.length > 0 && <div className='flex flex-row items-center'> <BsPerson/> {sts?.managers[0]?.name}</div> }
        <ProgressBar
          height = '160px'
          textSize = '42px'
          currentWasteVolume={sts.currentWasteVolume}
          capacity={sts.capacity}
        />
      </div>
    </div>
  )
}

export default StsMarker
