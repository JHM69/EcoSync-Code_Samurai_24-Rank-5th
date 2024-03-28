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
import RoleItemsSkeletonItem from '../components/Users/RoleItemsSkeleton'
import UpdateRole from '../components/User/UpdateRole'
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
              <AddUser props={{users ,setUsers, setLoading}}/>
            </div>
          </div>
          {loading ? <UserItemsSkeleton /> : <UserItems users={users} />}
        </div>

        <div className="flex w-1/3 flex-col">
          <div className="mt-3 flex items-center justify-between">
            <h1 className="my-3 text-2xl font-bold text-gray-700 ">Roles</h1>
          </div>
          {loading ? (
            <RoleItemsSkeletonItem />
          ) : (
            <div className="block max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
              {roles?.length ? (
                roles?.map((role) => {
                  return (
                    <div className="smooth-effect my-1 flex cursor-pointer items-center rounded-md border px-3 py-2 shadow-sm hover:bg-green-200 hover:shadow lg:px-2">
                      <p className="flex-1 truncate font-bold">{role.type}</p>
                      <p className="flex-1 truncate px-2 font-medium">
                        <UpdateRole role={role} />
                      </p>
                    </div>
                  )
                })
              ) : (
                <div className="h-[100px] w-full text-center font-bold text-gray-300">
                  Add some roles to see the data.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Users

Users.getLayout = function getLayout(page) {
  return (
    <Layout
      meta={{ name: 'User and Access Control' }}
    >
      {page}
    </Layout>
  )
}
