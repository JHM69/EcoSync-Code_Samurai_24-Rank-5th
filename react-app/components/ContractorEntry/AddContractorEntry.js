import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useState } from 'react'

import Button from '../common/Button'
import { Close } from '../common/icons/Close'

import { getBaseUrl } from '../../utils/url'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import ContractorEntryForm from '../ContractorEntryForm'
const AddContractorEntry = ({ props, contractorId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleClose = () => setIsOpen(false)
  const handleOpen = () => setIsOpen(true)
  const [contractor, setContractor] = useState([])
  const onFormSubmit = async (data) => {
    try {
      console.log(data)
      toast('Adding the entry!', {
        icon: '👏',
      })
      const token = localStorage.getItem('token')
      await axios
        .post(getBaseUrl() + `/contractor/${contractorId}/entry`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response)
          toast.success('Worker Entry added successfully')
          // toast.custom((t) => (
          //   <div
          //     className={`${
          //       t.visible ? 'animate-enter' : 'animate-leave'
          //     } pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5`}
          //   >
          //     <div className="w-0 flex-1 p-4">
          //       <div className="flex items-start">
          //         <div className="flex-shrink-0 pt-0.5">
          //           <img
          //             className="h-10 w-10 rounded-full"
          //             src="/logo.png"
          //             alt=""
          //           />
          //         </div>
          //         <div className="ml-3 flex-1">
          //           <p className="text-sm font-medium text-gray-900">
          //             {response.data.landfill.name}
          //           </p>
          //           <p className="mt-1 text-sm text-gray-500">
          //             Distance {response.data.bill.distance} KM .It will take{' '}
          //             {Number(response.data.bill.duration).toFixed(2)} min.
          //           </p>
          //         </div>
          //       </div>
          //     </div>
          //     <div className="flex border-l border-gray-200">
          //       <button
          //         onClick={() => toast.dismiss(t.id)}
          //         className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          //       >
          //         Close
          //       </button>
          //     </div>
          //   </div>
          // ))
          handleClose()
        })
        .catch((error) => console.log(error))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(async () => {
    try {
      // make a axios call to get the landfill
      const token = localStorage.getItem('token')
      let contractor = await axios.get(`${getBaseUrl()}/contractor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('contractor...', contractor)
      setContractor(contractor.data)
    } catch (error) {
      console.log(error)
    }
  }, [])

  return (
    <>
      <Toaster />
      <Button onClick={handleOpen} type="button" {...props}>
        Add employee Entry
      </Button>
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
                    <h3>Add Worker Entry</h3>
                    <Close onClick={handleClose} />
                  </Dialog.Title>

                  <ContractorEntryForm
                    type={'Add'}
                    onFormSubmit={onFormSubmit}
                    handleClose={handleClose}
                    contractor={contractor}
                    contractorId={contractorId}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default AddContractorEntry
