import React, { useEffect } from 'react'
import Layout from '../../components/layout'
import UserLayout from '../../components/User/UserLayout'
import DeleteVehicle from '../../components/User/DeleteUser'
import UpdateVehicle from '../../components/User/UpdateUser'
import axios from 'axios'

import { useRouter } from 'next/router'

import { getBaseUrl } from '../../utils/url'

export default function Vehicle() {
  const [user, setUser] = React.useState({})
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const router = useRouter()

  useEffect(() => {
    console.log(router.query.slug)
    const token = localStorage.getItem('token')
    axios.get(getBaseUrl() + '/users/' + router.query.slug, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      console.log(res.data)
      setUser(res.data)
    }
    ).catch((err) => {
      console.log(err)
    })
  }, [router.query.slug])

  return (
    <Layout meta={{ name: user?.name || 'Vehicle' }}>
      <div>
        <header className="my-3 flex flex-col items-center justify-between rounded-md md:flex-row">
          <h1 className="mb-3 truncate text-xl font-bold text-gray-700">
            Vehicle Details
          </h1>
          <div className="flex items-center space-x-2">
            <UpdateVehicle user={user} />
            <DeleteVehicle
              slug={user?.slug}
            />
          </div>
        </header>
        {user
          ? (
          <UserLayout user={user} />
            )
          : (
          <div className="w-full text-center text-2xl font-bold text-gray-300">
            No details
          </div>
            )}
      </div>
    </Layout>
  )
}
