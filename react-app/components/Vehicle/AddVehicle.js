import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'

import Button from '../common/Button'
import { Close } from '../common/icons/Close'
import VehicleForm from '../VehicleForm'

import { getBaseUrl } from '../../utils/url'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
const AddVehicle = ({ reload, setReload }) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleClose = () => setIsOpen(false)
  const handleOpen = () => setIsOpen(true)
  const onFormSubmit = async (data) => {
    try {
      console.log(data)
      const token = localStorage.getItem('token')
      await axios
        .post(getBaseUrl() + '/vehicle', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response)
          toast.success('Vehicle added successfully')
          handleClose()
          setReload(!reload)
          // window.location.reload()
        })
        .catch((error) => {
          console.log(error)
          toast.error('Failed to add vehicle')
        })
    } catch (error) {
      console.log(error)
      toast.error('Failed to add vehicle')
    }
  }

  return (
    <>
      <Toaster />
      <Button onClick={handleOpen} type="button">
        Add Vehicle
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
                    <h3>Add Vehicle</h3>
                    <Close onClick={handleClose} />
                  </Dialog.Title>

                  <VehicleForm type={'Add'} onFormSubmit={onFormSubmit} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default AddVehicle
