import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getBaseUrl } from '../utils/url'
import { useRouter } from 'next/router'

function ForgotPassword () {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [token, setToken] = useState('')

//   useEffect(() => {
//     if (router.query.token) {
//       setToken(router.query.token)
//     } else {
//       setToken(localStorage.getItem('token'))
//     }
//   }, [router.query.token])

//   const validatePasswords = () => {
//     if (!password || !confirmPassword) {
//       setError('Both password fields are required')
//       return false
//     }
//     if (password !== confirmPassword) {
//       setError('Passwords do not match')
//       return false
//     }
//     return true
//   }

  const onSubmit = async () => {

    setLoading(true)
    try {
      await axios.post(getBaseUrl() + '/auth/reset-password/initiate', {
        email
        // You might need other data here, like a token
      }).then((res) => {
        console.log(res.data)
        setError('')
        setSuccess('We have sent you an email with a link to reset your password. Please check your inbox.')
        // window.location.href = '/forgot-password-confirm'
      }).catch((error) => {
        console.log(error)
        // setError(error.response.data.message || 'Failed to reset password')
        setError(error.response.data.message || 'Failed to reset password')
      })
    } catch (error) {
      console.log(error)
      setError('Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-md shadow-md">
        <h1 className="text-2xl font-medium mb-6 text-center">Password Recovery</h1>

        <div className="w-full flex-col gap-3 justify-center items-center flex">
          <img src="/logo.png" alt="logo" className="mx-auto justify-center h-36 w-36 mb-6" />
          {error && <span className="text-sm text-red-500">{error}</span>}
          {success && <span className="text-sm text-green-500">{success}</span>}
        </div>

        <div className="mb-4">
          <label htmlFor="old" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="old"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#76C75E]"
          />
        </div>

        {/* <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your new password"
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#76C75E]"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#76C75E]"
          />
        </div> */}

        <button
          type="submit"
          onClick={onSubmit}
          disabled={loading}
          className="w-full py-2 rounded-md bg-[#76C75E] text-white font-medium hover:bg-[#375f2b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#76C75E] disabled:bg-gray-400"
        >
          {loading ? 'Sending...' : 'Send Email'}
        </button>
      </div>
    </div>
  )
}

export default ForgotPassword
