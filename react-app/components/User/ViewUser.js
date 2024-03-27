import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useState } from 'react'

import { Close } from '../common/icons/Close'
import { getBaseUrl } from '../../utils/url'
import axios from 'axios'

import { FaEye } from 'react-icons/fa'
import UserLayout from './UserLayout'
const UserInfo = ({ user, ...props }) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleClose = () => setIsOpen(false)
  const handleOpen = () => setIsOpen(true)

  const [userLive, setUserLive] = React.useState({...user})
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  useEffect(() => {
    setLoading(true)
    const token = localStorage.getItem('token')
    axios
      .get(getBaseUrl() + '/users/' + user.id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data)
        setUserLive(res.data)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
  }, [user.id])

  return (
    <>
      <div  onClick={handleOpen} {...props} className="smooth-effect m-3 rounded bg-yellow-300 p-2 text-yellow-800 shadow hover:bg-yellow-400">
        <FaEye />
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
                <Dialog.Panel className="w-full max-w-xl transform overflow-y-auto rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="div"
                    className="mb-5 flex items-center justify-between text-lg font-semibold leading-6 text-gray-800"
                  >
                    <h3>User Information</h3>
                    <Close onClick={handleClose} />
                  </Dialog.Title>

                  {!loading ? (
                    <UserLayout user={userLive} />
                  ) : (
                    <div className="flex flex-col space-y-3">
                      <div className="flex flex-col space-y-1">
                        <div className="h-40 animate-pulse rounded-md bg-gray-200" />
                        <div className="h-20 animate-pulse rounded-md bg-gray-200" />
                      </div>
                      <div className="h-10 animate-pulse rounded-md bg-gray-200" />
                      <div className="h-30 animate-pulse rounded-md bg-gray-200" />
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default UserInfo
