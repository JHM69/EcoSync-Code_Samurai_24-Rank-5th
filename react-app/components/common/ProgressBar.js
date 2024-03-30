export default function ProgressBar ({
  currentWasteVolume,
  capacity,
  height = '200px',
  textSize = '20px'
}) {
  // Calculate the percentage of waste volume relative to the capacity
  const percentage = (currentWasteVolume / capacity) * 100

  // Function to determine the color based on the percentage
  const getColorForPercentage = (percentage) => {
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

    // Map percentage to color index
    const index = Math.min(
      Math.floor((percentage / 100) * colors.length),
      colors.length - 1
    )
    return colors[index]
  }

  // Style for the progress bar's filled portion
  const barStyle = {
    width: `${Math.max(percentage, 0)}%`, // Ensure width is not negative
    backgroundColor: getColorForPercentage(percentage) // Set color based on percentage
  }

  return (
    <div
      className={`relative h-6 w-[${height}] border-[1px] dark:bg-[#e3ffda] overflow-hidden rounded-full border-green-500 bg-gray-200 text-gray-900`}
    >
      {/* Filled part */}
      <div className="h-full rounded-l-full" style={barStyle}></div>
      {/* Text part: Centered using flex container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-[${textSize}] font-medium`}>
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
