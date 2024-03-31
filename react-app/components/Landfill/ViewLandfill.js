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


const LandfillInfo = ({ landfill, ...props }) => {
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
                    <h3>Landfill Information</h3>
                    <Close onClick={handleClose} />
                  </Dialog.Title>

                  <div className="mt-6 flex flex-col md:flex-row">
                    <div className="w-full">
                      <Section title={'Landfill Information'}>
                        <section className="mb-3 rounded-md border px-3 py-4">
                          <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
                               
                            </div>
                            <div className="flex flex-col">
                              <h3 className="text-xl font-semibold text-gray-500">
                                {landfill.name}
                              </h3>
                              <p className="text-gray-600">{landfill.address}</p>
                            </div>
                          </div>
                        </section>
                      </Section>

                      <Section title={'Location'}>
                        <MapView
                          lat={landfill.lat}
                          lon={landfill.lon}
                          name={landfill.name}
                          address = {landfill.address}
                        />
                        


                      </Section>

                      <Section title={'Waste Information'}>
                        <h3 className="font-bond text-xl text-gray-500">
                          capacity : {landfill?.capacity}
                        </h3>
                        
                         
                      </Section>

                      <Section title={'Working Time'}>
                        <h3 className="font-bond text-xl text-gray-500">
                          Starting Time : {landfill?.startTime}
                        </h3>
                        
                        <h3 className="font-bond text-xl text-gray-500">
                          Ending Time : {landfill?.endTime}
                        </h3>
                      </Section>

                      <Section title={'Landfill Managers'}>
                        {landfill.managers.map((manager) => (
                          <div
                            key={landfill.id}
                            className="mb-3 rounded-md border px-3 py-4"
                          >
                            <p className="text-xl font-semibold text-gray-500">
                              {manager.name}
                            </p>
                          </div>
                        ))}
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

export default LandfillInfo
