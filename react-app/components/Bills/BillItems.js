import React from 'react'
import BillItem from './BillItem'

const BillItems = ({ bills }) => {
  return (
    <div className="block max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
      {bills?.length
        ? (
            bills?.map((i) => <BillItem key={i.id} {...i} />)
          )
        : (
        <div className="h-[100px] w-full text-center font-bold text-gray-300">
          No bills found for this date, Try to select longer date range
        </div>
          )}
    </div>
  )
}

export default BillItems
