/* eslint-disable no-unused-vars */
import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'

import { Close } from '../common/icons/Close'
import { getBaseUrl } from '../../utils/url'
import axios from 'axios'

import { BiPencil } from 'react-icons/bi'
import StsEntryForm from '../StsEntryForm'
const UpdateStsEntry = ({ vehicleEntry, stsId,...props }) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleClose = () => setIsOpen(false)
  const handleOpen = () => setIsOpen(true)

  const onFormSubmit = async (data) => {
    const token = localStorage.getItem('token')
    await axios
      .put(getBaseUrl() + `/sts/${stsId}/entry`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        console.log(res)
        if (res.status === 200 || res.status === 201) {
          alert('Successfully Added.')
        } else {
          alert(res.status)
          console.log(res)
        }
      })
  }

  return (
    <>
     <div onClick={handleOpen} className='smooth-effect hover:bg-green-400 text-green-800 bg-green-300 rounded p-2 m-3 shadow'>
         <BiPencil {...props} />
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
                    <h3>Update Vehicle Entry</h3>
                    <Close onClick={handleClose} />
                  </Dialog.Title>

                  <StsEntryForm
                    defaultValues={vehicleEntry}
                    type={'Update'}
                    onFormSubmit={onFormSubmit}
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

export default UpdateStsEntry
