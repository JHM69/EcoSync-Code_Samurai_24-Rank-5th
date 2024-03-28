import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useState } from 'react'
import { Bars } from 'react-loader-spinner'
import Button from '../common/Button'
import { Close } from '../common/icons/Close'
import UserForm from '../UserForm'

import { getBaseUrl } from '../../utils/url'
import axios from 'axios'
const AddUser = ({ props }) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleClose = () => setIsOpen(false)
  const handleOpen = () => setIsOpen(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    props.setLoading(loading)
  }, [loading])

  const onFormSubmit = async (data) => {
    console.log(data)
    console.log('token')
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios
        .post(getBaseUrl() + `/auth/create`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res)
          if (res.status === 200 || res.status === 201) {
            setLoading(false)
            handleClose()
            props.setUsers([...props.users, res.data.user])
          } else {
            alert(res.status)
            setLoading(false)
            handleClose()
            console.log(res)
          }
        })
    } catch (error) {
      setLoading(false)
      handleClose()
      console.log(error)
    }
  }
  if (loading) {
    return (
      <>
        <div className="justify-center bg-white">
          <Bars
            height="100"
            width="100"
            color="#4fa94d"
            outerCircleColor="#4fa94d"
            innerCircleColor="#4fa94d"
            barColor="#4fa94d"
            ariaLabel="circles-with-bar-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      </>
    )
  }
  return (
    <>
      <Button onClick={handleOpen} type="button" {...props}>
        Add User
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
                <Dialog.Panel className="w-full max-w-xl transform overflow-y-auto rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="div"
                    className="mb-5 flex items-center justify-between text-lg font-semibold leading-6 text-gray-800"
                  >
                    <h3>Add User</h3>
                    <Close onClick={handleClose} />
                  </Dialog.Title>

                  <UserForm type={'Add'} onFormSubmit={onFormSubmit} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default AddUser
