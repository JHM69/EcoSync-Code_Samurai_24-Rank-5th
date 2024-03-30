/* eslint-disable multiline-ternary */
import React from 'react'
import VehicleItem from './VehicleItem'

const VehicleItems = ({ vehicles, reload, setReload }) => {
  return (
    <div className="block  rounded max-h-[75vh] overflow-y-auto  border p-2 desktop:max-h-[80vh]">
      {vehicles && vehicles.length > 0 ? (
        <table className="w-full p-4  rounded">
          <thead>
            <tr className='bg-gray-300 w-full '>
              <th className="py-4">Registration & Type</th>
              <th className="py-4">Capacity</th>
              <th className="py-4">Fuel Cost</th>
              <th className="py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="smooth-effect my-2 cursor-pointer  border px-6 py-6 shadow-sm rounded-md hover:bg-green-100  smooth-effect "
              >
                <VehicleItem {...vehicle}  reload={reload} setReload={setReload}/>
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
