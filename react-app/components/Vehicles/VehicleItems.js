import React from 'react'
import VehicleItem from './VehicleItem'


const VehicleItems = ({ vehicles }) => {
  return (
    <div className="block max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
      {vehicles && vehicles.length > 0 ? (
        <table className="w-full p-4">
          <thead>
            <tr className='bg-gray-300'>
              <th className="py-4">Registration & Type</th>
              <th className="py-4">Capacity</th>
              <th className="py-4">Location</th>
              <th className="py-4">Fuel Cost</th>
              <th className="py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="smooth-effect my-2 cursor-pointer rounded-md border px-6 py-6 shadow-sm hover:bg-green-200 hover:shadow-lg transition-all duration-300 ease-in-out"
              >
                <VehicleItem {...vehicle} />
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        /* {vehicles?.length ? (
        vehicles?.map((i) => <VehicleItem key={i.id} {...i} />) */
        <div className="h-[100px] w-full text-center font-bold text-gray-300">
          Add some Vehicles to see the data.
        </div>
      )}
    </div>
  )
}

export default VehicleItems
