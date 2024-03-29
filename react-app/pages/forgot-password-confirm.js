import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getBaseUrl } from '../utils/url'
import { useRouter } from 'next/router'

function ForgotPasswordConfirm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [token, setToken] = useState('')

  useEffect(() => {
    if (router.query.token) {
      setToken(router.query.token)
    } else {
      setToken(localStorage.getItem('token'))
    }
  }, [router.query.token])

  const validatePasswords = () => {
    if (!password || !confirmPassword) {
      setError('Both password fields are required')
      return false
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const onSubmit = async () => {
    if (!validatePasswords()) {
      return
    }
    const searchParams = new URLSearchParams(location.search)
    const token = searchParams.get('token')
    if (!token) {
      setError('Missing token')
      return
    }
    setLoading(true)
    console.log(token)
    try {
      await axios
        .post(getBaseUrl() + '/auth/reset-password/confirm', {
          token,
          newPassword: password,
          // You might need other data here, like a token
        })
        .then((res) => {
          console.log(res.data)
          setError('')
          setSuccess(
            'Password reset successfully. Please log in with your new password.'
          )
          window.location.href = '/'
        })
        .catch((error) => {
          console.log(error)
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-md bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-medium">
          Password Recovery
        </h1>

        <div className="flex w-full flex-col items-center justify-center gap-3">
          <img
            src="/logo.png"
            alt="logo"
            className="mx-auto mb-6 h-36 w-36 justify-center"
          />
          {error && <span className="text-sm text-red-500">{error}</span>}
          {success && <span className="text-sm text-green-500">{success}</span>}
        </div>

        {/* <div className="mb-4">
          <label htmlFor="old" className="block text-sm font-medium mb-1">
            Old Password
          </label>
          <input
            type="password"
            id="old"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter your new password"
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#76C75E]"
          />
        </div> */}

        <div className="mb-4">
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your new password"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#76C75E]"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-medium"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#76C75E]"
          />
        </div>

        <button
          type="submit"
          onClick={onSubmit}
          disabled={loading}
          className="w-full rounded-md bg-[#76C75E] py-2 font-medium text-white hover:bg-[#375f2b] focus:outline-none focus:ring-2 focus:ring-[#76C75E] focus:ring-offset-2 disabled:bg-gray-400"
        >
          {loading ? 'Resetting...' : 'Update Password'}
        </button>
      </div>
    </div>
  )
}

export default ForgotPasswordConfirm
