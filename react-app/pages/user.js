/* eslint-disable multiline-ternary */
/* eslint-disable react/jsx-key */
/* eslint-disable react/react-in-jsx-scope */
import Layout from '../components/layout'
import UserItems from '../components/Users/UserItems'
import { useEffect, useState } from 'react'
import UserItemsSkeleton from '../components/Users/UserItemsSkeleton'
import axios from 'axios'
import { getBaseUrl } from '../utils/url'
import AddUser from '../components/User/AddUser'
import FormSection from '../components/common/Section'
import RoleItemsSkeletonItem from '../components/Users/RoleItemsSkeleton'
function Users() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  useEffect(() => {
    setLoading(true)
    const token = localStorage.getItem('token')
    if (token.length > 0) {
      axios
        .get(getBaseUrl() + '/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data)
          setUsers(res.data)
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
          console.log(err)
        })

      axios
        .get(getBaseUrl() + '/rbac/roles', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data)
          setRoles(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [])

  return (
    <div>
      <div className="flex flex-row gap-3">
        <div className="flex w-2/3 flex-col">
          <div className="mt-3 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-700">Users</h1>
            <div className="flex items-center space-x-2">
              <AddUser />
            </div>
          </div>
          {loading ? <UserItemsSkeleton /> : <UserItems users={users} />}
        </div>

        <div className="flex w-1/3 flex-col">
          <div className="mt-3 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-700">Roles</h1>
          </div>
          {loading ? (
            <RoleItemsSkeletonItem />
          ) : (
            <div className="max-w-md rounded-lg bg-gray-100 p-6 shadow-lg">
            <ul className="divide-y divide-gray-300">
              {roles.map((role, index) => (
                <li key={index} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{role.type}</h3>
                      <ul aria-label="Permissions" className="mt-2 space-y-2">
                        {role.permissions.map((permission, i) => (
                          <li key={i} className="flex items-center justify-between rounded-lg bg-white p-3 shadow">
                            <h4 className="text-sm font-medium text-gray-700">{permission.type}</h4>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <button
                        type="button"
                        aria-label={`Delete ${role.type}`}
                        className="p-2 text-red-600 transition-colors duration-150 rounded hover:bg-red-100"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        aria-label={`Edit ${role.type}`}
                        className="p-2 text-blue-600 transition-colors duration-150 rounded hover:bg-blue-100"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          )}
        </div>
      </div>
    </div>
  )
}

export default Users

Users.getLayout = function getLayout(page) {
  return <Layout meta={{ name: 'User and Access Control' }}>{page}</Layout>
}
