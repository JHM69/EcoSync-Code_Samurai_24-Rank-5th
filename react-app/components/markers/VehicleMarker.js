import React, { useState } from 'react'

const VehicleMarker = ({ vehicle }) => {
  const baseSize = 28
  const [showDetails, setShowDetails] = useState(false) // State to track visibility of details

  const markerStyle = {
    height: `${baseSize}px`,
    width: `${baseSize}px`,
    borderRadius: '10%',
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
    backdropFilter: 'blur(2px)',
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
      className="marker-icon"
      style={markerStyle}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >

      <img className='h-12 w-12' src="/truck.png" alt="marker" />

      <div className='flex flex-col gap-1 p-3' style={infoBoxStyle}>
        <p className='text-bold text-xl text-green-700'>{vehicle.registrationNumber}</p>
      </div>
    </div>
  )
}

export default VehicleMarker
