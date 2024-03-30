import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'

import { Close } from '../common/icons/Close'
import { FaEye } from 'react-icons/fa'
import MapView from '../common/MapView'
export function ProgressBar({ currentWasteVolume, capacity }) {
  // Calculate the percentage of waste volume relative to the capacity
  const percentage = (currentWasteVolume / capacity) * 100

  // Style for the progress bar's filled portion
  const barStyle = {
    width: `${Math.max(percentage, 0)}%`, // Ensure width is not negative
  }

  return (
    <div className="relative h-6 w-[200px] overflow-hidden rounded-full border-[1px] border-green-500 bg-gray-200 text-gray-900 dark:bg-[#e3ffda]">
      {/* Filled part */}
      <div
        className="h-full rounded-l-full bg-green-500"
        style={barStyle}
      ></div>
      {/* Text part: Centered using flex container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium  ">
          {currentWasteVolume >= 0
            ? `${currentWasteVolume}/${capacity} Ton (${percentage.toFixed(
                2
              )}%)`
            : `0/${capacity} Ton (0%)`}
        </span>
      </div>
    </div>
  )
}
const Section = ({ title, children, ...props }) => (
  <section className="mb-3 rounded-md border px-3 py-4" {...props}>
    <h3 className="mb-3 text-xl font-semibold text-gray-500">{title}</h3>
    {children}
  </section>
)

const STSInfo = ({ sts, ...props }) => {
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
                    <h3>STS Information</h3>
                    <Close onClick={handleClose} />
                  </Dialog.Title>

                  <div className="mt-6 flex flex-col md:flex-row">
                    <div className="w-full">
                      <Section title={'STS Information'}>
                        <section className="mb-3 rounded-md border px-3 py-4">
                          <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
                              <img
                                src={sts.logo || '/logo.png'}
                                alt={sts.wardNumber}
                                width={64}
                                height={64}
                              />
                            </div>
                            <div className="flex flex-col">
                              <h3 className="text-xl font-semibold text-gray-500">
                                {sts.name || sts.wardNumber}
                              </h3>
                              <p className="text-gray-600">{sts.address}</p>
                            </div>
                          </div>
                        </section>
                      </Section>

                      <Section title={'Location'}>
                        <MapView
                          lat={sts.lat}
                          lon={sts.lon}
                          name={sts.wardNumber}
                          address={sts.address}
                        />
                      </Section>

                      <Section title={'Waste Information'}>
                        <h3 className="font-bond text-xl text-gray-500">
                          capacity : {sts?.capacity}
                        </h3>
                        <h3 className="font-bond text-xl text-gray-500">
                          current waste volume : {sts?.currentWasteVolume}
                        </h3>
                        <ProgressBar
                          currentWasteVolume={sts.currentWasteVolume}
                          capacity={sts.capacity}
                        />
                      </Section>

                      <Section title={'STS Managers'}>
                        {sts.managers.map((manager) => (
                          <div
                            key={sts.id}
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

export default STSInfo
