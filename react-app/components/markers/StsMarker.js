import React, { useState } from 'react'

const StsMarker = ({ text, address }) => {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div
      className="marker-container"
      onMouseEnter={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
    >
      <img className="marker-icon" src="https://www.svgrepo.com/show/182697/garbage-trash.svg" alt="marker" />
      {showInfo && (
        <div className="info-box">
          <p>{text}</p>
          { address && <p className='text-xs'>{'-'}{address}</p> }
        </div>
      )}
    </div>
  )
}

export default StsMarker
