/* eslint-disable react/react-in-jsx-scope */
function ProgressBar ({ currentWasteVolume, capacity, height='200px', textSize = '20px' }) {
  // Calculate the percentage of waste volume relative to the capacity
  const percentage = (currentWasteVolume / capacity) * 100

  // Style for the progress bar's filled portion
  const barStyle = {
    width: `${Math.max(percentage, 0)}%` // Ensure width is not negative
  }

  return (
      <div className={`relative h-6 w-[${height}] overflow-hidden rounded-full border-[1px] border-green-500 bg-gray-200 text-gray-900 dark:bg-[#e3ffda]`}>
        {/* Filled part */}
        <div
          className="h-full rounded-l-full bg-green-500"
          style={barStyle}
        ></div>
        {/* Text part: Centered using flex container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-[${textSize}] font-medium `}>
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

export default ProgressBar