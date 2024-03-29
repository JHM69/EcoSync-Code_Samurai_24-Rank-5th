import React, { useState, useEffect } from 'react'
import { getBaseUrl } from '../utils/url'
import axios from 'axios'
import Script from 'next/script'
import { BiError, BiErrorCircle } from 'react-icons/bi'

const TEST_SITE_KEY = '6Lea46QpAAAAAN2pYb_V_PQEpkQBBc3Z6YS_sApT'

function login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recaptchaToken, setRecaptchaToken] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
      setError('Please Complete the Recaptcha')
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(
        getBaseUrl() + '/auth/login',
        {
          email,
          password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ).then(response => {
        const user = response.data.user
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', user.token)
        window.location.href = '/'
        console.log(response.data.message)
        setError(response.data.message)
      }).catch(error => {
        console.log(error)
        setError(error.response.data.message)
      })
    } catch (error) {
      console.log(error)
      // create a array of string
      const messages = [
        'Do DNCC know you?',
        "DNCC don't know you",
        "Who are you? DNCC don't know you!"
      ]
      setError(messages[Math.floor(Math.random() * messages.length)])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Script
        src="https://www.google.com/recaptcha/api.js"
        strategy="afterInteractive"
      />
      <div className="flex min-h-screen">
        {/* Left side - Logo */}
        <div className="flex w-1/2 flex-col items-center justify-center bg-white">
          <img src="/logo.png" alt="logo" className="mb-6 w-48" />
          <p className="mb-4 text-center text-gray-600">
            EcoSync is a platform that helps you to manage your waste and
            recycling needs.
          </p>
          <br />
          <br />
          <p className="text-center text-gray-600">
            Copyright &copy; 2024 Quantum Guys - Jagannath University.
            <br /> All rights reserved.
          </p>
        </div>
        {/* Right side - Form */}
        <div
          className="flex w-1/2 items-center justify-center bg-cover"
          style={{
            backgroundImage:
              "url('https://w0.peakpx.com/wallpaper/405/937/HD-wallpaper-pattern-104-pattern-white-green-lime.jpg')"
          }}
        >
          <div className="max-w-md rounded-md bg-white p-8 shadow-md">
            <h1 className="mb-6 text-center text-2xl font-medium">Login</h1>
             {
              error && <div className="text-sm items-center justify-center gap-2 font-bold my-4 w-full flex flex-row text-red-500"> <BiError/> {error}</div>
             }
            <div className="mb-4">
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email Address
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                placeholder="Enter your email"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#76C75E]"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#76C75E]"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword
                    ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      width="15"
                      height="15"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                      )
                    : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      width="15"
                      height="15"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                      )}
                </button>
              </div>
            </div>
            {isClient && (
              <div className="mb-4 flex justify-center">
                <div
                  className="g-recaptcha"
                  data-sitekey={TEST_SITE_KEY}
                  data-callback="recaptchaCallback"
                ></div>
              </div>
            )}
            <button
              type="submit"
              onClick={onSubmit}
              disabled={loading}
              className="w-full rounded-md bg-green-500 py-2 font-medium text-white hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-[#76C75E] focus:ring-offset-2 disabled:bg-gray-400"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
            {/* forgot password */}
            <div className="mt-4 text-center">
              <a href="/forgot-password" className="text-sm text-blue-500">
                Forgot Password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default login
