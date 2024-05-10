import React from 'react'
import ContractorInfo from '../Contractor/ViewContractor'

const ContractorItem = ({ name, email, image, role, id }) => {
  return (
    
      <div className="smooth-effect my-2 flex cursor-pointer items-center rounded-md border px-3 py-4 shadow-sm hover:bg-green-100 hover:shadow lg:px-6">
        <img className="mx-3 h-8 w-8 flex-shrink-0 rounded-md" src={image} />

        <p className="flex-1 truncate font-bold">{name}</p>

        <p className="flex-1 truncate px-2 font-medium">{email}</p>

        <p className="flex-1 truncate px-2 font-medium">{role.type}</p>

        <ContractorInfo contractor={{ name, email, image, role, id }} />
      </div>
    
  )
}

export default ContractorItem
