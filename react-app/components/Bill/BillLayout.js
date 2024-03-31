/* eslint-disable multiline-ternary */
import React from 'react'
import Button from '../common/Button'
import { FaDownload } from 'react-icons/fa'

const Section = ({ title, children, ...props }) => (
  <section className="mb-3 rounded-md border px-3 py-4" {...props}>
    <h3 className="mb-3 text-xl font-semibold text-gray-500">{title}</h3>
    {children}
  </section>
)

const BillLayout = ({
  id, 
  vehicleEntry,
  amount,
  paid,
  createdAt,
  distance,
  duration,
}) => {
  const downloadBill = () => {
    console.log('Downloading Bill')
    // create a new window and open the pdf localhost:3000/bill/:id/download
    window.open(`/bill/${id}/download`, '_blank')
  }

  return (
    <div className="mt-6 flex flex-col md:flex-row">
      <div className="w-full">
        <Section title={'Download Bill'}>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => downloadBill()}
              className="rounded-md bg-green-500 px-4 py-2 text-white flex flex-row items-center justify-center hover:bg-green-600"
            >
             <FaDownload/> Download
            </Button>
          </div>
        </Section>

        <div className="flex flex-col items-center p-3">
          <h3 className="text-xl font-semibold text-gray-800">
            Vehicle: {vehicleEntry?.vehicle?.registrationNumber}
          </h3>

          <div className="my-2 h-4 bg-gray-300" />

          <h3 className="text-xl font-semibold text-gray-800">
            STS: {vehicleEntry?.sts?.wardNumber} - {vehicleEntry?.sts?.name}
          </h3>
        </div>

        <div className="flex flex-col items-center p-3">
          <h3 className="text-xl font-semibold text-gray-800">
            distance : {distance} km
          </h3>

          <div className="my-2 h-4 bg-gray-300" />
          <h3 className="text-xl font-semibold text-gray-800">
            duration : {duration} mins
          </h3>
        </div>

        <div className="flex-1">Waste: {vehicleEntry.volumeOfWaste} Ton</div>

        <div className="flex-1">Amount : {amount} Tk</div>

        <div className="flex-1">
          <h3 className="text-md text-gray-800">
            Time: {new Date(createdAt).toLocaleString()}
          </h3>
        </div>

        {
          paid ? (
            <div className="flex-1">
              <h3 className="text-md text-green-800">Paid</h3>
            </div>
          ) : (
            <div className="flex-1">
              <h3 className="text-md text-red-800">Unpaid</h3>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default BillLayout
