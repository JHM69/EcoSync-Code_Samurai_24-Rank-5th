import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'

import { Close } from '../common/icons/Close'
import { FaEye } from 'react-icons/fa'
import MapView from '../common/MapView'

const Section = ({ title, children, ...props }) => (
  <section className="mb-3 rounded-md border px-3 py-4" {...props}>
    <h3 className="mb-3 text-xl font-semibold text-gray-500">{title}</h3>
    {children}
  </section>
)

const STSEntryInfo = ({ vehicleEntry, ...props }) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleClose = () => setIsOpen(false)
  const handleOpen = () => setIsOpen(true)

  return (
    <>
      <div
        onClick={handleOpen}
        className="smooth-effect m-3 rounded bg-yellow-300 p-2 text-yellow-800 shadow hover:bg-yellow-400"
      >
        <FaEye {...props} />
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="z-100 fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-y-auto rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="div"
                    className="mb-5 flex items-center justify-between text-lg font-semibold leading-6 text-gray-800"
                  >
                    <h3>Vehicle Entry Information</h3>
                    <Close onClick={handleClose} />
                  </Dialog.Title>

                  <div className="mt-6 flex flex-col md:flex-row">
                    <div className="w-full">

                    <Section title={'STS Information'}>
                        <section className="mb-3 rounded-md border px-3 py-4"> 
                              <h3 className="text-xl font-semibold text-gray-500">
                                 Ward No: {vehicleEntry?.waste?.wardNumber}
                              </h3>
                              <p className="text-gray-600"> {vehicleEntry?.waste?.address}</p>
                       </section>
                      </Section>

                      <Section title={'Vehicle Information'}>
                        <section className="mb-3 rounded-md border px-3 py-4"> 
                              <h3 className="text-xl font-semibold text-gray-500">
                                Reg No: {vehicleEntry?.vehicle?.registrationNumber}
                              </h3>
                              <p className="text-gray-600"> Capacity No: {vehicleEntry?.vehicle?.capacity}</p>
                              <p className="text-gray-600"> Truck Type: {vehicleEntry?.vehicle?.type}</p>
                       </section>
                      </Section>

                      <Section title={'Waste Information'}>
                        <h3 className="font-bond text-xl text-gray-500">
                          Waste Volume Carried : {vehicleEntry?.volumeOfWaste} Ton
                        </h3>
                      </Section>

                      <Section title={'Time'}>
                        <h3 className="font-bond text-xl text-gray-500">
                          Arrival Time : { new Date(vehicleEntry?.timeOfArrival).toLocaleString() }
                        </h3>
                        <h3 className="font-bond text-xl text-gray-500">
                          Departure Time :  { new Date(vehicleEntry?.timeOfDeparture).toLocaleString() }
                        </h3>
                      </Section>

                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default STSEntryInfo
