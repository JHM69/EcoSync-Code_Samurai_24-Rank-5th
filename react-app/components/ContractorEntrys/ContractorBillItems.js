import React from 'react'  
import ContractorBillItem from './ContractorBillItem'
const ContractorBillItems = ({ contractorBills  }) => {
  return (
    console.log({contractorBills}),
    <div className="block max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
      {contractorBills?.length ? (
        contractorBills?.map((i) => <ContractorBillItem key={i.id} {...i} />)
      ) : (
        <div className="h-[100px] w-full text-center font-bold text-gray-300">
          Add some bills of contractor
        </div>
      )}
    </div>
  )
}

export default ContractorBillItems
