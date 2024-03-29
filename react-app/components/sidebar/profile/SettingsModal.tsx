import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getBaseUrl } from '../../../utils/url'
import { CirclesWithBar } from 'react-loader-spinner'

import { RxCross2 } from 'react-icons/rx'
import { get } from 'http'
import { set } from 'react-hook-form'
import { render } from '@headlessui/react/dist/utils/render'

export const SettingsModal: React.FC<{
  open: boolean
  onClose: () => void
  user: any
  setUser: any
}> = ({ open, onClose, user, setUser }) => {
  // const [userLive, setUserLive] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)

  // Effect for initializing state from localStorage
  useEffect(() => {
    // const storedUser = user || JSON.parse(localStorage.getItem('user'))
    // setUser(storedUser)
    setName(user?.name || '')
    setEmail(user?.email || '')
    setImage(user?.image || '')
  }, [user])

  const handleUpdate = async () => {
    setLoading(true)
    console.log('update')
    try {
      const token = localStorage.getItem('token')
      const res = await axios.put(
        `${getBaseUrl()}/profile`,
        {
          name,
          image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      res.data.token = token
      console.log(res.data)
      setUser(res.data)
      localStorage.setItem('user', JSON.stringify(res.data))
      setLoading(false)
      onClose()
    } catch (error) {
      alert('Failed to update profile' + error.message)
      setLoading(false)
      onClose()
      console.error('Failed to update profile', error)
    }
  }

  const signOut = async() => {
    localStorage.removeItem('user')
    onClose()
    try {
      const token = localStorage.getItem('token')
      await axios.get(
        `${getBaseUrl()}/auth/logout`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        )
        window.location.reload()
    } catch (error) {
      console.error('Failed to logout', error)
    }
    // Consider using Next.js Router for navigation without a full page reload
  }
  return (
    <div
      className={`fixed ${
        open ? 'block' : 'hidden'
      } inset-0 z-50 overflow-y-auto`}
    >
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 backdrop-blur-md backdrop-filter"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>
        {loading && (
          <div
            className="inline-block transform overflow-hidden  rounded-[8px] bg-[#ffffff] px-4 pt-5 pb-4 text-left align-bottom shadow-xl outline outline-1 outline-gray-300 transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <CirclesWithBar
              height="100"
              width="100"
              color="#4fa94d"
              outerCircleColor="#4fa94d"
              innerCircleColor="#4fa94d"
              barColor="#4fa94d"
              ariaLabel="circles-with-bar-loading"
              wrapperStyle={{}}
              wrapperClass="justify-center"
              visible={true}
            />
            <h3
              className="text-center text-xl font-medium leading-6"
              id="modal-headline"
            >
              Updating Profile...
            </h3>
          </div>
        )}
        {!loading && (
          <div
            className="inline-block transform overflow-hidden  rounded-[8px] bg-[#ffffff] px-4 pt-5 pb-4 text-left align-bottom shadow-xl outline outline-1 outline-gray-300 transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="relative sm:flex sm:items-start">
              <div className="mt-3 text-center sm:text-left">
                <h3
                  className="text-xl font-medium leading-6"
                  id="modal-headline"
                >
                  Update Profile
                </h3>
                <button
                  onClick={onClose}
                  className="smooth-effect absolute top-0 right-0 rounded p-2 text-lg hover:bg-gray-200"
                >
                  <RxCross2 />
                </button>
              </div>
            </div>

            <div className="mt-5">
              {/* Show the image  */}
              <div className="flex items-center justify-center">
                <img
                  src={image}
                  height={80}
                  width={80}
                  alt="profile"
                  className="h-20 w-20 rounded-full"
                />
              </div>
              <p className="w-full justify-center text-lg font-semibold text-gray-500">
                Role : {user?.role?.type}
              </p>
              <label htmlFor="image" className="mb-1 block text-sm font-medium">
                Image Link
              </label>
              <input
                type="text"
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Enter your image link"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#76C75E]"
              />

              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                disabled
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#76C75E]"
              />

              <label htmlFor="name" className="mb-1 block text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#76C75E]"
              />
            </div>

            <button
              className="smooth-effect  my-3 w-full rounded-md bg-[#30A986] px-4 py-2 text-white duration-200 hover:bg-[#246e62]"
              disabled={loading}
              onClick={handleUpdate}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>

            <button
              className="smooth-effect  mb-6 w-full rounded-md bg-[#db3e58] px-4 py-2 text-white duration-200 hover:bg-[#95283a]"
              onClick={() => {
                signOut()
              }}
            >
              Log out
            </button>
            <button
              className="smooth-effect  mb-6 w-full rounded-md bg-[#3e50db] px-4 py-2 text-white duration-200 hover:bg-[#502895]"
              onClick={() => {
                window.location.href = '/reset-password'
              }}
            >
              Change Password
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
