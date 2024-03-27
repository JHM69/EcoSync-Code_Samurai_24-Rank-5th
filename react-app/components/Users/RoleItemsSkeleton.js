import React from 'react'

const RoleItemsSkeleton = () => {
  return (
    <div className="cursor-loading my-2 flex flex-col animate-pulse space-x-16 rounded-md border px-6 py-4 shadow-sm">
      <div className="h-10 flex-1 rounded bg-gray-200"></div>
      <div className="h-3 flex-1 rounded bg-gray-200"></div>
    </div>
  )
}

const RoleItemsSkeletonItem = () => (
  <>
    {new Array(4).fill(0).map((_, idx) => (
      <RoleItemsSkeleton key={idx} />
    ))}
  </>
)

export default RoleItemsSkeletonItem
