import React from 'react'
import ContractorItem from './ContractorItem'

const ContractorItems = ({ contractors, reload, setReload }) => {
  return (
    <div className="block max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
      <div className="smooth-effect my-2 flex cursor-pointer items-center text-center rounded-md border py-4 shadow-sm hover:bg-green-100 hover:shadow">
        <p className="flex-1 truncate font-bold">Company Name</p>

        <p className="flex-1 truncate font-bold">Registration Id</p>

        <p className="flex-1 truncate font-bold">Payment Per Tonnage</p>
      </div>
      {contractors?.length
        ? (
            contractors?.map((i) => <ContractorItem key={i.id} {...i} reload={reload} setReload={setReload} />)
          )
        : (
        <div className="h-[100px] w-full text-center font-bold text-gray-300">
          Add some contractor to see the data.
        </div>
          )}
    </div>
  )
}

export default ContractorItems
