import React from 'react'
import UserItem from './UserItem'

const UserItems = ({ users }) => {
  return (
    <div className="block max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
      {users?.length
        ? (
            users?.map((i) => <UserItem key={i.id} {...i} />)
          )
        : (
        <div className="h-[100px] w-full text-center font-bold text-gray-300">
          Add some users to see the data.
        </div>
          )}
    </div>
  )
}

export default UserItems
