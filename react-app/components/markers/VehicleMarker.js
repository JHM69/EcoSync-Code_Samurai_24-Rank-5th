import React, { useState } from 'react'

const VehicleMarker = ({ text, address }) => {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div
      className="marker-container"
      onMouseEnter={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
    >
      <img className="marker-icon" src="https://www.svgrepo.com/show/246858/truck.svg" alt="marker" />
      {showInfo && (
        <div className="info-box">
          <p>{text}</p>
          { address && <p className='text-xs'>{'-'}{address}</p> }
        </div>
      )}
    </div>
  )
}

export default VehicleMarker
