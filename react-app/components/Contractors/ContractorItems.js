import React from 'react'
import ContractorItem from './ContractorItem'

const ContractorItems = ({ Contractors, reload, setReload }) => {
  return (
    <div className="block max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
      {Contractors?.length ? (
        contractors?.map((i) => <ContractorItem key={i.id} {...i} reload={reload} setReload={setReload} />)
      ) : (
        <div className="h-[100px] w-full text-center font-bold text-gray-300">
          Add some contractor to see the data.
        </div>
      )}
    </div>
  )
}

export default ContractorItems
