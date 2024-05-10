import React from 'react'
import ContractorInfo from '../Contractor/ViewContractor'

const ContractorItem = (data) => {

  return (
    
      <div className="smooth-effect my-2 flex cursor-pointer items-center text-center rounded-md border px-3 py-4 shadow-sm hover:bg-green-100 hover:shadow lg:px-6">
        <p className="flex-1 truncate font-bold">{data.companyName}</p>

        <p className="flex-1 truncate px-2 font-medium">{data.registrationId}</p>

        <p className="flex-1 truncate px-2 font-medium">{data.paymentPerTonnage}</p>

        <ContractorInfo contractor={data}/>
      </div>
    
  )
}

export default ContractorItem


