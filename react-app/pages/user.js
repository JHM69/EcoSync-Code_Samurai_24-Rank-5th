import Layout from '../components/layout'
import UserItems from '../components/Users/UserItems'
import { useEffect, useState } from 'react'
import UserItemsSkeleton from '../components/Users/UserItemsSkeleton'
import axios from 'axios'
import { getBaseUrl } from '../utils/url'
import AddUser from '../components/User/AddUser'
function Songs () {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const token = localStorage.getItem('token')
      axios.get(getBaseUrl() + '/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => {
        console.log(res.data)
        setUsers(res.data)
      }).catch((err) => {
        console.log(err)
      })
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <div>
      <header className="mt-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-700">User and Access Control</h1>
        <div className="flex items-center space-x-2">
          <AddUser />
        </div>
      </header>
      <div>

    </div>
      {loading
        ? (
        <UserItemsSkeleton />
          )
        : (
        <UserItems users={users} />
          )}
    </div>
  )
}

export default Songs

Songs.getLayout = function getLayout (page) {
  return <Layout meta={{ name: 'User and Access Control' }}>{page}</Layout>
}
