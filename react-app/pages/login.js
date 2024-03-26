import React, { useState, useEffect } from 'react'

import { getBaseUrl } from '../utils/url'
import axios from 'axios'

import Script from 'next/script'

const TEST_SITE_KEY = '6Lea46QpAAAAAN2pYb_V_PQEpkQBBc3Z6YS_sApT'
const DELAY = 1500

function login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recaptchaToken, setRecaptchaToken] = useState('')

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    window.recaptchaCallback = (response) => {
      setRecaptchaToken(response)
    }

    // Cleanup to avoid memory leaks
    return () => {
      delete window.recaptchaCallback
    }
  }, [])

  useEffect(() => {
    // Set isClient to true in useEffect, which runs on client-side
    setIsClient(true)
  }, [])

  const onSubmit = async () => {
    setLoading(true)

    if (!recaptchaToken) {
      setError('Please verify that you are not a robot')
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(getBaseUrl() + '/auth/login', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const user = response.data.user
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', user.token)
      window.location.href = '/'
      console.log(response.data.message)
      setError(response.data.message)
    } catch (error) {
      console.log(error)
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (<>
  <Script
        src="https://www.google.com/recaptcha/api.js"
        strategy="afterInteractive"
      />
    <div className="min-h-screen  flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-md shadow-md items-center">
        <h1 className="text-2xl font-medium mb-6 text-center">Login</h1>

       <div className='w-full flex-col gap-3 justify-center items-center flex'>

       <img src="/logo.png" alt="logo" className="mx-auto justify-center h-36 w-36 mb-6" />
       <span className="text-sm text-red-500">{error}</span>

       </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#76C75E]"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#76C75E]"
          />
        </div>

        {isClient && (
        <div className="flex justify-center my-4">
          <div className="g-recaptcha"
               data-sitekey = {TEST_SITE_KEY}
               data-callback="recaptchaCallback"></div>
        </div>
        )}

        <button
          type="submit"
          onClick={onSubmit}
          disabled={loading}
          className="w-full py-2 rounded-md bg-[#76C75E] text-white font-medium hover:bg-[#375f2b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#76C75E] disabled:bg-gray-400"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </div>
    </div>
    </>
  )
}

export default login
