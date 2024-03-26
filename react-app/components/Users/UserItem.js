import React from 'react'
import { Link } from '../common/Links'

const UserItem = ({ name, email, image, role, id}) => {
  return (
   <a href={`/user/${id}`}>
    <div className="my-2 flex cursor-pointer items-center rounded-md border px-3 py-4 smooth-effect shadow-sm hover:shadow hover:bg-green-200 lg:px-6">
       <img className="flex-shrink-0 w-8 h-8 mx-3 rounded-md" src={image} />

        <p className="flex-1 truncate font-bold">{name}</p> 

       <p className="flex-1 truncate px-2 font-medium">{email}</p>

      <p className="flex-1 truncate px-2 font-medium">{role.type}</p>
      
    </div> 
    </a>
  )
}

export default UserItem
