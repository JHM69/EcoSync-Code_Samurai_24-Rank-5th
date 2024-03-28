import React, { useEffect } from 'react'
import Layout from '../../components/layout'
import UserLayout from '../../components/User/UserLayout'
import DeleteSong from '../../components/User/DeleteUser'
import UpdateSong from '../../components/User/UpdateUser'
import axios from 'axios'

import { useRouter } from 'next/router'

import { getBaseUrl } from '../../utils/url'

function Song () {
  const [user, setUser] = React.useState({})
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  const router = useRouter()

  useEffect(() => {
    console.log(router.query.slug)
    setLoading(true)
    const token = localStorage.getItem('token')
    axios.get(getBaseUrl() + '/users/' + router.query.slug, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      console.log(res.data)
      setUser(res.data)
      setLoading(false)
    }
    ).catch((err) => {
      setLoading(false)
      console.log(err)
    })
  }, [router.query.slug])

  return (
    <Layout meta={{ name: user?.name || 'User' }}>
      <div>
        <header className="my-3 flex flex-col items-center justify-between rounded-md md:flex-row">
          <h1 className="mb-3 truncate text-xl font-bold text-gray-700">
            User Details
          </h1>
          <div className="flex items-center space-x-2">
            <UpdateSong user={user} />
            <DeleteSong
              userId={user?.id}
            />
          </div>
        </header>
        {!loading
          ? (
          <UserLayout user={user} />
            )
          : (
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col space-y-1">
              <div className="bg-gray-200 h-40 rounded-md animate-pulse" />
              <div className="bg-gray-200 h-20 rounded-md animate-pulse" />
            </div>
            <div className="bg-gray-200 h-10 rounded-md animate-pulse" />
            <div className="bg-gray-200 h-30 rounded-md animate-pulse" />
          </div>
            )}
      </div>
    </Layout>
  )
}

export default Song
