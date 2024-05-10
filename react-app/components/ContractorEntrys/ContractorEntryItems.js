import React from 'react'
import ContractorEntryItem from './ContractorEntryItem'

const ContractorEntryItems = ({ contractorEntries }) => {
  return (
    <div className="block max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
      {contractorEntries?.length
        ? (
            contractorEntries?.map((i) => <ContractorEntryItem key={i.id} {...i} />)
          )
        : (
        <div className="h-[100px] w-full text-center font-bold text-gray-300">
          Add some worker entries of contractor
        </div>
          )}
    </div>
  )
}

export default ContractorEntryItems
